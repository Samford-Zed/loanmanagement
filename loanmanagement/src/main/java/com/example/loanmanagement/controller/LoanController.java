package com.example.loanmanagement.controller;

import com.example.loanmanagement.dto.LoanApplicationRequest;
import com.example.loanmanagement.dto.LoanResponse;
import com.example.loanmanagement.model.Loan;
import com.example.loanmanagement.model.Repayment;
import com.example.loanmanagement.service.LoanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    // Create loan & generate repayments
    @PostMapping
    public ResponseEntity<LoanResponse> createLoan(@RequestBody @Valid LoanApplicationRequest loanRequest) {
        Loan loanEntity = convertToEntity(loanRequest);
        Loan createdLoan = loanService.createLoanWithRepayments(loanEntity);
        LoanResponse response = convertToDto(createdLoan);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{loanId}")
    public ResponseEntity<LoanResponse> getLoan(@PathVariable Long loanId) {
        Loan loan = loanService.getLoanById(loanId);
        LoanResponse response = convertToDto(loan);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{loanId}/repayments")
    public ResponseEntity<List<Repayment>> getRepayments(@PathVariable Long loanId) {
        List<Repayment> repayments = loanService.getRepayments(loanId);
        return ResponseEntity.ok(repayments);
    }

    // Helper: convert DTO to Entity
    private Loan convertToEntity(LoanApplicationRequest dto) {
        Loan loan = new Loan();
        loan.setAmount(dto.getAmount());
        loan.setLoanType(dto.getLoanType());
        loan.setTenureMonths(dto.getTenureMonths());
        loan.setPurpose(dto.getPurpose());
        loan.setAnnualIncome(dto.getAnnualIncome());
        loan.setStartDate(LocalDate.now());
        loan.setAnnualInterestRate(10.0);
        loan.setStatus(Loan.Status.PENDING);
        return loan;
    }

    // Helper: convert Entity to DTO
    private LoanResponse convertToDto(Loan loan) {
        LoanResponse response = new LoanResponse();
        response.setId(loan.getId());
        response.setAmount(loan.getAmount());
        response.setLoanType(loan.getLoanType());
        response.setTenureMonths(loan.getTenureMonths());
        response.setPurpose(loan.getPurpose());
        response.setAnnualIncome(loan.getAnnualIncome());
        response.setStatus(loan.getStatus().name());
        response.setAdminRemark(loan.getAdminRemark());
        response.setStartDate(loan.getStartDate());
        response.setEmi(loan.getEmi());
        return response;
    }
}
