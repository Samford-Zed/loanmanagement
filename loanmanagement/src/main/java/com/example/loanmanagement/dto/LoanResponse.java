package com.example.loanmanagement.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class LoanResponse {
    private Long id;
    private Double amount;
    private String loanType;
    private Integer tenureMonths;
    private String purpose;
    private Double annualIncome;
    private String status;
    private String adminRemark;
    private LocalDate startDate;
    private Double emi;
}
