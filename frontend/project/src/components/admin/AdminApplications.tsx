// src/components/admin/AdminApplications.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/calculations";
import ApplicationDetailsModal from "./ApplicationDetailsModal";
import UpdateEMIModal from "./UpdateEMIModal";
import {
  AdminLoan,
  fetchAllLoans,
  approveLoan as apiApproveLoan,
  rejectLoan as apiRejectLoan,
} from "../../lib/admin";

const AdminApplications: React.FC = () => {
  const [applications, setApplications] = useState<AdminLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEMI, setShowEMI] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await fetchAllLoans();
        setApplications(data);
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Failed to load applications.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(
    () =>
      applications.filter(
        (a) => filterStatus === "all" || a.status === filterStatus
      ),
    [applications, filterStatus]
  );

  // Find the selected loan object for the modal (avoids undefined errors)
  const selectedLoan = useMemo(
    () => applications.find((x) => x.id === selectedId),
    [applications, selectedId]
  );

  function getStatusColor(s: AdminLoan["status"]) {
    switch (s) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  }

  function getStatusIcon(s: AdminLoan["status"]) {
    switch (s) {
      case "approved":
        return <CheckCircle className='w-4 h-4 text-green-600' />;
      case "rejected":
        return <XCircle className='w-4 h-4 text-red-600' />;
      default:
        return <Clock className='w-4 h-4 text-yellow-600' />;
    }
  }

  async function act(id: number, action: "approve" | "reject") {
    setBusyId(id);
    try {
      const updated =
        action === "approve"
          ? await apiApproveLoan(id)
          : await apiRejectLoan(id);
      setApplications((prev) => prev.map((x) => (x.id === id ? updated : x)));
    } catch (e: any) {
      alert(
        e?.response?.data?.message || `Failed to ${action} application #${id}`
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className='space-y-6'>
      <header className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-800'>Loan Applications</h1>
        <div className='flex space-x-2'>
          {(["all", "pending", "approved", "rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filterStatus === s
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {err && (
        <div className='rounded-xl border border-red-200 bg-red-50 p-4 text-red-700'>
          {err}
        </div>
      )}

      <div className='bg-white/80 rounded-2xl shadow-lg border'>
        <div className='p-6 overflow-x-auto'>
          {loading ? (
            <div className='text-center text-gray-600 py-16'>Loading…</div>
          ) : (
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
                {filtered.map((a) => (
                  <tr key={a.id} className='border-b hover:bg-gray-50'>
                    <td className='py-4 px-2'>
                      <div className='font-medium'>
                        {a.customerName || "Customer"}
                      </div>
                      <div className='text-sm text-gray-600'>
                        {a.customerEmail || "—"}
                      </div>
                    </td>
                    <td className='py-4 px-2 font-semibold'>
                      {formatCurrency(a.amount, "USD")}
                    </td>
                    <td className='py-4 px-2'>{a.purpose || "—"}</td>
                    <td className='py-4 px-2'>
                      {a.tenureMonths ? `${a.tenureMonths} months` : "—"}
                    </td>
                    <td className='py-4 px-2'>
                      {a.appliedDate ? formatDate(a.appliedDate) : "—"}
                    </td>
                    <td className='py-4 px-2 text-center'>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${getStatusColor(
                          a.status
                        )}`}
                      >
                        {getStatusIcon(a.status)}{" "}
                        <span className='capitalize'>{a.status}</span>
                      </span>
                    </td>
                    <td className='py-4 px-2'>
                      <div className='flex items-center justify-center gap-2'>
                        <button
                          onClick={() => {
                            setSelectedId(a.id);
                            setShowDetails(true);
                          }}
                          className='bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100'
                          title='Details'
                        >
                          <Eye className='w-4 h-4' />
                        </button>

                        {a.status === "pending" && (
                          <>
                            <button
                              onClick={() => act(a.id, "approve")}
                              disabled={busyId === a.id}
                              className='bg-green-50 text-green-600 p-2 rounded-lg hover:bg-green-100 disabled:opacity-50'
                              title='Approve'
                            >
                              <CheckCircle className='w-4 h-4' />
                            </button>
                            <button
                              onClick={() => act(a.id, "reject")}
                              disabled={busyId === a.id}
                              className='bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 disabled:opacity-50'
                              title='Reject'
                            >
                              <XCircle className='w-4 h-4' />
                            </button>
                          </>
                        )}

                        {a.status === "approved" && (
                          <button
                            onClick={() => {
                              setSelectedId(a.id);
                              setShowEMI(true);
                            }}
                            className='bg-indigo-50 text-indigo-600 p-2 rounded-lg hover:bg-indigo-100'
                            title='Update EMI'
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
          )}

          {!loading && filtered.length === 0 && (
            <div className='text-center py-12'>
              <FileText className='w-16 h-16 text-gray-400 mx-auto mb-4' />
              <div className='text-gray-600'>No applications found.</div>
            </div>
          )}
        </div>
      </div>

      {/* Details modal: pass the LOAN OBJECT, not an id */}
      {showDetails && (
        <ApplicationDetailsModal
          loan={selectedLoan}
          onClose={() => setShowDetails(false)}
        />
      )}

      {/* EMI modal can stay id-based if your modal expects an id */}
      {showEMI && selectedId != null && (
        <UpdateEMIModal
          applicationId={String(selectedId)}
          onClose={() => setShowEMI(false)}
        />
      )}
    </div>
  );
};

export default AdminApplications;
