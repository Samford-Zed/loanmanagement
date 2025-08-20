// EMI calculation (monthly)
export const calculateEMI = (
  principal: number,
  rate: number,
  tenure: number
): number => {
  const monthlyRate = rate / 100 / 12;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi * 100) / 100;
};

export const generateRepaymentSchedule = (
  loanId: string,
  principal: number,
  rate: number,
  tenure: number,
  startDate: string
) => {
  const monthlyRate = rate / 100 / 12;
  const emi = calculateEMI(principal, rate, tenure);
  const schedule: Array<{
    id: string;
    loanId: string;
    installmentNumber: number;
    dueDate: string;
    amount: number;
    principalAmount: number;
    interestAmount: number;
    status: "pending" | "paid";
  }> = [];

  let remainingPrincipal = principal;
  const start = new Date(startDate);

  for (let i = 1; i <= tenure; i++) {
    const interestAmount =
      Math.round(remainingPrincipal * monthlyRate * 100) / 100;
    const principalAmount = Math.round((emi - interestAmount) * 100) / 100;
    remainingPrincipal = Math.max(0, remainingPrincipal - principalAmount);

    const dueDate = new Date(start);
    dueDate.setMonth(dueDate.getMonth() + i);

    schedule.push({
      id: `${loanId}-${i}`,
      loanId,
      installmentNumber: i,
      dueDate: dueDate.toISOString().split("T")[0],
      amount: emi,
      principalAmount,
      interestAmount,
      status: "pending",
    });
  }

  return schedule;
};

// Always show ETB as Birr ("Br")
export const formatCurrency = (amount: number | string = 0): string => {
  const n = Number(amount) || 0;
  return `Br ${n.toLocaleString("en-ET", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Ethiopian-style date (adjust as you like)
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-ET", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
