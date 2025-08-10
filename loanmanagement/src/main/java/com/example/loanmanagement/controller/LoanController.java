package com.example.loanmanagement.controller;

import com.example.loanmanagement.model.Loan;
import com.example.loanmanagement.model.Repayment;
import com.example.loanmanagement.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    // Create loan & generate repayments
    @PostMapping
    public ResponseEntity<Loan> createLoan(@RequestBody Loan loanRequest) {
        Loan createdLoan = loanService.createLoanWithRepayments(loanRequest);
        return ResponseEntity.ok(createdLoan);
    }

    // Get loan details
    @GetMapping("/{loanId}")
    public ResponseEntity<Loan> getLoan(@PathVariable Long loanId) {
        Loan loan = loanService.getLoanById(loanId);
        return ResponseEntity.ok(loan);
    }

    // Get repayment schedule
    @GetMapping("/{loanId}/repayments")
    public ResponseEntity<List<Repayment>> getRepayments(@PathVariable Long loanId) {
        List<Repayment> repayments = loanService.getRepayments(loanId);
        return ResponseEntity.ok(repayments);
    }
}
