import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import Alert from '../components/common/Alert.jsx';

const REMEMBERED_EMAIL_KEY = 'code_a_nova_remembered_email';

export const Login = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();

  const isJustVerified = searchParams.get('verified') === 'true';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [rememberEmail, setRememberEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);

  // Pre-fill remembered email or email passed via state/params
  useEffect(() => {
    const passedEmail = location.state?.email || searchParams.get('email');
    const savedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);

    if (passedEmail) {
      setFormData((prev) => ({ ...prev, email: passedEmail }));
    } else if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberEmail(true);
    }
  }, [location.state, searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
    if (unverifiedEmail) setUnverifiedEmail(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setUnverifiedEmail(null);

    const cleanEmail = formData.email.trim().toLowerCase();
    if (!cleanEmail || !formData.password) {
      setError('Please provide both your email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      // Remember email preference
      if (rememberEmail) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, cleanEmail);
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }

      // Execute login through AuthContext
      const result = await login({
        email: cleanEmail,
        password: formData.password,
      });

      if (result.success) {
        toast.success(
          `Welcome back, ${result.user?.fullName || 'Hacker'}!`,
          'Authentication Successful'
        );

        // Securely navigate to Dashboard
        navigate('/dashboard');
      } else {
        const errorMsg = result.message || 'Invalid credentials. Please verify your email and password.';
        setError(errorMsg);
        toast.error(errorMsg, 'Login Failed');

        if (result.requiresVerification) {
          setUnverifiedEmail(result.email || cleanEmail);
        }
      }
    } catch (err) {
      const msg = err.message || 'An unexpected error occurred during login.';
      setError(msg);
      toast.error(msg, 'Network Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200/80 text-violet-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Participant Portal</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Participant Sign In</h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter your credentials to access your CODE-A-NOVA hackathon dashboard.
        </p>
      </div>

      {isJustVerified && (
        <Alert
          type="success"
          title="Account Activated"
          message="Your email address has been verified. You may now sign in below."
        />
      )}

      {error && (
        <Alert
          type="error"
          title="Authentication Notice"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {unverifiedEmail && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
          <p className="font-bold">Your email address has not been verified yet.</p>
          <p className="text-amber-800">
            A 6-digit verification code was dispatched to your email. You must verify your account before signing in.
          </p>
          <Link
            to={`/verify-otp?email=${encodeURIComponent(unverifiedEmail)}`}
            className="inline-flex items-center gap-1.5 text-blue-600 font-bold hover:underline pt-1 cursor-pointer"
          >
            Enter 6-digit verification code now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email Address */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="hacker@code-a-nova.org"
          value={formData.email}
          onChange={handleChange}
          required
          leftIcon={<Mail className="w-4 h-4" />}
          autoComplete="email"
        />

        {/* Password with Visibility Toggle */}
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          autoComplete="current-password"
        />

        {/* Remember Email Option */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium select-none">
            <input
              type="checkbox"
              checked={rememberEmail}
              onChange={(e) => setRememberEmail(e.target.checked)}
              className="rounded bg-white border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
            />
            Remember my email
          </label>
          <span className="text-slate-400 text-[11px] font-mono">
            JWT Secured
          </span>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isLoading}
          disabled={isLoading}
          leftIcon={<LogIn className="w-4 h-4" />}
        >
          {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
        </Button>
      </form>

      <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
        Don't have a hackathon account yet?{' '}
        <Link to="/signup" className="text-blue-600 font-bold hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default Login;

