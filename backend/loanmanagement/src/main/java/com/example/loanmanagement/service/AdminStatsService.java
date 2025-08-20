package com.example.loanmanagement.service;

import com.example.loanmanagement.dto.AdminStatsResponse;
import com.example.loanmanagement.model.Loan;
import com.example.loanmanagement.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminStatsService {
    private final LoanRepository loanRepository;

    public AdminStatsResponse getStats() {
        long total = loanRepository.count();
        long pending = loanRepository.countByStatus(Loan.Status.PENDING);
        long approved = loanRepository.countByStatus(Loan.Status.APPROVED);
        double disbursed = loanRepository.sumApprovedAmounts();
        return new AdminStatsResponse(total, pending, approved, disbursed);
    }
}
