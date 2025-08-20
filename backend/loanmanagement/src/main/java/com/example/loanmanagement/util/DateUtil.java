package com.example.loanmanagement.util;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class DateUtil {

    /**
     * Generates a list of EMI due dates starting from the given start date.
     *
     * @param startDate the date of first EMI
     * @param numberOfMonths the number of EMIs
     * @return list of due dates
     */
    public static List<LocalDate> generateDueDates(LocalDate startDate, int numberOfMonths) {
        List<LocalDate> dueDates = new ArrayList<>();

        for (int i = 0; i < numberOfMonths; i++) {
            dueDates.add(startDate.plusMonths(i));
        }

        return dueDates;
    }
}
