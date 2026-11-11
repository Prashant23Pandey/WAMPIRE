import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Send,
  MessageSquare,
  User,
  Clock,
  HelpCircle,
  Check,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { EVENT_DETAILS } from '../utils/constants.js';
import contactService from '../services/contactService.js';
import { useToast } from '../hooks/useToast.js';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import Alert from '../components/common/Alert.jsx';

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
      color: 'hover:text-[#FF007F] hover:border-[#FF007F]',
    },
    {
      name: 'Twitter / X',
      icon: Twitter,
      href: 'https://twitter.com',
      color: 'hover:text-[#FF007F] hover:border-[#FF007F]',
    },
    {
      name: 'Discord',
      icon: MessageSquare,
      href: 'https://discord.com',
      color: 'hover:text-[#FF007F] hover:border-[#FF007F]',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://linkedin.com',
      color: 'hover:text-[#FF007F] hover:border-[#FF007F]',
    },
  ];

  const validate = () => {
    const errs = {};
    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name) {
      errs.name = 'Please provide your full name.';
    } else if (name.length < 2) {
      errs.name = 'Full name must contain at least 2 characters.';
    } else if (!/^[a-zA-Z\s]{2,100}$/.test(name)) {
      errs.name = 'Full name must contain letters and permitted spaces only.';
    }

    if (!email) {
      errs.email = 'Please provide an email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please provide a valid email format.';
    }

    if (!message) {
      errs.message = 'Please provide your inquiry message.';
    } else if (message.length < 10) {
      errs.message = 'Your message must be at least 10 characters long.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        category: formData.category,
        message: formData.message.trim(),
      };

      const res = await contactService.submitInquiry(payload);

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
    <div className="w-full min-h-screen bg-white text-black py-20 px-4 sm:px-6 lg:px-8 text-left tech-grid-light">
      <div className="max-w-6xl mx-auto space-y-8 pt-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-neutral-700 hover:text-black transition-all bg-white px-4 py-2 rounded-full border border-black/10 hover:border-[#FF007F] shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#FF007F]" />
            <span>Back to Arena</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-500">
            <span>WAMPIRE</span> / <span className="text-[#FF007F]">Contact</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-black/10 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-[#FF007F]/5 rounded-bl-full pointer-events-none blur-3xl" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF007F]/10 border border-[#FF007F]/30 text-[#FF007F] text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>[ HELPDESK & DISPATCH ]</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-black text-black tracking-tight">
              Get in Touch With <span className="gradient-text-neon italic">Organizers.</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 font-sans leading-relaxed">
              Have questions regarding track guidelines, hardware integration, team formation, or mentor sessions? The WAMPIRE team is here to support your hackathon journey.
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Official Contact Channels & Socials */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact Information Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-serif font-bold text-black tracking-tight">
                  Official Channels
                </h2>
                <p className="text-xs text-neutral-500 mt-1 font-sans">
                  Reach out directly through our verified communication desks.
                </p>
              </div>

              <div className="space-y-3.5">
                {/* General Support */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-black/10 flex items-start gap-3.5 group hover:border-[#FF007F] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#FF007F]/10 border border-[#FF007F]/20 text-[#FF007F] flex items-center justify-center shrink-0 font-bold group-hover:scale-105 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block mb-0.5">
                      General Desk
                    </span>
                    <a
                      href={`mailto:${EVENT_DETAILS.contactEmail || 'contact@wampire.io'}`}
                      className="text-xs sm:text-sm font-mono font-bold text-black hover:text-[#FF007F] transition-colors block truncate"
                    >
                      {EVENT_DETAILS.contactEmail || 'contact@wampire.io'}
                    </a>
                  </div>
                </div>

                {/* Technical Support */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-black/10 flex items-start gap-3.5 group hover:border-[#FF007F] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#FF007F]/10 border border-[#FF007F]/20 text-[#FF007F] flex items-center justify-center shrink-0 font-bold group-hover:scale-105 transition-transform">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block mb-0.5">
                      Builder & Mentor Support
                    </span>
                    <a
                      href={`mailto:${EVENT_DETAILS.supportEmail || 'support@wampire.io'}`}
                      className="text-xs sm:text-sm font-mono font-bold text-black hover:text-[#FF007F] transition-colors block truncate"
                    >
                      {EVENT_DETAILS.supportEmail || 'support@wampire.io'}
                    </a>
                  </div>
                </div>

                {/* Response SLA */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-black/10 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-black/10 text-black flex items-center justify-center shrink-0 font-bold shadow-sm">
                    <Clock className="w-4 h-4 text-[#FF007F]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block mb-0.5">
                      Response SLA
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-black block">
                      Within 24–48 working hours
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified Hackers Notice */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-black/10 text-xs font-mono text-neutral-600 leading-relaxed">
                <span className="font-bold text-black block mb-1">
                  Registered Builder Notice:
                </span>
                Active squad leaders have immediate access to designated 24/7 Discord help channels via the participant dashboard.
              </div>
            </div>

            {/* Social Communities Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-serif font-bold text-black tracking-tight">
                  Follow & Connect
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5 font-sans">
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
                      className={`p-3.5 rounded-2xl bg-neutral-50 border border-black/10 text-neutral-700 hover:text-black flex items-center gap-2.5 text-xs font-mono font-bold transition-all duration-200 group ${item.color}`}
                    >
                      <Icon className="w-4 h-4 shrink-0 text-[#FF007F]" />
                      <span className="truncate">{item.name}</span>
                      <ExternalLink className="w-3 h-3 text-neutral-400 ml-auto group-hover:text-current transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-black/10 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF007F] to-transparent opacity-80" />

            <div className="pb-4 border-b border-black/10">
              <h2 className="text-xl sm:text-2xl font-serif font-black text-black tracking-tight">
                Submit an Inquiry
              </h2>
              <p className="text-xs text-neutral-500 mt-1 font-sans">
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
              <div className="p-5 rounded-2xl bg-neutral-50 border border-[#FF007F]/40 text-left space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2.5 text-black font-mono font-bold text-sm">
                  <Check className="w-4 h-4 text-[#FF007F]" />
                  <span>Inquiry Dispatched Successfully!</span>
                </div>
                <p className="text-xs text-neutral-700 font-sans leading-relaxed">
                  Thank you, <strong>{submittedData?.name}</strong>. Your message under{' '}
                  <strong>{submittedData?.category}</strong> has been logged into our support system. A confirmation email has been dispatched to{' '}
                  <span className="font-mono font-bold text-[#FF007F]">{submittedData?.email}</span>.
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs font-mono font-bold text-[#FF007F] underline hover:text-black cursor-pointer"
                  >
                    Send another inquiry
                  </button>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  required
                  placeholder="ada@lovelace.dev"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  leftIcon={<Mail className="w-4 h-4" />}
                />
              </div>

              {/* Inquiry Category */}
              <div className="space-y-1 text-left">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
                  Inquiry Topic / Category <span className="text-[#FF007F]">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-white text-black rounded-xl px-4 py-3 text-sm border border-black/15 hover:border-black/30 focus:border-[#FF007F] focus:ring-2 focus:ring-[#FF007F]/20 outline-none font-sans"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-white text-black">
                      {c}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] font-mono text-neutral-500">
                  Selecting the correct category accelerates inquiry routing to track leads.
                </p>
              </div>

              {/* Message */}
              <div className="space-y-1 text-left">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
                  Your Message <span className="text-[#FF007F]">*</span>
                </label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  placeholder="Detail your question or requirement (e.g., mentor office hours, API key support, sponsorship packages)..."
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full bg-white text-black placeholder-neutral-400 rounded-xl p-4 text-sm border outline-none font-sans resize-none transition-all ${
                    errors.message
                      ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                      : 'border-black/15 hover:border-black/30 focus:border-[#FF007F] focus:ring-2 focus:ring-[#FF007F]/20'
                  }`}
                />
                {errors.message ? (
                  <p className="text-xs text-red-500 font-medium mt-0.5">{errors.message}</p>
                ) : (
                  <p className="text-[11px] font-mono text-neutral-500">
                    Minimum 10 characters required. Please provide specific details.
                  </p>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
                <span className="text-xs text-neutral-500 text-center sm:text-left">
                  All queries are processed under the WAMPIRE Privacy Policy.
                </span>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  leftIcon={<Send className="w-4 h-4" />}
                  className="w-full sm:w-auto text-xs uppercase tracking-wider font-bold shadow-glow-pink"
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
