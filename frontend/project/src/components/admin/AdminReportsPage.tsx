import React, { useMemo } from "react";
import { BarChart3, TrendingUp, DollarSign, CheckCircle } from "lucide-react";
import { AdminLoan } from "../../lib/admin";
import { formatCurrency } from "../../utils/calculations";

const Bar: React.FC<{ v: number; label: string }> = ({ v, label }) => (
  <div className='flex items-end gap-2'>
    <div
      className='w-10 rounded-t bg-blue-500/80'
      style={{ height: `${Math.max(6, v)}px` }}
      title={`${label}: ${v}`}
    />
    <span className='text-xs text-gray-600'>{label}</span>
  </div>
);

const AdminReportsPage: React.FC<{ loans?: AdminLoan[] }> = ({
  loans = [],
}) => {
  const totals = useMemo(() => {
    const byStatus: Record<string, number> = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };
    let disbursed = 0;
    loans.forEach((l) => {
      byStatus[l.status] = (byStatus[l.status] || 0) + 1;
      if (l.status === "approved") disbursed += l.amount || 0;
    });
    return { byStatus, disbursed };
  }, [loans]);

  return (
    <section className='space-y-6'>
      <header className='flex items-center gap-3'>
        <BarChart3 className='w-7 h-7 text-indigo-600' />
        <div>
          <h2 className='text-2xl font-bold text-gray-800'>Reports</h2>
          <p className='text-gray-600'>Quick operational overview</p>
        </div>
      </header>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white/80 rounded-2xl border p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-sm'>Total Disbursed</p>
              <p className='text-3xl font-bold text-gray-800 mt-2'>
                {formatCurrency(totals.disbursed)}
              </p>
            </div>
            <DollarSign className='w-10 h-10 text-indigo-600' />
          </div>
        </div>
        <div className='bg-white/80 rounded-2xl border p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-sm'>Approved</p>
              <p className='text-3xl font-bold text-green-600 mt-2'>
                {totals.byStatus.approved}
              </p>
            </div>
            <CheckCircle className='w-10 h-10 text-green-600' />
          </div>
        </div>
        <div className='bg-white/80 rounded-2xl border p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-sm'>Trend</p>
              <p className='text-3xl font-bold text-gray-800 mt-2'>↑</p>
            </div>
            <TrendingUp className='w-10 h-10 text-blue-600' />
          </div>
        </div>
      </div>

      {/* Micro bar “chart” */}
      <div className='bg-white/80 rounded-2xl border p-6'>
        <p className='font-medium text-gray-700 mb-4'>Loans by status</p>
        <div className='flex gap-6 items-end'>
          <Bar v={totals.byStatus.pending * 12} label='Pending' />
          <Bar v={totals.byStatus.approved * 12} label='Approved' />
          <Bar v={totals.byStatus.rejected * 12} label='Rejected' />
        </div>
      </div>
    </section>
  );
};

export default AdminReportsPage;
