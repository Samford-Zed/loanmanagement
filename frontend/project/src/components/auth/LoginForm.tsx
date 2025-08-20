import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Building2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface LoginFormProps {
  onToggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    const success = await login(formData.email, formData.password);
    if (!success) {
      setLocalError("Invalid email or password");
      return;
    }

    // Redirect by role (AuthContext sets localStorage: token + role)
    const role = localStorage.getItem("role");
    navigate(role === "ADMIN" ? "/admin" : "/app", { replace: true });
  };

  return (
    <div className='w-full max-w-md mx-auto'>
      {/* Hide native password-reveal/clear buttons (Edge/WebKit) to avoid duplicate eyes */}
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear { display: none; }
        input[type="password"]::-webkit-credentials-auto-fill-button,
        input[type="password"]::-webkit-clear-button {
          display: none !important; -webkit-appearance: none;
        }
      `}</style>

      <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8'>
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mx-auto mb-4'>
            <Building2 className='w-8 h-8 text-white' />
          </div>
          <h2 className='text-2xl font-bold text-gray-800'>Welcome Back</h2>
          <p className='text-gray-600 mt-2'>Sign in to your account</p>
        </div>

        {(error || localError) && (
          <div className='mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm'>
            {error || localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Email Address
            </label>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type='email'
                required
                disabled={loading}
                className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50'
                placeholder='Enter your email'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Password
            </label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type={showPassword ? "text" : "password"}
                required
                disabled={loading}
                className='w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50'
                placeholder='Enter your password'
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type='button'
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className='w-5 h-5' />
                ) : (
                  <Eye className='w-5 h-5' />
                )}
              </button>
            </div>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className='mt-6 text-center'>
          <button
            onClick={() => (window.location.href = "/")}
            className='text-gray-500 text-sm hover:text-gray-700 transition-colors duration-200'
          >
            ← Back to Home
          </button>
        </div>

        <div className='mt-8 text-center'>
          <p className='text-gray-600'>
            Don&apos;t have an account?{" "}
            <button
              onClick={onToggleMode}
              className='text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200'
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
