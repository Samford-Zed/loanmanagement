package com.example.loanmanagement.repository;

import com.example.loanmanagement.model.Loan;
import com.example.loanmanagement.model.Repayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepaymentRepository extends JpaRepository<Repayment, Long> {

    List<Repayment> findByLoanId(Long loanId);
}