import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Clock, RefreshCw, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';
import Button from '../components/common/Button.jsx';
import Alert from '../components/common/Alert.jsx';

export const VerifyOTP = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { verifyOtp, resendOtp } = useAuth();

  // Retrieve email from query param or router state
  const initialEmail = searchParams.get('email') || location.state?.email || '';
  const [email, setEmail] = useState(initialEmail);

  // Six individual digit inputs
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const [error, setError] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // 10-Minute Expiry Countdown (600 seconds)
  const [expirySeconds, setExpirySeconds] = useState(600);

  // 60-Second Resend Cooldown
  const [resendCooldown, setResendCooldown] = useState(60);

  // Update email if query param changes
  useEffect(() => {
    if (initialEmail && initialEmail !== email) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  // Expiry countdown timer (10 minutes)
  useEffect(() => {
    if (expirySeconds <= 0) return;
    const interval = setInterval(() => {
      setExpirySeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [expirySeconds]);

  // Resend cooldown timer (60 seconds)
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // Focus initial box on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const otpCode = otpDigits.join('');

  // Handle individual digit input
  const handleDigitChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1); // Only keep single digit

    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    if (error) setError(null);

    // Automatic focus movement to the next box
    if (digit && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace navigation and arrow keys
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0 && inputRefs.current[index - 1]) {
        // Move focus backward and clear previous box
        inputRefs.current[index - 1].focus();
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
      } else {
        const newDigits = [...otpDigits];
        newDigits[index] = '';
        setOtpDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle clipboard paste across all 6 boxes
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text/plain') || '';
    const cleanDigits = pastedText.replace(/\D/g, '').slice(0, 6);

    if (!cleanDigits) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = cleanDigits[i] || '';
    }
    setOtpDigits(newDigits);

    // Focus last filled box or next empty box
    const nextIndex = Math.min(cleanDigits.length, 5);
    if (inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex].focus();
    }

    if (error) setError(null);
  };

  // Handle verification form submission
  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please provide the email address associated with your registration.');
      return;
    }

    if (otpCode.length !== 6) {
      setError('Please enter the complete six-digit verification code.');
      // Focus first empty box
      const firstEmptyIndex = otpDigits.findIndex((d) => !d);
      if (firstEmptyIndex !== -1 && inputRefs.current[firstEmptyIndex]) {
        inputRefs.current[firstEmptyIndex].focus();
      }
      return;
    }

    if (expirySeconds <= 0) {
      setError('This verification code has expired. Please request a new code below.');
      return;
    }

    setIsVerifying(true);

    try {
      const result = await verifyOtp({
        email: cleanEmail,
        otp: otpCode,
      });

      if (result.success) {
        toast.success(
          'Account verified successfully! You may now sign in.',
          'Verification Confirmed'
        );
        navigate('/login?verified=true', { state: { email: cleanEmail } });
      } else {
        setError(result.message || 'Invalid or expired OTP code.');
        toast.error(result.message || 'Verification failed.', 'Invalid Code');
      }
    } catch (err) {
      const msg = err.message || 'An error occurred during verification. Please try again.';
      setError(msg);
      toast.error(msg, 'Verification Error');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Resend OTP request
  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please provide your email address to receive a new code.');
      return;
    }

    setIsResending(true);
    setError(null);

    try {
      const result = await resendOtp({ email: cleanEmail });

      if (result.success) {
        toast.info(
          'A new six-digit verification code has been dispatched.',
          'New Code Sent'
        );
        // Reset timers
        setResendCooldown(60);
        setExpirySeconds(600); // 10 minutes
        // Clear existing input boxes
        setOtpDigits(['', '', '', '', '', '']);
        if (inputRefs.current[0]) inputRefs.current[0].focus();
      } else {
        setError(result.message || 'Failed to resend code. Please try again in a few moments.');
        toast.error(result.message || 'Resend request failed.', 'Resend Failed');
      }
    } catch (err) {
      const msg = err.message || 'Unable to connect to email service.';
      setError(msg);
      toast.error(msg, 'Network Error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-white border border-[#FF007F]/40 text-[#FF007F] flex items-center justify-center mx-auto mb-3 shadow-glow-pink-sm">
          <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
        </div>
        <h2 className="text-2xl font-serif font-black text-black tracking-tight">Verify Your Account</h2>
        <p className="mt-1 text-xs text-neutral-600 max-w-sm mx-auto font-sans">
          We sent a six-digit verification code to your email. Enter it below to unlock your portal account.
        </p>
      </div>

      {error && (
        <Alert
          type="error"
          title="Verification Notice"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <form onSubmit={handleVerify} className="space-y-5">
        {/* Email Address Confirmation / Edit */}
        <div className="text-left space-y-1">
          <label htmlFor="verify-email" className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
            Account Email <span className="text-[#FF007F]">*</span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="verify-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hacker@wampire.org"
              required
              className="w-full bg-white text-black placeholder-neutral-400 rounded-xl pl-10 pr-4 py-2.5 text-sm border border-black/15 hover:border-black/30 focus:border-[#FF007F] focus:ring-2 focus:ring-[#FF007F]/20 outline-none transition-all font-sans"
            />
          </div>
        </div>

        {/* Six Individual OTP Input Boxes */}
        <div className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
              6-Digit Security Code <span className="text-[#FF007F]">*</span>
            </label>
            {/* Expiry Countdown */}
            <span
              className={`text-xs font-mono font-bold flex items-center gap-1 transition-colors ${
                expirySeconds < 60 ? 'text-[#FF007F] animate-pulse' : 'text-neutral-500'
              }`}
              title="Time until verification code expires"
            >
              <Clock className="w-3.5 h-3.5 text-[#FF007F]" />
              {expirySeconds > 0 ? (
                <span>Expires in {formatTime(expirySeconds)}</span>
              ) : (
                <span className="text-red-600 font-extrabold">Expired</span>
              )}
            </span>
          </div>

          <div
            className="grid grid-cols-6 gap-2 sm:gap-3 py-1"
            onPaste={handlePaste}
            role="group"
            aria-label="Six digit OTP input"
          >
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isVerifying || expirySeconds <= 0}
                className={`w-full aspect-square text-center font-mono font-extrabold text-2xl sm:text-3xl rounded-xl border outline-none transition-all duration-150 ${
                  digit
                    ? 'border-[#FF007F] bg-[#FF007F]/10 text-black ring-2 ring-[#FF007F]/30 shadow-glow-pink-sm'
                    : 'border-black/15 bg-white text-black hover:border-black/30 focus:border-[#FF007F] focus:ring-2 focus:ring-[#FF007F]/20'
                } ${
                  expirySeconds <= 0
                    ? 'opacity-50 cursor-not-allowed bg-neutral-100'
                    : 'cursor-text'
                }`}
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>

          <p className="text-[11px] text-neutral-500 font-mono text-center">
            Paste support enabled. You can copy the code directly from your email.
          </p>
        </div>

        {/* Verify Action Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2 font-mono text-xs uppercase tracking-wider font-bold shadow-glow-pink"
          isLoading={isVerifying}
          disabled={otpCode.length !== 6 || isVerifying || expirySeconds <= 0}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {isVerifying ? 'Verifying Code...' : 'Verify OTP & Continue'}
        </Button>
      </form>

      {/* Resend Action & Cooldown */}
      <div className="pt-4 border-t border-black/10 flex flex-col items-center justify-center gap-2 text-xs font-mono text-neutral-600">
        <span>Didn't receive the email or did your code expire?</span>
        <button
          type="button"
          onClick={handleResend}
          disabled={resendCooldown > 0 || isResending}
          className="font-bold text-[#FF007F] hover:text-[#E60072] disabled:text-neutral-400 disabled:cursor-not-allowed inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
          {resendCooldown > 0 ? (
            <span>Resend Code in {resendCooldown}s</span>
          ) : (
            <span>Resend Code Now</span>
          )}
        </button>
      </div>

      <div className="text-center text-xs font-mono text-neutral-600">
        <Link to="/login" className="hover:text-[#FF007F] transition-colors">
          Already verified? Sign In here
        </Link>
      </div>
    </div>
  );
};

export default VerifyOTP;

