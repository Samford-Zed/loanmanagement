import { api } from "./api";

export type LoanStatus = "pending" | "approved" | "rejected";

export interface AdminLoan {
  id: number;
  amount: number;
  loanType?: string;
  tenureMonths?: number;
  purpose?: string;
  status: LoanStatus;
  appliedDate?: string; // startDate/createdAt
  approvedDate?: string | null;
  customerName?: string;
  customerEmail?: string;
  monthlyEMI?: number;
  totalAmount?: number;
  adminRemark?: string | null;
}

function mapLoan(raw: any): AdminLoan {
  const status = (raw.status || raw.loanStatus || "pending")
    .toString()
    .toLowerCase() as LoanStatus;

  const applied = raw.startDate || raw.createdAt || raw.appliedDate;

  return {
    id: Number(raw.id),
    amount: Number(raw.amount),
    loanType: raw.loanType ?? raw.type,
    tenureMonths: raw.tenureMonths ?? raw.tenure,
    purpose: raw.purpose,
    status,
    appliedDate: applied ? new Date(applied).toISOString() : undefined,
    approvedDate: raw.approvedDate ?? null,
    customerName: raw.user?.name ?? raw.customerName,
    customerEmail: raw.user?.email ?? raw.customerEmail,
    monthlyEMI: raw.emi ?? raw.monthlyEMI,
    totalAmount: raw.totalAmount,
    adminRemark: raw.adminRemark,
  };
}

export async function fetchAllLoans(): Promise<AdminLoan[]> {
  const { data } = await api.get("/api/admin/loans");
  return (Array.isArray(data) ? data : []).map(mapLoan);
}

export async function approveLoan(loanId: number, remark?: string) {
  const { data } = await api.put(`/api/admin/loans/${loanId}/approve`, null, {
    params: { remark },
  });
  return mapLoan(data);
}

export async function rejectLoan(loanId: number, remark?: string) {
  const { data } = await api.put(`/api/admin/loans/${loanId}/reject`, null, {
    params: { remark },
  });
  return mapLoan(data);
}

/* ---------- NEW: customers list ---------- */
export interface AdminCustomer {
  id: number;
  name: string;
  email: string;
}

export async function fetchCustomers(): Promise<AdminCustomer[]> {
  const { data } = await api.get("/api/admin/customers");
  return Array.isArray(data) ? data : [];
}
