// src/lib/loans.ts
import { api } from "./api";

export interface LoanResponse {
  id: number;
  amount: number;
  loanType?: string;
  tenureMonths?: number;
  purpose?: string;
  annualIncome?: number;
  status?: string;
  adminRemark?: string | null;
  startDate?: string;
  emi?: number;
}

export interface LoanApplicationRequest {
  amount: number;
  loanType: string; // e.g. "PERSONAL"
  tenureMonths: number; // months
  purpose: string;
  annualIncome: number;
}

// --- map helpers (optional, safe) ---
const mapLoan = (raw: any): LoanResponse => ({
  id: Number(raw.id),
  amount: Number(raw.amount),
  loanType: raw.loanType,
  tenureMonths: raw.tenureMonths,
  purpose: raw.purpose,
  annualIncome: raw.annualIncome,
  status: raw.status,
  adminRemark: raw.adminRemark ?? null,
  startDate: raw.startDate,
  emi: raw.emi,
});

// GET /api/loans/my  (loans for the current authenticated user)
export async function fetchMyLoans(): Promise<LoanResponse[]> {
  const { data } = await api.get("/api/loans/my");
  return (Array.isArray(data) ? data : []).map(mapLoan);
}

// POST /api/loans/apply
export async function applyForLoan(
  payload: LoanApplicationRequest
): Promise<LoanResponse> {
  const { data } = await api.post("/api/loans/apply", payload);
  return mapLoan(data);
}
