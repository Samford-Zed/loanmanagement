package com.example.loanmanagement.service;

import com.example.loanmanagement.dto.LoanResponse;
import com.example.loanmanagement.model.Loan;
import com.example.loanmanagement.model.Repayment;
import com.example.loanmanagement.model.User;
import com.example.loanmanagement.repository.LoanRepository;
import com.example.loanmanagement.repository.RepaymentRepository;
import com.example.loanmanagement.repository.UserRepository;
import com.example.loanmanagement.util.DateUtil;
import com.example.loanmanagement.util.EmiCalculator;
import jakarta.transaction.Transactional;
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
    private final UserRepository userRepository;

    /* =========================
       NEW: fetch current user's loans
       ========================= */
    @Transactional
    public List<LoanResponse> getLoansByUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Loan> loans = loanRepository.findByUser(user);
        return loans.stream().map(this::toDto).toList();
    }

    /* Optional: ensure a user can only see their own loan by id */
    @Transactional
    public LoanResponse getLoanByIdForUser(Long id, String email) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
        if (loan.getUser() == null || !loan.getUser().getEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException("Unauthorized to view this loan");
        }
        return toDto(loan);
    }

    /* =========================
       Existing create/approve methods
       ========================= */
    public Loan createLoanForAuthenticatedUser(Loan loanRequest, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        loanRequest.setUser(user);
        Loan loan = loanRepository.save(loanRequest);

        if (loan.getAnnualInterestRate() == null || loan.getTenureMonths() == null) {
            throw new IllegalArgumentException("Annual Interest Rate and Tenure must be provided");
        }

        BigDecimal emi = EmiCalculator.calculateEMI(
                BigDecimal.valueOf(loan.getAmount()),
                loan.getAnnualInterestRate(),
                loan.getTenureMonths()
        );
        loan.setEmi(emi.doubleValue());
        loanRepository.save(loan);

        return loan;
    }

    @Transactional
    public Loan approveLoan(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        loan.setStartDate(LocalDate.now());
        loan.setStatus(Loan.Status.APPROVED);

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

        return loanRepository.findById(loan.getId())
                .orElseThrow(() -> new RuntimeException("Loan reload failed after approval"));
    }

    /* Your original by-id fetch (kept as-is) */
    public Loan getLoanById(Long id) {
        return loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
    }

    public List<Repayment> getRepayments(Long loanId) {
        return repaymentRepository.findByLoanId(loanId);
    }

    @Transactional
    public Loan createLoanWithRepayments(Loan loanEntity, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // prevent duplicates except REJECTED
        List<Loan> existingLoans = loanRepository.findByUserAndStatusNot(user, Loan.Status.REJECTED);
        if (!existingLoans.isEmpty()) {
            throw new IllegalStateException("User has already applied for a loan.");
        }

        loanEntity.setUser(user);
        loanEntity.setStatus(Loan.Status.PENDING);
        loanEntity.setStartDate(LocalDate.now());

        Loan savedLoan = loanRepository.save(loanEntity);

        if (savedLoan.getAnnualInterestRate() == null || savedLoan.getTenureMonths() == null) {
            throw new IllegalArgumentException("Annual Interest Rate and Tenure must be provided");
        }
        BigDecimal emi = EmiCalculator.calculateEMI(
                BigDecimal.valueOf(savedLoan.getAmount()),
                savedLoan.getAnnualInterestRate(),
                savedLoan.getTenureMonths()
        );
        savedLoan.setEmi(emi.doubleValue());
        loanRepository.save(savedLoan);

        List<LocalDate> dueDates = DateUtil.generateDueDates(
                savedLoan.getStartDate(),
                savedLoan.getTenureMonths()
        );

        List<Repayment> repayments = new ArrayList<>();
        double monthlyRate = (savedLoan.getAnnualInterestRate() / 100) / 12;

        for (LocalDate dueDate : dueDates) {
            double interest = savedLoan.getAmount() * monthlyRate;
            double principal = emi.doubleValue() - interest;

            Repayment repayment = new Repayment();
            repayment.setLoan(savedLoan);
            repayment.setDueDate(dueDate);
            repayment.setPrincipal(principal);
            repayment.setInterest(interest);
            repayment.setStatus(Repayment.Status.PENDING);

            repayments.add(repayment);
        }

        repaymentRepository.saveAll(repayments);

        return savedLoan;
    }

    /* =========================
       Mapping helper
       ========================= */
    private LoanResponse toDto(Loan loan) {
        LoanResponse r = new LoanResponse();
        r.setId(loan.getId());
        r.setAmount(loan.getAmount());
        r.setLoanType(loan.getLoanType());
        r.setTenureMonths(loan.getTenureMonths());
        r.setPurpose(loan.getPurpose());
        r.setAnnualIncome(loan.getAnnualIncome());
        r.setStatus(loan.getStatus().name());
        r.setAdminRemark(loan.getAdminRemark());
        r.setStartDate(loan.getStartDate());
        r.setEmi(loan.getEmi());
        if (loan.getUser() != null) {
            // only if you added these fields to LoanResponse
            try {
                r.getClass().getDeclaredField("customerName");
                r.getClass().getDeclaredField("customerEmail");
                r.setCustomerName(loan.getUser().getName());
                r.setCustomerEmail(loan.getUser().getEmail());
            } catch (NoSuchFieldException ignored) {
                // fields not present; safe to ignore
            }
        }
        return r;
    }
}
