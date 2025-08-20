package com.example.loanmanagement.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class EmiCalculator {

    /**
     * Calculates EMI using:
     * EMI = [P * R * (1+R)^N] / [(1+R)^N - 1]
     *
     * @param principal           Loan amount (P)
     * @param annualInterestRate  Annual interest rate in % (e.g., 12 for 12%)
     * @param tenureMonths        Loan tenure in months (N)
     * @return EMI amount as BigDecimal
     */
    public static BigDecimal calculateEMI(BigDecimal principal, double annualInterestRate, int tenureMonths) {
        // Convert annual interest rate to monthly decimal
        double monthlyRate = (annualInterestRate / 100) / 12;

        if (monthlyRate == 0) {
            // No interest case
            return principal.divide(BigDecimal.valueOf(tenureMonths), 2, RoundingMode.HALF_UP);
        }

        // Apply EMI formula: P * R * (1+R)^N / ((1+R)^N - 1)
        double pow = Math.pow(1 + monthlyRate, tenureMonths);
        double emi = (principal.doubleValue() * monthlyRate * pow) / (pow - 1);

        return BigDecimal.valueOf(emi).setScale(2, RoundingMode.HALF_UP);
    }
}
