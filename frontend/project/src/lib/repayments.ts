import { api } from "./api";

export type RepaymentStatus = "PENDING" | "PAID";

export interface Repayment {
  id: number;
  dueDate: string; // ISO string
  principal: number;
  interest: number;
  status: RepaymentStatus;
}

/** Customer/Admin: list schedule for a loan */
export async function fetchRepayments(
  loanId: number | string
): Promise<Repayment[]> {
  const { data } = await api.get(`/api/loans/${loanId}/repayments`);
  // normalize numeric fields
  return (Array.isArray(data) ? data : []).map((r: any) => ({
    id: Number(r.id),
    dueDate: r.dueDate,
    principal: Number(r.principal ?? 0),
    interest: Number(r.interest ?? 0),
    status: (r.status || "PENDING").toUpperCase() as RepaymentStatus,
  }));
}

/** Admin: mark a single installment “PAID” */
export async function markRepaymentPaid(
  repaymentId: number | string
): Promise<Repayment> {
  const { data } = await api.put(`/api/admin/repayments/${repaymentId}/pay`);
  return {
    id: Number(data.id),
    dueDate: data.dueDate,
    principal: Number(data.principal ?? 0),
    interest: Number(data.interest ?? 0),
    status: (data.status || "PENDING").toUpperCase() as RepaymentStatus,
  };
}
