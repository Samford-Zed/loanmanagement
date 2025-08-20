import React, { useMemo, useState } from "react";
import { Banknote, Calendar, FileText, Calculator, Layers } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { calculateEMI, formatCurrency } from "../../utils/calculations";
import { applyForLoan } from "../../lib/loans";

interface LoanApplicationFormProps {
  onClose: () => void;
  /** Optional: parent can update UI with the created loan from server */
  onSubmit?: (serverLoan: any) => void;
}

const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({
  onClose,
  onSubmit,
}) => {
  useAuth(); // ensures token is present via api interceptor

  // 🔑 Backend expects: amount, loanType, tenureMonths, purpose, annualIncome
  const [form, setForm] = useState({
    amount: "",
    loanType: "",
    tenureMonths: "12",
    purpose: "",
    annualIncome: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  // purely UI preview (your backend sets/uses its own interest internally)
  const previewRate = 10; // shown only for EMI preview
  const emiPreview = useMemo(() => {
    if (!form.amount || !form.tenureMonths) return 0;
    return calculateEMI(
      parseFloat(form.amount),
      previewRate,
      parseInt(form.tenureMonths)
    );
  }, [form.amount, form.tenureMonths]);

  const loanTypes = ["Personal Loan", "Business Loan", "Student Loan", "Other"];

  const loanPurposes = [
    "Home Purchase",
    "Car Purchase",
    "Business Expansion",
    "Education",
    "Debt Consolidation",
    "Medical Emergency",
    "Other",
  ];

  const tenureOptions = [
    { value: "12", label: "1 Year" },
    { value: "24", label: "2 Years" },
    { value: "36", label: "3 Years" },
    { value: "60", label: "5 Years" },
    { value: "84", label: "7 Years" },
    { value: "120", label: "10 Years" },
    { value: "180", label: "15 Years" },
    { value: "240", label: "20 Years" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // basic validation to mirror backend constraints
    if (!form.amount || parseFloat(form.amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (!form.loanType) {
      setError("Please select a loan type.");
      return;
    }
    if (!form.tenureMonths) {
      setError("Please select a tenure.");
      return;
    }
    if (!form.purpose) {
      setError("Please select a loan purpose.");
      return;
    }
    if (!form.annualIncome || parseFloat(form.annualIncome) <= 0) {
      setError("Please enter your annual income.");
      return;
    }

    setSubmitting(true);
    try {
      // ✅ send exactly what the backend expects
      const payload = {
        amount: parseFloat(form.amount),
        loanType: form.loanType,
        tenureMonths: parseInt(form.tenureMonths),
        purpose: form.purpose,
        annualIncome: parseFloat(form.annualIncome),
      };

      const created = await applyForLoan(payload);

      // let parent refresh its list etc.
      onSubmit?.(created);
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data ||
          err?.response?.data?.message ||
          "Failed to submit application."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold text-gray-800'>Apply for Loan</h2>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 text-2xl font-light'
            >
              ×
            </button>
          </div>
          {error && (
            <div className='mt-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm'>
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Amount */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Loan Amount (USD)
              </label>
              <div className='relative'>
                <Banknote className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input
                  type='number'
                  required
                  min='500'
                  className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                  placeholder='Enter loan amount'
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>
            </div>

            {/* Loan Type */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Loan Type
              </label>
              <div className='relative'>
                <Layers className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
                <select
                  required
                  className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white'
                  value={form.loanType}
                  onChange={(e) =>
                    setForm({ ...form, loanType: e.target.value })
                  }
                >
                  <option value=''>Select type</option>
                  {loanTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tenure */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Loan Tenure
              </label>
              <div className='relative'>
                <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
                <select
                  required
                  className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white'
                  value={form.tenureMonths}
                  onChange={(e) =>
                    setForm({ ...form, tenureMonths: e.target.value })
                  }
                >
                  {tenureOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Loan Purpose
              </label>
              <div className='relative'>
                <FileText className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
                <select
                  required
                  className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white'
                  value={form.purpose}
                  onChange={(e) =>
                    setForm({ ...form, purpose: e.target.value })
                  }
                >
                  <option value=''>Select purpose</option>
                  {loanPurposes.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Annual Income */}
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Annual Income (USD)
              </label>
              <div className='relative'>
                <Banknote className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input
                  type='number'
                  required
                  min='0'
                  className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                  placeholder='Enter your annual income'
                  value={form.annualIncome}
                  onChange={(e) =>
                    setForm({ ...form, annualIncome: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* EMI Preview (UI only) */}
          {form.amount && form.tenureMonths && (
            <div className='bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6'>
              <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                <Calculator className='w-5 h-5 mr-2 text-blue-600' />
                EMI Preview (at {previewRate}% p.a.)
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-gray-600'>Monthly EMI</p>
                  <p className='text-2xl font-bold text-blue-600'>
                    {formatCurrency(emiPreview, "USD")}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>
                    Total Amount (approx.)
                  </p>
                  <p className='text-2xl font-bold text-gray-800'>
                    {formatCurrency(
                      emiPreview * parseInt(form.tenureMonths || "0"),
                      "USD"
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className='flex space-x-4 pt-6'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all duration-200'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={submitting}
              className='flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-200 disabled:opacity-50'
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanApplicationForm;
