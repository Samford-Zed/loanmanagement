import { User, LoanApplication, RepaymentSchedule } from "../types";
import { generateRepaymentSchedule } from "../utils/calculations";

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@loan.com",
    name: "Admin User",
    role: "admin",
  },
  {
    id: "2",
    email: "john@example.com",
    name: "John Doe",
    role: "customer",
    phone: "+91 9876543210",
  },
  {
    id: "3",
    email: "jane@example.com",
    name: "Jane Smith",
    role: "customer",
    phone: "+91 9876543211",
  },
  {
    id: "4",
    email: "sam@example.com",
    name: "Sam Smith",
    role: "customer",
    phone: "+251942932307",
  },
];

export const mockLoanApplications: LoanApplication[] = [
  {
    id: "1",
    customerId: "2",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    amount: 500000,
    purpose: "Home Purchase",
    tenure: 240,
    interestRate: 8.5,
    status: "approved",
    appliedDate: "2024-01-15",
    approvedDate: "2024-01-20",
    monthlyEMI: 4307.85,
    totalAmount: 1033884,
  },
  {
    id: "2",
    customerId: "2",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    amount: 100000,
    purpose: "Car Purchase",
    tenure: 60,
    interestRate: 9.0,
    status: "pending",
    appliedDate: "2024-02-01",
  },
  {
    id: "3",
    customerId: "3",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    amount: 200000,
    purpose: "Business Expansion",
    tenure: 84,
    interestRate: 10.0,
    status: "rejected",
    appliedDate: "2024-01-10",
  },
];

// Generate repayment schedules for approved loans
const approvedLoans = mockLoanApplications.filter(
  (loan) => loan.status === "approved"
);
export const mockRepaymentSchedules: RepaymentSchedule[] =
  approvedLoans.flatMap((loan) =>
    generateRepaymentSchedule(
      loan.id,
      loan.amount,
      loan.interestRate,
      loan.tenure,
      loan.approvedDate!
    )
  );
