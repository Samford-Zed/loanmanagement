// src/main/java/com/example/loanmanagement/dto/LoanResponse.java
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

    // ✅ add these for the admin table
    private String customerName;
    private String customerEmail;
}
