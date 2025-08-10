package com.example.loanmanagement.service;

import com.example.loanmanagement.model.Loan;
import com.example.loanmanagement.model.Repayment;
import com.example.loanmanagement.repository.LoanRepository;
import com.example.loanmanagement.repository.RepaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminLoanService {

    private final LoanRepository loanRepository;
    private final RepaymentRepository repaymentRepository;

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    public Loan approveLoan(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
        loan.setStatus(Loan.Status.valueOf("APPROVED"));
        return loanRepository.save(loan);
    }

    public Loan rejectLoan(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
        loan.setStatus(Loan.Status.valueOf("REJECTED"));
        return loanRepository.save(loan);
    }

    public Repayment markRepaymentPaid(Long repaymentId) {
        Repayment repayment = repaymentRepository.findById(repaymentId)
                .orElseThrow(() -> new RuntimeException("Repayment not found"));
        repayment.setStatus(Repayment.Status.PAID);
        return repaymentRepository.save(repayment);
    }
}
