// src/components/customer/CustomerDashboard.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { formatCurrency, formatDate } from "../../utils/calculations";
import LoanApplicationForm from "./LoanApplicationForm";
import RepaymentScheduleModal from "./RepaymentScheduleModal";
import RepaymentSchedulePage from "./RepaymentSchedulePage";
import { fetchMyLoans, type LoanResponse } from "../../lib/loans";

interface CustomerDashboardProps {
  currentView: string;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentView,
}) => {
  const { user } = useAuth();

  // data
  const [loans, setLoans] = useState<LoanResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ui state
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null);

  // fetch my loans on mount (and when we need refresh)
  const loadLoans = async () => {
    try {
      setLoading(true);
      setErr("");
      const data = await fetchMyLoans();
      setLoans(data);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to load your loans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const approvedLoans = useMemo(
    () => loans.filter((l) => (l.status || "").toLowerCase() === "approved"),
    [loans]
  );

  const totalActiveLoans = approvedLoans.length;
  const totalOutstanding = approvedLoans.reduce(
    (sum, l) => sum + (l.amount || 0),
    0
  );
  const nextEmi = approvedLoans.reduce((sum, l) => sum + (l.emi || 0), 0);

  const getStatusIcon = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s === "approved")
      return <CheckCircle className='w-5 h-5 text-green-600' />;
    if (s === "rejected") return <XCircle className='w-5 h-5 text-red-600' />;
    return <Clock className='w-5 h-5 text-yellow-600' />;
  };
  const getStatusColor = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s === "approved") return "bg-green-100 text-green-800 border-green-200";
    if (s === "rejected") return "bg-red-100 text-red-800 border-red-200";
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const openScheduleModal = (loanId: number) => {
    setSelectedLoanId(loanId);
    setShowScheduleModal(true);
  };

  // ---- Render sections ----
  const renderHeader = () => (
    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
      <div>
        <h1 className='text-3xl font-bold text-gray-800'>
          Welcome, {user?.name || "User"}
        </h1>
        <p className='text-gray-600 mt-1'>
          Manage your loan applications and track repayments
        </p>
      </div>
      <button
        onClick={() => setShowApplicationForm(true)}
        className='flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium'
      >
        <Plus className='w-5 h-5' />
        <span>Apply for Loan</span>
      </button>
    </div>
  );

  const renderStats = () => (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-gray-600 text-sm font-medium'>Active Loans</p>
            <p className='text-3xl font-bold text-gray-800 mt-2'>
              {totalActiveLoans}
            </p>
          </div>
          <div className='bg-blue-100 p-3 rounded-xl'>
            <FileText className='w-8 h-8 text-blue-600' />
          </div>
        </div>
      </div>

      <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-gray-600 text-sm font-medium'>
              Total Outstanding
            </p>
            <p className='text-3xl font-bold text-gray-800 mt-2'>
              {formatCurrency(totalOutstanding, "USD")}
            </p>
          </div>
          <div className='bg-orange-100 p-3 rounded-xl'>
            <Calendar className='w-8 h-8 text-orange-600' />
          </div>
        </div>
      </div>

      <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-gray-600 text-sm font-medium'>Next EMI</p>
            <p className='text-3xl font-bold text-gray-800 mt-2'>
              {formatCurrency(nextEmi, "USD")}
            </p>
          </div>
          <div className='bg-green-100 p-3 rounded-xl'>
            <Calendar className='w-8 h-8 text-green-600' />
          </div>
        </div>
      </div>
    </div>
  );

  const renderMyLoans = () => (
    <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20'>
      <div className='p-6 border-b border-gray-200'>
        <h2 className='text-xl font-semibold text-gray-800'>
          Your Loan Applications
        </h2>
      </div>

      {loading ? (
        <div className='p-6 text-gray-600'>Loading…</div>
      ) : err ? (
        <div className='p-6 text-red-600'>{err}</div>
      ) : loans.length === 0 ? (
        <div className='p-12 text-center'>
          <FileText className='w-16 h-16 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-600 mb-2'>
            No Applications Yet
          </h3>
          <p className='text-gray-500 mb-6'>
            Start by applying for your first loan
          </p>
          <button
            onClick={() => setShowApplicationForm(true)}
            className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium'
          >
            Apply Now
          </button>
        </div>
      ) : (
        <div className='p-6'>
          <div className='space-y-4'>
            {loans.map((l) => (
              <div
                key={l.id}
                className='bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200'
              >
                <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
                  <div className='flex-1'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <h3 className='text-lg font-semibold text-gray-800'>
                        {formatCurrency(l.amount || 0, "USD")}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          l.status
                        )}`}
                      >
                        <span className='flex items-center space-x-1'>
                          {getStatusIcon(l.status)}
                          <span className='capitalize'>
                            {(l.status || "pending").toLowerCase()}
                          </span>
                        </span>
                      </span>
                    </div>

                    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm'>
                      <div>
                        <p className='text-gray-600'>Purpose</p>
                        <p className='font-medium text-gray-800'>
                          {l.purpose || l.loanType || "—"}
                        </p>
                      </div>
                      <div>
                        <p className='text-gray-600'>Tenure</p>
                        <p className='font-medium text-gray-800'>
                          {l.tenureMonths ?? "—"} months
                        </p>
                      </div>
                      <div>
                        <p className='text-gray-600'>Start Date</p>
                        <p className='font-medium text-gray-800'>
                          {l.startDate ? formatDate(l.startDate) : "—"}
                        </p>
                      </div>
                      <div>
                        <p className='text-gray-600'>Monthly EMI</p>
                        <p className='font-medium text-gray-800'>
                          {l.emi ? formatCurrency(l.emi, "USD") : "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {(l.status || "").toLowerCase() === "approved" && (
                    <div className='flex items-center space-x-3'>
                      <button
                        onClick={() => openScheduleModal(l.id)}
                        className='flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all duration-200'
                      >
                        <Eye className='w-4 h-4' />
                        <span>View Schedule</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg'>
      <h2 className='text-xl font-semibold text-gray-800 mb-4'>Profile</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div>
          <p className='text-sm text-gray-600'>Name</p>
          <p className='font-medium text-gray-800'>{user?.name || "—"}</p>
        </div>
        <div>
          <p className='text-sm text-gray-600'>Email</p>
          <p className='font-medium text-gray-800'>{user?.email || "—"}</p>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className='space-y-8'>
      {renderHeader()}
      {renderStats()}
      {renderMyLoans()}
    </div>
  );

  const renderApplyLoan = () => (
    <>
      {renderHeader()}
      <div className='mt-4' />
      <div className='bg-white/80 rounded-2xl shadow border'>
        <div className='p-6 border-b'>
          <h2 className='text-xl font-semibold text-gray-800'>
            Apply for a Loan
          </h2>
        </div>
        <div className='p-6'>
          <button
            onClick={() => setShowApplicationForm(true)}
            className='flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium'
          >
            <Plus className='w-5 h-5' />
            <span>Open Application Form</span>
          </button>
        </div>
      </div>
    </>
  );

  // choose content by currentView (from Layout)
  const viewContent = () => {
    switch (currentView) {
      case "apply-loan":
        return renderApplyLoan();
      case "my-loans":
        return renderMyLoans();
      case "payments":
        return <RepaymentSchedulePage />; // ✅ page view
      case "profile":
        return renderProfile();
      case "dashboard":
      default:
        return renderDashboard();
    }
  };

  return (
    <div className='space-y-8'>
      {viewContent()}

      {/* Modals */}
      {showApplicationForm && (
        <LoanApplicationForm
          onClose={() => setShowApplicationForm(false)}
          onSubmit={async () => {
            // If your LoanApplicationForm posts to /api/loans/apply,
            // just refresh the list after it closes:
            setShowApplicationForm(false);
            await loadLoans();
          }}
        />
      )}

      {showScheduleModal && selectedLoanId != null && (
        <RepaymentScheduleModal
          loanId={String(selectedLoanId)}
          onClose={() => setShowScheduleModal(false)}
        />
      )}
    </div>
  );
};

export default CustomerDashboard;
