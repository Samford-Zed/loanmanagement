import React, { useEffect, useState } from "react";
import { X, CheckCircle, Clock } from "lucide-react";
import {
  fetchRepayments,
  markRepaymentPaid,
  type Repayment,
} from "../../lib/repayments";
import { formatCurrency, formatDate } from "../../utils/calculations";

interface Props {
  applicationId: string; // loanId
  onClose: () => void;
}

const UpdateEMIModal: React.FC<Props> = ({ applicationId, onClose }) => {
  const loanId = Number(applicationId);
  const [rows, setRows] = useState<Repayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await fetchRepayments(loanId);
        setRows(data);
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Failed to load repayments.");
      } finally {
        setLoading(false);
      }
    })();
  }, [loanId]);

  async function handleMarkPaid(id: number) {
    try {
      setBusyId(id);
      const updated = await markRepaymentPaid(id);
      // Optimistically update the row to PAID
      setRows((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to mark as paid.");
    } finally {
      setBusyId(null);
    }
  }

  const statusPill = (s: string) => {
    const v = (s || "").toUpperCase();
    if (v === "PAID") {
      return (
        <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
          <CheckCircle className='w-4 h-4' />
          Paid
        </span>
      );
    }
    return (
      <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
        <Clock className='w-4 h-4' />
        Pending
      </span>
    );
  };

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden'>
        {/* Header */}
        <div className='p-6 border-b border-gray-200 flex items-center justify-between'>
          <h2 className='text-xl font-bold text-gray-800'>
            Update EMI / Repayment Status
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600'
            aria-label='Close'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Body */}
        <div className='p-6 overflow-y-auto max-h-[65vh]'>
          {err && (
            <div className='rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 mb-4'>
              {err}
            </div>
          )}

          {loading ? (
            <div className='text-center text-gray-600 py-12'>Loading…</div>
          ) : rows.length === 0 ? (
            <div className='text-center text-gray-600 py-12'>
              No repayment schedule found.
            </div>
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
                  <th className='text-center py-3 px-2'>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => {
                  const emiAmt = (r.principal || 0) + (r.interest || 0);
                  const isPaid = r.status === "PAID";
                  return (
                    <tr key={r.id} className='border-b hover:bg-gray-50'>
                      <td className='py-3 px-2'>{idx + 1}</td>
                      <td className='py-3 px-2'>{formatDate(r.dueDate)}</td>
                      <td className='py-3 px-2 text-right font-semibold'>
                        {formatCurrency(emiAmt, "USD")}
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
                      <td className='py-3 px-2 text-center'>
                        {!isPaid ? (
                          <button
                            onClick={() => handleMarkPaid(r.id)}
                            disabled={busyId === r.id}
                            className='px-3 py-1 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-50'
                          >
                            {busyId === r.id ? "Saving…" : "Mark paid"}
                          </button>
                        ) : (
                          <span className='text-sm text-gray-500'>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className='p-4 border-t bg-gray-50 flex justify-end'>
          <button
            onClick={onClose}
            className='px-5 py-2 rounded-xl bg-gray-600 text-white hover:bg-gray-700'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateEMIModal;
