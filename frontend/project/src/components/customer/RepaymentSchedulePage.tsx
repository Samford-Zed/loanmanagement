import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Banknote,
} from "lucide-react";
import { fetchMyLoans, type LoanResponse } from "../../lib/loans";
import { fetchRepayments, type Repayment } from "../../lib/repayments";
import { formatCurrency, formatDate } from "../../utils/calculations";

const RepaymentSchedulePage: React.FC = () => {
  const [loans, setLoans] = useState<LoanResponse[]>([]);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [loanErr, setLoanErr] = useState("");

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [rows, setRows] = useState<Repayment[]>([]);
  const [loadingRows, setLoadingRows] = useState(false);
  const [rowsErr, setRowsErr] = useState("");

  // load my loans once
  useEffect(() => {
    (async () => {
      try {
        setLoadingLoans(true);
        setLoanErr("");
        const data = await fetchMyLoans();
        setLoans(data);
        // preselect the first approved loan if any
        const firstApproved = data.find(
          (l) => (l.status || "").toLowerCase() === "approved"
        );
        if (firstApproved) setSelectedId(firstApproved.id);
      } catch (e: any) {
        setLoanErr(e?.response?.data?.message || "Failed to load your loans.");
      } finally {
        setLoadingLoans(false);
      }
    })();
  }, []);

  // load schedule when loan changes
  useEffect(() => {
    if (selectedId == null) {
      setRows([]);
      return;
    }
    (async () => {
      try {
        setRowsErr("");
        setLoadingRows(true);
        const data = await fetchRepayments(selectedId);
        setRows(data);
      } catch (e: any) {
        setRowsErr(
          e?.response?.data?.message || "Failed to load repayment schedule."
        );
      } finally {
        setLoadingRows(false);
      }
    })();
  }, [selectedId]);

  const approvedLoans = useMemo(
    () => loans.filter((l) => (l.status || "").toLowerCase() === "approved"),
    [loans]
  );

  const currentLoan = approvedLoans.find((l) => l.id === selectedId) || null;

  const paid = rows.filter((r) => r.status === "PAID");
  const paidCount = paid.length;
  const totalPaid = paid.reduce(
    (sum, r) => sum + (r.principal + r.interest),
    0
  );
  const totalAmount =
    (currentLoan?.emi ?? 0) * (currentLoan?.tenureMonths ?? 0);
  const remaining = totalAmount - totalPaid;

  const statusPill = (s: string | undefined) => {
    const v = (s || "").toUpperCase();
    if (v === "PAID") {
      return (
        <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
          <CheckCircle className='w-4 h-4' /> Paid
        </span>
      );
    }
    return (
      <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
        <Clock className='w-4 h-4' /> Pending
      </span>
    );
  };

  return (
    <div className='space-y-6'>
      <header className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>
            Repayment Schedule
          </h1>
          <p className='text-gray-600'>
            View installment plan for your approved loans
          </p>
        </div>

        <div className='w-full sm:w-80'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Select Approved Loan
          </label>
          <select
            className='w-full border border-gray-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            disabled={loadingLoans || approvedLoans.length === 0}
            value={selectedId ?? ""}
            onChange={(e) => setSelectedId(Number(e.target.value) || null)}
          >
            {loadingLoans ? (
              <option>Loading…</option>
            ) : approvedLoans.length === 0 ? (
              <option>No approved loans</option>
            ) : (
              <>
                <option value=''>Choose a loan…</option>
                {approvedLoans.map((l) => (
                  <option key={l.id} value={l.id}>
                    {formatCurrency(l.amount || 0, "USD")} •{" "}
                    {l.purpose || l.loanType || "Loan"}
                  </option>
                ))}
              </>
            )}
          </select>
          {loanErr && <p className='text-sm text-red-600 mt-2'>{loanErr}</p>}
        </div>
      </header>

      {/* Summary cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-white/80 rounded-xl border p-5'>
          <div className='flex items-center gap-2 text-gray-700 font-medium'>
            <CheckCircle className='w-5 h-5 text-green-600' /> Paid Installments
          </div>
          <p className='text-2xl font-bold text-green-600 mt-2'>
            {paidCount}/{currentLoan?.tenureMonths ?? "—"}
          </p>
        </div>
        <div className='bg-white/80 rounded-xl border p-5'>
          <div className='flex items-center gap-2 text-gray-700 font-medium'>
            <Banknote className='w-5 h-5 text-blue-600' /> Total Paid
          </div>
          <p className='text-2xl font-bold text-blue-600 mt-2'>
            {formatCurrency(totalPaid, "USD")}
          </p>
        </div>
        <div className='bg-white/80 rounded-xl border p-5'>
          <div className='flex items-center gap-2 text-gray-700 font-medium'>
            <Calendar className='w-5 h-5 text-orange-600' /> Remaining
          </div>
          <p className='text-2xl font-bold text-orange-600 mt-2'>
            {formatCurrency(remaining > 0 ? remaining : 0, "USD")}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className='bg-white/80 rounded-2xl shadow border'>
        <div className='p-5 border-b'>
          <h2 className='text-lg font-semibold text-gray-800'>Installments</h2>
        </div>
        <div className='p-5 overflow-x-auto'>
          {selectedId == null ? (
            <p className='text-gray-600'>Choose a loan to view its schedule.</p>
          ) : loadingRows ? (
            <p>Loading…</p>
          ) : rowsErr ? (
            <p className='text-red-600'>{rowsErr}</p>
          ) : rows.length === 0 ? (
            <p className='text-gray-600'>No schedule found for this loan.</p>
          ) : (
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
                {rows.map((r, idx) => {
                  const emiAmount = (r.principal || 0) + (r.interest || 0);
                  return (
                    <tr key={r.id} className='border-b hover:bg-gray-50'>
                      <td className='py-3 px-2 font-medium'>{idx + 1}</td>
                      <td className='py-3 px-2'>{formatDate(r.dueDate)}</td>
                      <td className='py-3 px-2 text-right font-semibold'>
                        {formatCurrency(emiAmount, "USD")}
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
          )}
        </div>
      </div>

      {/* Overdue notice (optional, based on status if you add it) */}
      {rows.some((r) => r.status !== "PAID") && (
        <div className='rounded-xl bg-yellow-50 border border-yellow-200 p-4 flex gap-2 items-start'>
          <AlertCircle className='w-5 h-5 text-yellow-700 mt-0.5' />
          <div className='text-sm text-yellow-800'>
            Remember to pay your EMIs on time to avoid overdue status.
          </div>
        </div>
      )}
    </div>
  );
};

export default RepaymentSchedulePage;
