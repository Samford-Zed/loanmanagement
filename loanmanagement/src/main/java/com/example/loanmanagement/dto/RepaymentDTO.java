package com.example.loanmanagement.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RepaymentDTO {
    private Long id;
    private LocalDate dueDate;
    private Double principal;
    private Double interest;
    private String status;
}
