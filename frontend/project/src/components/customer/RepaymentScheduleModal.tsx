import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Banknote,
} from "lucide-react";
import { fetchRepayments, type Repayment } from "../../lib/repayments";
import { formatCurrency, formatDate } from "../../utils/calculations";
import { fetchMyLoans, type LoanResponse } from "../../lib/loans";

interface RepaymentScheduleModalProps {
  loanId: string;
  onClose: () => void;
}

const RepaymentScheduleModal: React.FC<RepaymentScheduleModalProps> = ({
  loanId,
  onClose,
}) => {
  const id = Number(loanId);

  const [loan, setLoan] = useState<LoanResponse | null>(null);
  const [rows, setRows] = useState<Repayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const [myLoans, schedule] = await Promise.all([
          fetchMyLoans(),
          fetchRepayments(id),
        ]);
        setLoan(myLoans.find((l) => l.id === id) || null);
        setRows(schedule);
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Failed to load schedule.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const paid = rows.filter((r) => r.status === "PAID");
  const paidCount = paid.length;
  const totalPaid = paid.reduce(
    (sum, r) => sum + (r.principal + r.interest),
    0
  );
  const totalAmount = (loan?.emi ?? 0) * (loan?.tenureMonths ?? 0);
  const remaining = totalAmount - totalPaid;

  const statusPill = (s?: string) => {
    const v = (s || "").toUpperCase();
    if (v === "PAID")
      return (
        <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
          <CheckCircle className='w-4 h-4' /> Paid
        </span>
      );
    return (
      <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
        <Clock className='w-4 h-4' /> Pending
      </span>
    );
  };

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden'>
        <div className='p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold text-gray-800'>
                Repayment Schedule
              </h2>
              {loan && (
                <p className='text-gray-600 mt-1'>
                  {loan.purpose || loan.loanType || "Loan"} •{" "}
                  {formatCurrency(loan.amount || 0, "USD")}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 text-2xl font-light'
            >
              ×
            </button>
          </div>

          {/* Summary */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
            <div className='bg-white rounded-xl p-4 border border-blue-200'>
              <div className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                <CheckCircle className='w-5 h-5 text-green-600' /> Paid
                Installments
              </div>
              <p className='text-2xl font-bold text-green-600 mt-2'>
                {paidCount}/{loan?.tenureMonths ?? "—"}
              </p>
            </div>
            <div className='bg-white rounded-xl p-4 border border-blue-200'>
              <div className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                <Banknote className='w-5 h-5 text-blue-600' /> Total Paid
              </div>
              <p className='text-2xl font-bold text-blue-600 mt-2'>
                {formatCurrency(totalPaid, "USD")}
              </p>
            </div>
            <div className='bg-white rounded-xl p-4 border border-blue-200'>
              <div className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                <Calendar className='w-5 h-5 text-orange-600' /> Remaining
              </div>
              <p className='text-2xl font-bold text-orange-600 mt-2'>
                {formatCurrency(remaining > 0 ? remaining : 0, "USD")}
              </p>
            </div>
          </div>
        </div>

        <div className='p-6 overflow-y-auto max-h-[60vh]'>
          {loading ? (
            <p>Loading…</p>
          ) : err ? (
            <p className='text-red-600'>{err}</p>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b'>
                    <th className='text-left py-3 px-2'>#</th>
                    <th className='text-left py-3 px-2'>Due Date</th>
                    <th className='text-right py-3 px-2'>EMI Amount</th>
                    <th className='text-right py-3 px-2'>Principal</th>
                    <th className='text-right py-3 px-2'>Interest</th>
                    <th className='text-center py-3 px-2'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => {
                    const emi = (r.principal || 0) + (r.interest || 0);
                    return (
                      <tr key={r.id} className='border-b hover:bg-gray-50'>
                        <td className='py-3 px-2 font-medium'>{i + 1}</td>
                        <td className='py-3 px-2'>{formatDate(r.dueDate)}</td>
                        <td className='py-3 px-2 text-right font-semibold'>
                          {formatCurrency(emi, "USD")}
                        </td>
                        <td className='py-3 px-2 text-right'>
                          {formatCurrency(r.principal, "USD")}
                        </td>
                        <td className='py-3 px-2 text-right'>
                          {formatCurrency(r.interest, "USD")}
                        </td>
                        <td className='py-3 px-2 text-center'>
                          {statusPill(r.status)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className='p-6 border-t bg-gray-50'>
          <div className='flex justify-end'>
            <button
              onClick={onClose}
              className='px-6 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition font-medium'
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepaymentScheduleModal;
