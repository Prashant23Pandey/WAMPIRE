import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import Alert from '../components/common/Alert.jsx';

export const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendError, setBackendError] = useState(null);

  const { signup } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Field validation rules
  const validateField = (name, value, allValues = formData) => {
    let error = '';
    const trimmed = (value || '').trim();

    switch (name) {
      case 'fullName':
        if (!trimmed) {
          error = 'Full name is required.';
        } else if (trimmed.length < 3) {
          error = 'Full name must be at least 3 characters.';
        }
        break;

      case 'email':
        if (!trimmed) {
          error = 'Email address is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
          error = 'Please enter a valid email address.';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required.';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters long.';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password.';
        } else if (value !== allValues.password) {
          error = 'Passwords do not match.';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);

    // Clear backend error on edit
    if (backendError) setBackendError(null);

    // Inline field validation if field was previously errored
    if (errors[name]) {
      const fieldError = validateField(name, value, nextFormData);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }

    // If typing in password, recheck confirmPassword if already touched
    if (name === 'password' && formData.confirmPassword) {
      const confirmErr = validateField('confirmPassword', formData.confirmPassword, nextFormData);
      setErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendError(null);

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key], formData);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signup({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (result.success) {
        toast.success(
          'Verification code has been dispatched to your email.',
          'Account Created'
        );
        // Navigate to OTP verification with pre-filled email
        navigate(`/verify-otp?email=${encodeURIComponent(formData.email.trim().toLowerCase())}`, {
          state: { email: formData.email.trim().toLowerCase() },
        });
      } else {
        setBackendError(result.message || 'Signup failed. Please try again.');
        toast.error(result.message || 'Failed to complete registration.', 'Registration Error');
      }
    } catch (err) {
      const msg = err.message || 'An unexpected error occurred. Please try again.';
      setBackendError(msg);
      toast.error(msg, 'Network Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF007F]/10 border border-[#FF007F]/30 text-[#FF007F] text-xs font-mono font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#FF007F]" />
          <span>[ STAGE 01 // IDENTITY ]</span>
        </div>
        <h2 className="text-2xl font-serif font-black text-black tracking-tight">Create Hacker Account</h2>
        <p className="mt-1 text-xs text-neutral-600 font-sans">
          Join WAMPIRE. We'll send a 6-digit OTP to verify your email.
        </p>
      </div>

      {backendError && (
        <Alert
          type="error"
          title="Registration Error"
          message={backendError}
          onClose={() => setBackendError(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full Name */}
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          placeholder="Ada Lovelace"
          value={formData.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.fullName}
          required
          leftIcon={<User className="w-4 h-4" />}
          autoComplete="name"
        />

        {/* Email Address */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="ada@lovelace.dev"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          required
          leftIcon={<Mail className="w-4 h-4" />}
          autoComplete="email"
        />

        {/* Password */}
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="At least 8 characters"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          helperText={!errors.password ? 'Must be at least 8 characters long' : undefined}
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
          autoComplete="new-password"
        />

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.confirmPassword}
          required
          leftIcon={<ShieldCheck className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
              tabIndex={-1}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          autoComplete="new-password"
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-4"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {isSubmitting ? 'Sending Verification Code...' : 'Create Account'}
        </Button>
      </form>

      <div className="pt-4 border-t border-black/10 text-center text-xs font-mono text-neutral-600">
        Already have an account?{' '}
        <Link to="/login" className="text-[#FF007F] font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Signup;

