package com.example.loanmanagement.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class LoanApplicationRequest {

    @NotNull
    @Positive
    private Double amount;

    @NotBlank
    private String loanType;

    @NotNull
    @Positive
    private Integer durationMonths;

    @NotBlank
    private String purpose;

    @NotNull
    @Positive
    private Double annualIncome;
}
