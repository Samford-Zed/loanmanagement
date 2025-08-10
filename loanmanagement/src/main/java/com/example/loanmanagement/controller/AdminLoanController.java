package com.example.loanmanagement.controller;

import com.example.loanmanagement.model.Loan;
import com.example.loanmanagement.model.Repayment;
import com.example.loanmanagement.service.AdminLoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminLoanController {

    private final AdminLoanService adminLoanService;

    @GetMapping("/loans")
    public ResponseEntity<List<Loan>> getAllLoans() {
        return ResponseEntity.ok(adminLoanService.getAllLoans());
    }

    @PutMapping("/loans/{loanId}/approve")
    public ResponseEntity<Loan> approveLoan(@PathVariable Long loanId) {
        return ResponseEntity.ok(adminLoanService.approveLoan(loanId));
    }

    @PutMapping("/loans/{loanId}/reject")
    public ResponseEntity<Loan> rejectLoan(@PathVariable Long loanId) {
        return ResponseEntity.ok(adminLoanService.rejectLoan(loanId));
    }

    @PutMapping("/repayments/{repaymentId}/pay")
    public ResponseEntity<Repayment> markRepaymentPaid(@PathVariable Long repaymentId) {
        return ResponseEntity.ok(adminLoanService.markRepaymentPaid(repaymentId));
    }
}
