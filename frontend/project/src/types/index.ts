export interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin";
  phone?: string;
}
export interface ApiError {
  message?: string;
}
export interface LoanApplication {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  purpose: string;
  tenure: number; // in months
  interestRate: number;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
  approvedDate?: string;
  monthlyEMI?: number;
  totalAmount?: number;
  repaymentSchedule?: RepaymentSchedule[];
}

export interface RepaymentSchedule {
  id: string;
  loanId: string;
  installmentNumber: number;
  dueDate: string;
  amount: number;
  principalAmount: number;
  interestAmount: number;
  status: "pending" | "paid" | "overdue";
  paidDate?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    userData: Omit<User, "id"> & { password: string }
  ) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}
