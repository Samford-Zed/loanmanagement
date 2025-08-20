package com.example.loanmanagement.service;

import com.example.loanmanagement.dto.LoanResponse;
import com.example.loanmanagement.exception.LoanStatusConflictException;
import com.example.loanmanagement.model.Loan;
import com.example.loanmanagement.model.Repayment;
import com.example.loanmanagement.repository.LoanRepository;
import com.example.loanmanagement.repository.RepaymentRepository;
import com.example.loanmanagement.util.DateUtil;
import com.example.loanmanagement.util.EmiCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminLoanService {

    private final LoanRepository loanRepository;
    private final RepaymentRepository repaymentRepository;

    /** Get only PENDING loans as DTOs */
    @Transactional(readOnly = true)
    public List<LoanResponse> getPendingLoans() {
        return loanRepository.findByStatus(Loan.Status.PENDING)
                .stream()
                .map(this::toDto)
                .toList();
    }

    /** Get all loans as DTOs */
    @Transactional(readOnly = true)
    public List<LoanResponse> getAllLoans() {
        return loanRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    /** Approve a loan, generate repayments (if not already generated), return DTO */
    @Transactional
    public LoanResponse approveLoan(Long loanId, String remark) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() == Loan.Status.APPROVED) {
            throw new LoanStatusConflictException("ALREADY APPROVED THIS LOAN ADMIN");
        }
        if (loan.getStatus() == Loan.Status.REJECTED) {
            throw new LoanStatusConflictException("LOAN IS ALREADY REJECTED AND CANNOT BE APPROVED");
        }

        // Update loan
        loan.setStatus(Loan.Status.APPROVED);
        loan.setAdminRemark(remark);
        loan.setStartDate(LocalDate.now());

        // Calculate EMI
        BigDecimal emi = EmiCalculator.calculateEMI(
                BigDecimal.valueOf(loan.getAmount()),
                loan.getAnnualInterestRate(),
                loan.getTenureMonths()
        );
        loan.setEmi(emi.doubleValue());

        loanRepository.save(loan);

        // Create repayments only if they don't exist yet
        List<Repayment> existingRepayments = repaymentRepository.findByLoanId(loanId);

        if (existingRepayments.isEmpty()) {
            List<LocalDate> dueDates = DateUtil.generateDueDates(
                    loan.getStartDate(),
                    loan.getTenureMonths()
            );

            List<Repayment> repayments = new ArrayList<>();
            double monthlyRate = (loan.getAnnualInterestRate() / 100.0) / 12.0;

            for (LocalDate dueDate : dueDates) {
                double interest = loan.getAmount() * monthlyRate;
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
            loan.setRepayments(repayments);
        } else {
            loan.setRepayments(existingRepayments); // reuse existing schedule
        }

        return toDto(loan);
    }

    /** Reject a loan with remark, return DTO */
    @Transactional
    public LoanResponse rejectLoan(Long loanId, String remark) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() == Loan.Status.REJECTED) {
            throw new LoanStatusConflictException("ALREADY REJECTED THIS LOAN ADMIN");
        }
        if (loan.getStatus() == Loan.Status.APPROVED) {
            throw new LoanStatusConflictException("LOAN IS ALREADY APPROVED AND CANNOT BE REJECTED");
        }

        loan.setStatus(Loan.Status.REJECTED);
        loan.setAdminRemark(remark);

        loanRepository.save(loan);
        return toDto(loan);
    }

    /** Mark a repayment as paid (kept as entity return; change to DTO if you expose it) */
    @Transactional
    public Repayment markRepaymentPaid(Long repaymentId) {
        Repayment repayment = repaymentRepository.findById(repaymentId)
                .orElseThrow(() -> new RuntimeException("Repayment not found"));
        repayment.setStatus(Repayment.Status.PAID);
        return repaymentRepository.save(repayment);
    }

    /** Map Loan -> LoanResponse (includes customer name/email if available) */
    private LoanResponse toDto(Loan l) {
        LoanResponse r = new LoanResponse();
        r.setId(l.getId());
        r.setAmount(l.getAmount());
        r.setLoanType(l.getLoanType());
        r.setTenureMonths(l.getTenureMonths());
        r.setPurpose(l.getPurpose());
        r.setAnnualIncome(l.getAnnualIncome());
        r.setStatus(l.getStatus().name());
        r.setAdminRemark(l.getAdminRemark());
        r.setStartDate(l.getStartDate());
        r.setEmi(l.getEmi());

        // These two lines require corresponding fields in LoanResponse.
        if (l.getUser() != null) {
            r.setCustomerName(l.getUser().getName());
            r.setCustomerEmail(l.getUser().getEmail());
        }

        return r;
    }
}
