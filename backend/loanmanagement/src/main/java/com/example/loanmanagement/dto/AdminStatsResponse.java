package com.example.loanmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class AdminStatsResponse {
    private long totalApplications;
    private long pendingApplications;
    private long approvedApplications;
    private double totalDisbursed;
}
