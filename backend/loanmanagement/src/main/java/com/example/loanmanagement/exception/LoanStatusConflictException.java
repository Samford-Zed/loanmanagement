package com.example.loanmanagement.exception;

public class LoanStatusConflictException extends RuntimeException {
    public LoanStatusConflictException(String message) {
        super(message);
    }
}