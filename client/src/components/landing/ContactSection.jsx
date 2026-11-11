import React, { useState } from 'react';
import { Mail, MessageSquare, Send, Check, Clock, HelpCircle, User, Terminal } from 'lucide-react';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import Alert from '../common/Alert.jsx';
import { EVENT_DETAILS } from '../../utils/constants.js';
import contactService from '../../services/contactService.js';
import { useToast } from '../../hooks/useToast.js';

export const ContactSection = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      await contactService.submitContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: `[Subject: ${formData.subject}] ${formData.message.trim()}`,
      });
      setIsSubmitted(true);
      toast.success('Your message has been received! The team will be in touch shortly.', 'Message Sent');
      setFormData({
        name: '',
        email: '',
        subject: 'general',
        message: '',
      });
    } catch (err) {
      const msg = err.message || 'Unable to deliver message at this time.';
      setServerError(msg);
      toast.error(msg, 'Delivery Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#000000] border-b border-white/10 relative tech-grid-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
          <Badge variant="pink" size="md">
            DISPATCH & CONTACT
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-tight">
            CONNECT WITH THE{' '}
            <span className="gradient-text-neon italic">ORGANIZERS.</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-sans">
            Whether you have inquiries regarding team formation, venue logistics, or venture partnership opportunities, the coordination committee is at your disposal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Contact Details & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#09090b]/90 rounded-3xl p-8 border border-white/10 shadow-lg space-y-6">
              <h3 className="text-lg font-serif font-bold text-white tracking-tight">
                Official Channels
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#000000] border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-[#FF007F] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">General Inquiries</div>
                    <a
                      href={`mailto:${EVENT_DETAILS.contactEmail}`}
                      className="text-xs sm:text-sm font-mono font-bold text-white hover:text-[#FF007F] transition-colors"
                    >
                      {EVENT_DETAILS.contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#000000] border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-[#FF007F] flex items-center justify-center shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Builder Support</div>
                    <a
                      href={`mailto:${EVENT_DETAILS.supportEmail}`}
                      className="text-xs sm:text-sm font-mono font-bold text-white hover:text-[#FF007F] transition-colors"
                    >
                      {EVENT_DETAILS.supportEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#000000] border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Response SLA</div>
                    <div className="text-xs sm:text-sm font-mono text-neutral-300">
                      Within 24–48 hours guaranteed
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 text-xs font-mono text-neutral-400 leading-relaxed">
                Registered hackers receive dedicated Discord/Slack channel coordinates upon account verification.
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-[#09090b]/90 rounded-3xl p-8 sm:p-10 border border-white/10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF007F] to-transparent opacity-80" />

            <h3 className="text-xl font-serif font-bold text-white mb-2">
              Send an Inquiry
            </h3>
            <p className="text-xs text-neutral-400 mb-6 font-sans">
              Complete the dispatch form below and the coordination committee will respond swiftly.
            </p>

            {serverError && (
              <div className="mb-6">
                <Alert
                  type="error"
                  title="Submission Error"
                  message={serverError}
                  onClose={() => setServerError(null)}
                />
              </div>
            )}

            {isSubmitted && (
              <div className="mb-6">
                <Alert
                  type="success"
                  title="Message Dispatched"
                  message="Thank you for reaching out. The WAMPIRE team has received your message and will respond shortly."
                  onClose={() => setIsSubmitted(false)}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  name="name"
                  placeholder="Alex Mercer"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                  leftIcon={<User className="w-4 h-4" />}
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="alex@domain.dev"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                  leftIcon={<Mail className="w-4 h-4" />}
                />
              </div>

              {/* Subject selector */}
              <div className="w-full flex flex-col gap-1.5 text-left">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300">
                  Subject Category <span className="text-[#FF007F]">*</span>
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-neutral-950/90 text-white rounded-xl px-4 py-3 text-sm border border-white/10 hover:border-white/20 focus:border-[#FF007F] focus:ring-2 focus:ring-[#FF007F]/25 outline-none font-sans"
                >
                  <option value="general" className="bg-neutral-900 text-white">General Inquiry</option>
                  <option value="team" className="bg-neutral-900 text-white">Team Formation & Eligibility</option>
                  <option value="mentor" className="bg-neutral-900 text-white">Mentorship & Judging Opportunities</option>
                  <option value="partnership" className="bg-neutral-900 text-white">Sponsorship & Community Partners</option>
                  <option value="technical" className="bg-neutral-900 text-white">Portal Technical Support</option>
                </select>
              </div>

              {/* Message text area */}
              <div className="w-full flex flex-col gap-1.5 text-left">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300">
                  Message <span className="text-[#FF007F]">*</span>
                </label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Detail your question or requirement here..."
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full bg-neutral-950/90 text-white placeholder-neutral-500 rounded-xl px-4 py-3 text-sm transition-all duration-200 outline-none border resize-none font-sans ${
                    errors.message
                      ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                      : 'border-white/10 hover:border-white/20 focus:border-[#FF007F] focus:ring-2 focus:ring-[#FF007F]/25'
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-red-400 font-medium mt-0.5">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full text-xs font-mono uppercase tracking-wider font-bold"
                isLoading={isSubmitting}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Send Message
              </Button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ContactSection;
