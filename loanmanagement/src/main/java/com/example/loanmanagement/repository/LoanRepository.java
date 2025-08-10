package com.example.loanmanagement.repository;

import com.example.loanmanagement.model.Loan;
import com.example.loanmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    List<Loan> findByUser(User user);

    List<Loan> findByStatus(Loan.Status status);
}
