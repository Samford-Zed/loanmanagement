import React, { useEffect, useMemo, useState } from "react";
import {
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  DollarSign,
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/calculations";
import ApplicationDetailsModal from "./ApplicationDetailsModal";
import UpdateEMIModal from "./UpdateEMIModal";
import { useAuth } from "../../contexts/AuthContext";
import {
  AdminLoan,
  fetchAllLoans,
  approveLoan as apiApproveLoan,
  rejectLoan as apiRejectLoan,
} from "../../lib/admin";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth(); // ADMIN
  const [applications, setApplications] = useState<AdminLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [selectedLoan, setSelectedLoan] = useState<AdminLoan | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateEMIModal, setShowUpdateEMIModal] = useState(false);

  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [actionBusyId, setActionBusyId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await fetchAllLoans();
        setApplications(data);
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Failed to load loans.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredApplications = useMemo(
    () =>
      applications.filter(
        (a) => filterStatus === "all" || a.status === filterStatus
      ),
    [applications, filterStatus]
  );

  const totalApplications = applications.length;
  const pendingApplications = applications.filter(
    (a) => a.status === "pending"
  ).length;
  const approvedApplications = applications.filter(
    (a) => a.status === "approved"
  ).length;
  const totalLoanAmount = applications
    .filter((a) => a.status === "approved")
    .reduce((sum, a) => sum + (a.amount || 0), 0);

  async function handleApplicationAction(
    id: number,
    action: "approve" | "reject",
    remark?: string
  ) {
    setActionBusyId(id);
    try {
      const updated =
        action === "approve"
          ? await apiApproveLoan(id, remark)
          : await apiRejectLoan(id, remark);
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch (e: any) {
      alert(
        e?.response?.data?.message || `Failed to ${action} application #${id}`
      );
    } finally {
      setActionBusyId(null);
    }
  }

  function openDetails(loan: AdminLoan) {
    setSelectedLoan(loan);
    setShowDetailsModal(true);
  }
  function openUpdateEMI(loan: AdminLoan) {
    setSelectedLoan(loan);
    setShowUpdateEMIModal(true);
  }

  const getStatusColor = (s: AdminLoan["status"]) =>
    s === "approved"
      ? "bg-green-100 text-green-800 border-green-200"
      : s === "rejected"
      ? "bg-red-100 text-red-800 border-red-200"
      : "bg-yellow-100 text-yellow-800 border-yellow-200";

  const getStatusIcon = (s: AdminLoan["status"]) =>
    s === "approved" ? (
      <CheckCircle className='w-4 h-4 text-green-600' />
    ) : s === "rejected" ? (
      <XCircle className='w-4 h-4 text-red-600' />
    ) : (
      <Clock className='w-4 h-4 text-yellow-600' />
    );

  if (!user || user.role !== "ADMIN") {
    return (
      <div className='bg-white/80 rounded-2xl p-8 text-center'>
        <h2 className='text-xl font-semibold text-gray-800'>Admins only</h2>
        <p className='text-gray-600 mt-2'>
          Please sign in with an admin account.
        </p>
      </div>
    );
  }

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

      {/* Stats (bigger icons) */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-sm'>Total Applications</p>
              <p className='text-3xl font-bold text-gray-800 mt-2'>
                {totalApplications}
              </p>
            </div>
            <FileText className='w-10 h-10 text-blue-600' />
          </div>
        </div>

        <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-sm'>Pending Review</p>
              <p className='text-3xl font-bold text-yellow-600 mt-2'>
                {pendingApplications}
              </p>
            </div>
            <Clock className='w-10 h-10 text-yellow-600' />
          </div>
        </div>

        <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-sm'>Approved Loans</p>
              <p className='text-3xl font-bold text-green-600 mt-2'>
                {approvedApplications}
              </p>
            </div>
            <CheckCircle className='w-10 h-10 text-green-600' />
          </div>
        </div>

        <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-sm'>Total Disbursed</p>
              <p className='text-3xl font-bold text-gray-800 mt-2'>
                {formatCurrency(totalLoanAmount)}
              </p>
            </div>
            <DollarSign className='w-10 h-10 text-indigo-600' />
          </div>
        </div>
      </div>

      {/* Applications table */}
      <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border'>
        <div className='p-6 border-b'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <h2 className='text-xl font-semibold text-gray-800'>
              Loan Applications
            </h2>
            <div className='flex space-x-2'>
              {(["all", "pending", "approved", "rejected"] as const).map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                      filterStatus === s
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <div className='p-6'>
          {loading ? (
            <div className='text-center text-gray-600 py-16'>
              Loading applications…
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b'>
                    <th className='text-left py-3 px-2'>Customer</th>
                    <th className='text-left py-3 px-2'>Amount</th>
                    <th className='text-left py-3 px-2'>Purpose</th>
                    <th className='text-left py-3 px-2'>Tenure</th>
                    <th className='text-left py-3 px-2'>Applied Date</th>
                    <th className='text-center py-3 px-2'>Status</th>
                    <th className='text-center py-3 px-2'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((a) => (
                    <tr key={a.id} className='border-b hover:bg-gray-50'>
                      <td className='py-4 px-2'>
                        <p className='font-medium text-gray-800'>
                          {a.customerName || "Customer"}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {a.customerEmail || "—"}
                        </p>
                      </td>
                      <td className='py-4 px-2 font-semibold text-gray-800'>
                        {formatCurrency(a.amount)}
                      </td>
                      <td className='py-4 px-2 text-gray-700'>
                        {a.purpose || "—"}
                      </td>
                      <td className='py-4 px-2 text-gray-700'>
                        {a.tenureMonths ? `${a.tenureMonths} months` : "—"}
                      </td>
                      <td className='py-4 px-2 text-gray-700'>
                        {a.appliedDate ? formatDate(a.appliedDate) : "—"}
                      </td>
                      <td className='py-4 px-2 text-center'>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            a.status
                          )}`}
                        >
                          {getStatusIcon(a.status)}
                          <span className='capitalize'>{a.status}</span>
                        </span>
                      </td>
                      <td className='py-4 px-2'>
                        <div className='flex items-center justify-center gap-2'>
                          <button
                            onClick={() => openDetails(a)}
                            className='bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100'
                            title='View Details'
                          >
                            <Eye className='w-4 h-4' />
                          </button>

                          {a.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleApplicationAction(a.id, "approve")
                                }
                                disabled={actionBusyId === a.id}
                                className='bg-green-50 text-green-600 p-2 rounded-lg hover:bg-green-100 disabled:opacity-50'
                                title='Approve'
                              >
                                <CheckCircle className='w-4 h-4' />
                              </button>
                              <button
                                onClick={() =>
                                  handleApplicationAction(a.id, "reject")
                                }
                                disabled={actionBusyId === a.id}
                                className='bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 disabled:opacity-50'
                                title='Reject'
                              >
                                <XCircle className='w-4 h-4' />
                              </button>
                            </>
                          )}

                          {a.status === "approved" && (
                            <button
                              onClick={() => openUpdateEMI(a)}
                              className='bg-indigo-50 text-indigo-600 p-2 rounded-lg hover:bg-indigo-100'
                              title='Update EMI Status'
                            >
                              <TrendingUp className='w-4 h-4' />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredApplications.length === 0 && !loading && (
                <div className='text-center py-12 text-gray-600'>
                  No matching applications.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showDetailsModal && selectedLoan && (
        <ApplicationDetailsModal
          loan={selectedLoan}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
      {showUpdateEMIModal && selectedLoan && (
        <UpdateEMIModal
          applicationId={String(selectedLoan.id)}
          onClose={() => setShowUpdateEMIModal(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
