// src/components/admin/ApplicationDetailsModal.tsx
import React from "react";
import { X, User, Mail, DollarSign, Calendar, FileText } from "lucide-react";
import { AdminLoan } from "../../lib/admin";
import { formatCurrency, formatDate } from "../../utils/calculations";

type Props = {
  loan?: AdminLoan | null; // safe if undefined momentarily
  onClose: () => void;
};

const ApplicationDetailsModal: React.FC<Props> = ({ loan, onClose }) => {
  if (!loan) return null;

  const statusPill =
    loan.status === "approved"
      ? "bg-green-100 text-green-800"
      : loan.status === "rejected"
      ? "bg-red-100 text-red-800"
      : "bg-yellow-100 text-yellow-800";

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'
      role='dialog'
      aria-modal='true'
      aria-labelledby='app-details-title'
    >
      <div className='w-full max-w-2xl bg-white rounded-2xl ring-1 ring-black/10 shadow-2xl overflow-hidden'>
        {/* Header */}
        <div className='relative px-6 py-5 border-b bg-gradient-to-r from-gray-50 to-white'>
          <div className='flex items-center gap-3'>
            <div className='flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600/10'>
              <FileText className='w-5 h-5 text-blue-600' />
            </div>
            <div>
              <h3
                id='app-details-title'
                className='text-xl font-semibold text-gray-900'
              >
                Application Details
              </h3>
              <div
                className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusPill}`}
                title='Current status'
              >
                {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className='absolute top-5 right-6 inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition'
            aria-label='Close'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Body */}
        <div className='divide-y divide-gray-200/80'>
          {/* Row 1 */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-6'>
            <InfoItem
              icon={<User className='w-5 h-5 text-gray-500' />}
              label='Customer'
              value={loan.customerName || "—"}
            />
            <InfoItem
              icon={<Mail className='w-5 h-5 text-gray-500' />}
              label='Email'
              value={loan.customerEmail || "—"}
            />
          </div>

          {/* Row 2 */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-6'>
            <InfoItem
              icon={<DollarSign className='w-5 h-5 text-gray-500' />}
              label='Amount'
              value={formatCurrency(loan.amount, "USD")}
            />
            <InfoItem
              icon={<Calendar className='w-5 h-5 text-gray-500' />}
              label='Applied'
              value={loan.appliedDate ? formatDate(loan.appliedDate) : "—"}
            />
          </div>

          {/* Row 3 */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 p-6'>
            <InfoItem label='Purpose' value={loan.purpose || "—"} />
            <InfoItem
              label='Tenure'
              value={loan.tenureMonths ? `${loan.tenureMonths} months` : "—"}
            />
            <InfoItem label='Loan Type' value={loan.loanType || "—"} />
          </div>

          {/* Remark (optional) */}
          {loan.adminRemark && (
            <div className='p-6'>
              <p className='text-sm text-gray-600'>Admin Remark</p>
              <p className='mt-1 text-gray-900 bg-gray-50 border rounded-xl px-3 py-2'>
                {loan.adminRemark}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='flex justify-end gap-3 p-5 bg-gray-50 border-t'>
          <button
            onClick={onClose}
            className='px-5 py-2 rounded-xl font-medium bg-gray-700 text-white hover:bg-gray-800 transition'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ icon, label, value }) => (
  <div className='flex items-start gap-3'>
    {icon && (
      <div className='mt-0.5 flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100'>
        {icon}
      </div>
    )}
    <div>
      <p className='text-sm text-gray-600'>{label}</p>
      <p className='mt-0.5 font-medium text-gray-900'>{value}</p>
    </div>
  </div>
);

export default ApplicationDetailsModal;
