package com.example.loanmanagement.controller;

import com.example.loanmanagement.dto.AdminStatsResponse;
import com.example.loanmanagement.dto.LoanResponse;
import com.example.loanmanagement.model.Repayment;
import com.example.loanmanagement.service.AdminLoanService;
import com.example.loanmanagement.service.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
//@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class AdminLoanController {

    private final AdminLoanService adminLoanService;
    private final AdminStatsService adminStatsService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> stats() {
        return ResponseEntity.ok(adminStatsService.getStats());
    }

    // Fetch all loans (using LoanResponse DTO)
    @GetMapping("/loans")
    public ResponseEntity<List<LoanResponse>> getAllLoans() {
        return ResponseEntity.ok(adminLoanService.getAllLoans());
    }

    // Approve loan with optional remark
    @PutMapping("/loans/{loanId}/approve")
    public ResponseEntity<LoanResponse> approveLoan(
            @PathVariable Long loanId,
            @RequestParam(required = false) String remark
    ) {
        return ResponseEntity.ok(adminLoanService.approveLoan(loanId, remark));
    }

    // Reject loan with optional remark
    @PutMapping("/loans/{loanId}/reject")
    public ResponseEntity<LoanResponse> rejectLoan(
            @PathVariable Long loanId,
            @RequestParam(required = false) String remark
    ) {
        return ResponseEntity.ok(adminLoanService.rejectLoan(loanId, remark));
    }

    // Mark repayment as paid
    @PutMapping("/repayments/{repaymentId}/pay")
    public ResponseEntity<Repayment> markRepaymentPaid(@PathVariable Long repaymentId) {
        return ResponseEntity.ok(adminLoanService.markRepaymentPaid(repaymentId));
    }
}