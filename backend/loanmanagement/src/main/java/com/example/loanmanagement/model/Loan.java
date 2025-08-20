package com.example.loanmanagement.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;
    private String loanType;
    private Integer tenureMonths;
    private String purpose;
    private Double annualIncome;
    private Double annualInterestRate;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String adminRemark;

    private LocalDate startDate;
    private Double emi;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;

    @OneToMany(mappedBy = "loan", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Repayment> repayments;

    public enum Status {
        PENDING, APPROVED, REJECTED
    }
}