package com.example.loanmanagement.service;

import com.example.loanmanagement.model.Loan;
import com.example.loanmanagement.model.Repayment;
import com.example.loanmanagement.repository.LoanRepository;
import com.example.loanmanagement.repository.RepaymentRepository;
import com.example.loanmanagement.util.DateUtil;
import com.example.loanmanagement.util.EmiCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRepository loanRepository;
    private final RepaymentRepository repaymentRepository;

    public Loan createLoanWithRepayments(Loan loanRequest) {
        Loan loan = loanRepository.save(loanRequest);

        if (loan.getAnnualInterestRate() == null || loan.getTenureMonths() == null) {
            throw new IllegalArgumentException("Annual Interest Rate and Duration must be provided");
        }

        BigDecimal emi = EmiCalculator.calculateEMI(
                BigDecimal.valueOf(loan.getAmount()),
                loan.getAnnualInterestRate(),
                loan.getTenureMonths()
        );

        loan.setEmi(emi.doubleValue());
        loanRepository.save(loan);

        List<LocalDate> dueDates = DateUtil.generateDueDates(
                loan.getStartDate(),
                loan.getTenureMonths()
        );

        List<Repayment> repayments = new ArrayList<>();
        double monthlyRate = (loan.getAnnualInterestRate() / 100) / 12;

        for (LocalDate dueDate : dueDates) {
            double interest = loan.getAmount() * monthlyRate; // simple interest per month
            double principal = emi.doubleValue() - interest;

            Repayment repayment = new Repayment();
            repayment.setLoan(loan);
            repayment.setDueDate(dueDate);
            repayment.setPrincipal(principal);
            repayment.setInterest(interest);
            repayment.setStatus(Repayment.Status.PENDING);

            repayments.add(repayment);
        }

        repaymentRepository.saveAll(repayments);

        return loan;
    }

    public Loan getLoanById(Long id) {
        return loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
    }

    public List<Repayment> getRepayments(Long loanId) {
        return repaymentRepository.findByLoanId(loanId);
    }
}
