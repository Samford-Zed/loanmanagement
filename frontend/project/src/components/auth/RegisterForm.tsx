import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Building2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface RegisterFormProps {
  onToggleMode: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const { register, loading, logout, error } = useAuth(); // <-- pull error too
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters";
    if (!formData.email.includes("@"))
      newErrors.email = "Please enter a valid email";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSuccess("");

    if (!validateForm()) return;

    // ✅ SEND THE SHAPE THE BACKEND EXPECTS: name, email, password
    const ok = await register(formData.name, formData.email, formData.password);

    if (ok) {
      // You said you want the user to sign in manually after registering:
      try {
        await logout();
      } catch {}
      setSuccess("Account created! You can now sign in.");
      setTimeout(() => onToggleMode(), 800);
    } else {
      setSubmitError(error || "Registration failed. Please try again.");
    }
  };

  return (
    <div className='w-full max-w-md mx-auto'>
      {/* Hide native password-reveal/clear buttons to prevent double eyes */}
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
          <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl mx-auto mb-4'>
            <Building2 className='w-8 h-8 text-white' />
          </div>
        </div>

        {success && (
          <div className='mb-4 rounded-lg bg-green-50 text-green-700 px-4 py-3 text-sm'>
            {success}
          </div>
        )}
        {(submitError || error) && (
          <div className='mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm'>
            {submitError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Full Name
            </label>
            <div className='relative'>
              <User className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type='text'
                required
                className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50'
                placeholder='Enter your full name'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            {errors.name && (
              <p className='mt-1 text-sm text-red-600'>{errors.name}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Email Address
            </label>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type='email'
                required
                className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50'
                placeholder='Enter your email'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            {errors.email && (
              <p className='mt-1 text-sm text-red-600'>{errors.email}</p>
            )}
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
                className='w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50'
                placeholder='Create a password'
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type='button'
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                onClick={() => setShowPassword(!showPassword)}
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
            {errors.password && (
              <p className='mt-1 text-sm text-red-600'>{errors.password}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Confirm Password
            </label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                className='w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50'
                placeholder='Confirm your password'
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <button
                type='button'
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className='w-5 h-5' />
                ) : (
                  <Eye className='w-5 h-5' />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-4 rounded-xl font-medium hover:from-green-700 hover:to-teal-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className='mt-8 text-center'>
          <p className='text-gray-600'>
            Already have an account?{" "}
            <button
              onClick={onToggleMode}
              className='text-green-600 font-medium hover:text-green-700 transition-colors duration-200'
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
