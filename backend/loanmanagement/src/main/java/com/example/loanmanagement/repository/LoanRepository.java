package com.example.loanmanagement.repository;

import com.example.loanmanagement.model.Loan;
import com.example.loanmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByUser(User user);
    List<Loan> findByStatus(Loan.Status status);
    List<Loan> findByUserAndStatusNot(User user, Loan.Status status);

    long countByStatus(Loan.Status status);

    @Query("select coalesce(sum(l.amount), 0) from Loan l where l.status = com.example.loanmanagement.model.Loan$Status.APPROVED")
    Double sumApprovedAmounts();
}
