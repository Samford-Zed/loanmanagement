import React, { useEffect, useMemo, useState } from "react";
import { FileText, Clock, CheckCircle, DollarSign } from "lucide-react";
import { fetchAllLoans, type AdminLoan } from "../../lib/admin";
import { formatCurrency } from "../../utils/calculations";

const AdminHome: React.FC = () => {
  const [loans, setLoans] = useState<AdminLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        setLoading(true);
        const data = await fetchAllLoans();
        setLoans(data);
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Failed to load stats.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalApplications = loans.length;
  const pendingApplications = useMemo(
    () => loans.filter((l) => l.status === "pending").length,
    [loans]
  );
  const approvedApplications = useMemo(
    () => loans.filter((l) => l.status === "approved").length,
    [loans]
  );
  const totalDisbursed = useMemo(
    () =>
      loans
        .filter((l) => l.status === "approved")
        .reduce((s, l) => s + (l.amount || 0), 0),
    [loans]
  );

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-bold text-gray-800'>
          Loan Officer Dashboard
        </h1>
        <p className='text-gray-600 mt-1'>
          Manage loan applications and track repayments
        </p>
      </div>

      {err && (
        <div className='rounded-xl border border-red-200 bg-red-50 p-4 text-red-700'>
          {err}
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-white/80 rounded-2xl p-6 border shadow'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-sm'>Total Applications</p>
              <p className='text-3xl font-bold mt-2'>
                {loading ? "…" : totalApplications}
              </p>
            </div>
            <div className='bg-blue-100 p-3 rounded-xl'>
              <FileText className='w-8 h-8 text-blue-600' />
            </div>
          </div>
        </div>

        <div className='bg-white/80 rounded-2xl p-6 border shadow'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-sm'>Pending Review</p>
              <p className='text-3xl font-bold text-yellow-600 mt-2'>
                {loading ? "…" : pendingApplications}
              </p>
            </div>
            <div className='bg-yellow-100 p-3 rounded-xl'>
              <Clock className='w-8 h-8 text-yellow-600' />
            </div>
          </div>
        </div>

        <div className='bg-white/80 rounded-2xl p-6 border shadow'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-sm'>Approved Loans</p>
              <p className='text-3xl font-bold text-green-600 mt-2'>
                {loading ? "…" : approvedApplications}
              </p>
            </div>
            <div className='bg-green-100 p-3 rounded-xl'>
              <CheckCircle className='w-8 h-8 text-green-600' />
            </div>
          </div>
        </div>

        <div className='bg-white/80 rounded-2xl p-6 border shadow'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-sm'>Total Disbursed</p>
              <p className='text-3xl font-bold mt-2'>
                {loading ? "…" : formatCurrency(totalDisbursed, "USD")}
              </p>
            </div>
            <div className='bg-indigo-100 p-3 rounded-xl'>
              <DollarSign className='w-8 h-8 text-indigo-600' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminHome;
