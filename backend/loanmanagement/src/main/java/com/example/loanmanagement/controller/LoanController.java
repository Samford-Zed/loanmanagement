// src/main/java/com/example/loanmanagement/controller/LoanController.java
package com.example.loanmanagement.controller;

import com.example.loanmanagement.dto.LoanApplicationRequest;
import com.example.loanmanagement.dto.LoanResponse;
import com.example.loanmanagement.model.Loan;
import com.example.loanmanagement.model.Repayment;
import com.example.loanmanagement.service.LoanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    /**
     * CUSTOMER-only (enforced in SecurityConfig).
     * Creates a loan + repayment schedule for the authenticated user.
     */
    @PostMapping("/apply")
    public ResponseEntity<?> applyLoan(
            @Valid @RequestBody LoanApplicationRequest loanRequest,
            @AuthenticationPrincipal UserDetails user
    ) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Loan loan = toEntity(loanRequest);

        try {
            Loan created = loanService.createLoanWithRepayments(loan, user.getUsername());
            return ResponseEntity.ok(toDto(created));
        } catch (IllegalStateException ise) {
            // e.g. user already has a non-rejected loan
            return ResponseEntity.status(409).body(ise.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to create loan");
        }
    }

    /**
     * AUTH required.
     * Returns loans for the current authenticated user.
     * Call this from the Customer dashboard on page load.
     */
    @GetMapping("/my")
    public ResponseEntity<?> getMyLoans(@AuthenticationPrincipal UserDetails user) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            List<LoanResponse> list = loanService.getLoansByUserEmail(user.getUsername());
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to load your loans");
        }
    }

    /**
     * Public GET (per SecurityConfig).
     * Fetch a single loan by id (useful for detail pages).
     */
    @GetMapping("/{loanId}")
    public ResponseEntity<LoanResponse> getLoan(@PathVariable Long loanId) {
        Loan loan = loanService.getLoanById(loanId);
        return ResponseEntity.ok(toDto(loan));
    }

    /**
     * Public GET (or protect if you prefer).
     * List repayments for a loan.
     */
    @GetMapping("/{loanId}/repayments")
    public ResponseEntity<List<Repayment>> getRepayments(@PathVariable Long loanId) {
        return ResponseEntity.ok(loanService.getRepayments(loanId));
    }

    /* ----------------- helpers ----------------- */

    private Loan toEntity(LoanApplicationRequest dto) {
        Loan loan = new Loan();
        loan.setAmount(dto.getAmount());
        loan.setLoanType(dto.getLoanType());
        loan.setTenureMonths(dto.getTenureMonths());
        loan.setPurpose(dto.getPurpose());
        loan.setAnnualIncome(dto.getAnnualIncome());

        // use whatever logic/config you have for interest
        loan.setAnnualInterestRate(10.0);
        loan.setStatus(Loan.Status.PENDING);
        loan.setStartDate(LocalDate.now());
        return loan;
    }

    private LoanResponse toDto(Loan loan) {
        LoanResponse res = new LoanResponse();
        res.setId(loan.getId());
        res.setAmount(loan.getAmount());
        res.setLoanType(loan.getLoanType());
        res.setTenureMonths(loan.getTenureMonths());
        res.setPurpose(loan.getPurpose());
        res.setAnnualIncome(loan.getAnnualIncome());
        res.setStatus(loan.getStatus().name());
        res.setAdminRemark(loan.getAdminRemark());
        res.setStartDate(loan.getStartDate());
        res.setEmi(loan.getEmi());

        // If you added these fields to LoanResponse, populate them:
        try {
            if (loan.getUser() != null) {
                // will compile only if fields exist on DTO
                LoanResponse.class.getDeclaredField("customerName");
                LoanResponse.class.getDeclaredField("customerEmail");
                res.setCustomerName(loan.getUser().getName());
                res.setCustomerEmail(loan.getUser().getEmail());
            }
        } catch (NoSuchFieldException ignored) {}

        return res;
    }
}
