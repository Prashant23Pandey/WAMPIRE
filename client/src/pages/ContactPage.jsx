import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Send,
  MessageSquare,
  User,
  Clock,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  ArrowLeft,
  Sparkles,
  PhoneCall,
  MapPin,
} from 'lucide-react';
import { EVENT_DETAILS } from '../utils/constants.js';
import contactService from '../services/contactService.js';
import { useToast } from '../hooks/useToast.js';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import Alert from '../components/common/Alert.jsx';
import Badge from '../components/common/Badge.jsx';

export const ContactPage = () => {
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [serverError, setServerError] = useState(null);

  const categories = [
    'General Inquiry',
    'Registration & Team Formation',
    'Mentor & Track Guidance',
    'Technical Support',
    'Partnerships & Sponsorships',
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com',
      color: 'hover:text-slate-900 hover:border-slate-400',
    },
    {
      name: 'Twitter / X',
      icon: Twitter,
      href: 'https://twitter.com',
      color: 'hover:text-sky-500 hover:border-sky-300',
    },
    {
      name: 'Discord Community',
      icon: MessageSquare,
      href: 'https://discord.com',
      color: 'hover:text-indigo-600 hover:border-indigo-300',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://linkedin.com',
      color: 'hover:text-blue-600 hover:border-blue-300',
    },
  ];

  const validate = () => {
    const newErrors = {};

    const nameTrim = formData.name.trim();
    if (!nameTrim) {
      newErrors.name = 'Full name is required.';
    } else if (nameTrim.length < 2) {
      newErrors.name = 'Full name must be at least 2 characters.';
    } else if (!/^[a-zA-Z\s]{2,100}$/.test(nameTrim)) {
      newErrors.name = 'Full name must contain letters and spaces only.';
    }

    const emailTrim = formData.email.trim();
    if (!emailTrim) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      newErrors.email = 'Please provide a valid email address.';
    }

    const msgTrim = formData.message.trim();
    if (!msgTrim) {
      newErrors.message = 'Message content is required.';
    } else if (msgTrim.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please resolve the highlighted form errors.', 'Validation Error');
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    const formattedMessage = `[Category: ${formData.category}] ${formData.message.trim()}`;

    try {
      const res = await contactService.submitContact({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        message: formattedMessage,
      });

      setIsSubmitted(true);
      setSubmittedData({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        category: formData.category,
      });
      setFormData({
        name: '',
        email: '',
        category: 'General Inquiry',
        message: '',
      });

      toast.success(
        res.data?.message || 'Your inquiry has been logged! Our team will respond shortly.',
        'Inquiry Submitted'
      );
    } catch (err) {
      const msg = err.message || 'Unable to deliver your inquiry. Please try again.';
      setServerError(msg);
      toast.error(msg, 'Submission Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-900 py-10 sm:py-14 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-soft-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portal
          </Link>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400">
            <span>CODE-A-NOVA</span> / <span className="text-blue-600">Contact</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-soft-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-bl from-blue-100/60 via-violet-100/40 to-transparent rounded-bl-full pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hackathon Helpdesk & Coordination</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Get in Touch With Organizers
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Have questions regarding track guidelines, hardware integration, team formation, or mentor sessions? The CODE-A-NOVA team is here to support your hackathon journey.
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Official Contact Channels & Socials */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact Information Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Official Channels
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Reach out directly through our verified communication desks.
                </p>
              </div>

              <div className="space-y-3.5">
                {/* General Support */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/90 flex items-start gap-3.5 group hover:border-blue-200 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                      General Desk
                    </span>
                    <a
                      href={`mailto:${EVENT_DETAILS.contactEmail || 'contact@codeanova.io'}`}
                      className="text-xs sm:text-sm font-extrabold text-slate-900 hover:text-blue-600 transition-colors block truncate"
                    >
                      {EVENT_DETAILS.contactEmail || 'contact@codeanova.io'}
                    </a>
                  </div>
                </div>

                {/* Technical / Hacker Support */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/90 flex items-start gap-3.5 group hover:border-violet-200 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 font-bold group-hover:scale-105 transition-transform">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Participant & Mentor Support
                    </span>
                    <a
                      href={`mailto:${EVENT_DETAILS.supportEmail || 'support@codeanova.io'}`}
                      className="text-xs sm:text-sm font-extrabold text-slate-900 hover:text-violet-600 transition-colors block truncate"
                    >
                      {EVENT_DETAILS.supportEmail || 'support@codeanova.io'}
                    </a>
                  </div>
                </div>

                {/* Response SLA */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/90 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Response SLA
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 block">
                      Typically within 24–48 working hours
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified Hackers Notice */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100 text-xs text-slate-600 leading-relaxed">
                <span className="font-bold text-blue-900 block mb-1">
                  Registered Hacker Notice:
                </span>
                Active squad leaders have immediate access to designated 24/7 Discord help channels via the participant dashboard.
              </div>
            </div>

            {/* Social Communities Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Follow & Connect
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Stay synced with real-time announcements, track reveals, and mentor AMAs.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-2.5 text-xs font-bold transition-all duration-200 group ${item.color}`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.name}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 ml-auto group-hover:text-current transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-soft-sm space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Submit an Inquiry
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fill in the details below. Our event operations desk will route your query to the appropriate track mentor or organizer.
              </p>
            </div>

            {/* Server Error Alert */}
            {serverError && (
              <Alert
                type="error"
                title="Submission Error"
                message={serverError}
                onClose={() => setServerError(null)}
              />
            )}

            {/* Success Submission Card */}
            {isSubmitted && (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-left space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Inquiry Dispatched Successfully!</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Thank you, <strong>{submittedData?.name}</strong>. Your message under{' '}
                  <strong>{submittedData?.category}</strong> has been logged into our support system. A confirmation email has been dispatched to{' '}
                  <span className="font-mono font-bold">{submittedData?.email}</span>.
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs font-bold text-emerald-700 underline hover:text-emerald-900 cursor-pointer"
                  >
                    Send another inquiry
                  </button>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <Input
                    label="Your Full Name"
                    name="name"
                    required
                    placeholder="Ada Lovelace"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    leftIcon={<User className="w-4 h-4" />}
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    required
                    placeholder="ada@codeanova.dev"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    leftIcon={<Mail className="w-4 h-4" />}
                  />
                </div>
              </div>

              {/* Inquiry Category */}
              <div className="space-y-1 text-left">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Inquiry Topic / Category <span className="text-blue-600">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-white text-slate-900 rounded-xl px-4 py-3 text-sm border border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-soft-sm cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">
                  Selecting the correct category accelerates inquiry routing to track leads.
                </p>
              </div>

              {/* Message */}
              <div className="space-y-1 text-left">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Your Message <span className="text-blue-600">*</span>
                </label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  placeholder="Detail your question or requirement (e.g., mentor office hours, API key support, sponsorship packages)..."
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full bg-white text-slate-900 rounded-xl p-4 text-sm border outline-none shadow-soft-sm transition-all ${
                    errors.message
                      ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                      : 'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50'
                  }`}
                />
                {errors.message ? (
                  <p className="text-xs text-red-600 font-medium mt-0.5">{errors.message}</p>
                ) : (
                  <p className="text-[11px] text-slate-400">
                    Minimum 10 characters required. Please provide specific details.
                  </p>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-400 text-center sm:text-left">
                  All queries are processed under the CODE-A-NOVA Privacy Policy.
                </span>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  leftIcon={<Send className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  Send Inquiry
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

