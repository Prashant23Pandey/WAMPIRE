import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Clock, HelpCircle, User } from 'lucide-react';
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

  const [serverError, setServerError] = useState(null);

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
    <section id="contact" className="py-20 lg:py-28 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <Badge variant="primary" size="md">
            Contact
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Connect With The Organizers
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Whether you have inquiries regarding team formation, logistics, or partnership opportunities, we are here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact Details & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-soft-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Official Channels
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">General Enquiries</div>
                    <a
                      href={`mailto:${EVENT_DETAILS.contactEmail}`}
                      className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      {EVENT_DETAILS.contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hacker Support</div>
                    <a
                      href={`mailto:${EVENT_DETAILS.supportEmail}`}
                      className="text-sm font-bold text-slate-900 hover:text-violet-600 transition-colors"
                    >
                      {EVENT_DETAILS.supportEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Response Window</div>
                    <div className="text-sm font-bold text-slate-800">
                      Typically within 24–48 working hours
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
                Registered hackers receive dedicated Discord/Slack channel coordinates upon account verification.
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-soft-sm">
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
              Send an Inquiry
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Complete the form below and the coordination committee will review your query.
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
                  message="Thank you for reaching out. The CODE-A-NOVA team has received your message and will respond shortly."
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
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Subject Category <span className="text-blue-600">*</span>
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-white text-slate-900 rounded-xl px-4 py-3 text-sm border border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none shadow-soft-sm"
                >
                  <option value="general">General Inquiry</option>
                  <option value="team">Team Formation & Eligibility</option>
                  <option value="mentor">Mentorship & Judging Opportunities</option>
                  <option value="partnership">Sponsorship & Community Partners</option>
                  <option value="technical">Portal Technical Support</option>
                </select>
              </div>

              {/* Message text area */}
              <div className="w-full flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Message <span className="text-blue-600">*</span>
                </label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Detail your question or requirement here..."
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full bg-white text-slate-900 placeholder-slate-400 rounded-xl px-4 py-3 text-sm transition-all duration-200 outline-none border shadow-soft-sm resize-none ${
                    errors.message
                      ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                      : 'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50'
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-red-600 font-medium mt-0.5">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
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

