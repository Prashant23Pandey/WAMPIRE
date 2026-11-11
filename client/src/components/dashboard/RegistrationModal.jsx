import React, { useState } from 'react';
import { Rocket, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import Alert from '../common/Alert.jsx';
import hackathonService from '../../services/hackathonService.js';
import { useToast } from '../../hooks/useToast.js';

const DOMAINS = [
  'Artificial Intelligence & Machine Learning',
  'Web3, Blockchain & Decentralized Systems',
  'Cloud Architecture, DevOps & Infrastructure',
  'FinTech, Open Banking & Digital Payments',
  'CleanTech, Sustainability & Smart Cities',
  'Cybersecurity, Privacy & Threat Defense',
  'Open Innovation & Real-World Problem Solving',
];

export const RegistrationModal = ({ isOpen, onClose, user, onRegistrationCompleted }) => {
  const toast = useToast();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    mobileNumber: '',
    collegeName: '',
    course: 'B.Tech',
    branch: 'Computer Science',
    yearOfStudy: '3rd Year',
    domain: DOMAINS[0],
    projectName: '',
    pptLink: '',
    prototypeLink: '',
    demoVideoLink: '',
    teamSize: 1,
    teamMembers: [],
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTeamSizeChange = (size) => {
    const numSize = parseInt(size, 10);
    const requiredMembers = numSize - 1;
    const current = [...formData.teamMembers];

    if (current.length < requiredMembers) {
      for (let i = current.length; i < requiredMembers; i++) {
        current.push({ name: '', email: '', role: 'Developer' });
      }
    } else if (current.length > requiredMembers) {
      current.splice(requiredMembers);
    }

    setFormData((prev) => ({
      ...prev,
      teamSize: numSize,
      teamMembers: current,
    }));
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...formData.teamMembers];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, teamMembers: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.mobileNumber.trim() ||
      !formData.collegeName.trim() ||
      !formData.projectName.trim()
    ) {
      setError('Please fill in all mandatory registration fields.');
      return;
    }

    // Validate squad members
    if (formData.teamSize > 1) {
      for (let i = 0; i < formData.teamMembers.length; i++) {
        const m = formData.teamMembers[i];
        if (!m.name.trim() || !m.email.trim()) {
          setError(`Please provide Name and Email for Team Member #${i + 2}.`);
          return;
        }
      }
    }

    setIsSubmitting(true);

    try {
      const res = await hackathonService.register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        mobileNumber: formData.mobileNumber.trim(),
        collegeName: formData.collegeName.trim(),
        course: formData.course.trim(),
        branch: formData.branch.trim(),
        yearOfStudy: formData.yearOfStudy,
        domain: formData.domain,
        projectName: formData.projectName.trim(),
        pptLink: formData.pptLink.trim(),
        prototypeLink: formData.prototypeLink.trim(),
        demoVideoLink: formData.demoVideoLink.trim(),
        teamSize: formData.teamSize,
        teamMembers: formData.teamMembers,
      });

      if (res.data?.registration) {
        toast.success(
          'Your hackathon squad registration is confirmed!',
          'Registration Submitted'
        );
        if (onRegistrationCompleted) {
          onRegistrationCompleted(res.data.registration);
        }
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit registration. Please check inputs and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hackathon Registration Portal" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {error && (
          <Alert
            type="error"
            title="Registration Notice"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {/* Lead Participant Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Lead Participant Name"
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            disabled
            required
            helperText="Authenticated account email"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Mobile Number"
            type="tel"
            placeholder="+91 9876543210"
            value={formData.mobileNumber}
            onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
            required
          />
          <Input
            label="College / Institute Name"
            type="text"
            placeholder="Institute of Engineering & Tech"
            value={formData.collegeName}
            onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
            required
          />
        </div>

        {/* Academic Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="text-left space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Course</label>
            <input
              type="text"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full bg-white text-slate-900 rounded-xl px-3.5 py-2.5 text-sm border border-slate-200"
              required
            />
          </div>
          <div className="text-left space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Branch</label>
            <input
              type="text"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              className="w-full bg-white text-slate-900 rounded-xl px-3.5 py-2.5 text-sm border border-slate-200"
              required
            />
          </div>
          <div className="text-left space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Year</label>
            <select
              value={formData.yearOfStudy}
              onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
              className="w-full bg-white text-slate-900 rounded-xl px-3.5 py-2.5 text-sm border border-slate-200"
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
          </div>
        </div>

        {/* Domain Track Selection */}
        <div className="text-left space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Selected Hackathon Domain <span className="text-blue-600">*</span>
          </label>
          <select
            value={formData.domain}
            onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
            className="w-full bg-white text-slate-900 rounded-xl px-3.5 py-2.5 text-sm border border-slate-200"
          >
            {DOMAINS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Project Name */}
        <Input
          label="Project Name"
          type="text"
          placeholder="e.g. NeuroShield: Autonomous Threat Defense"
          value={formData.projectName}
          onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
          required
        />

        {/* Deliverable Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="PPT / Pitch Link"
            type="url"
            placeholder="https://slides..."
            value={formData.pptLink}
            onChange={(e) => setFormData({ ...formData, pptLink: e.target.value })}
          />
          <Input
            label="Prototype / Repo Link"
            type="url"
            placeholder="https://github..."
            value={formData.prototypeLink}
            onChange={(e) => setFormData({ ...formData, prototypeLink: e.target.value })}
          />
          <Input
            label="Demo Video Link"
            type="url"
            placeholder="https://youtube..."
            value={formData.demoVideoLink}
            onChange={(e) => setFormData({ ...formData, demoVideoLink: e.target.value })}
          />
        </div>

        {/* Team Size Selector */}
        <div className="text-left space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Team Squad Size
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleTeamSizeChange(size)}
                className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  formData.teamSize === size
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {size} {size === 1 ? 'Solo' : 'Hackers'}
              </button>
            ))}
          </div>
        </div>

        {/* Team Members Inputs */}
        {formData.teamSize > 1 && (
          <div className="space-y-3 pt-2 text-left">
            <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Squad Member Information ({formData.teamMembers.length} additional members)
            </p>

            {formData.teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
              >
                <div className="text-xs font-bold text-blue-600">Member #{idx + 2}</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={member.name}
                    onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                    required
                    className="w-full bg-white text-slate-900 rounded-xl px-3 py-2 text-xs border border-slate-200"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={member.email}
                    onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                    required
                    className="w-full bg-white text-slate-900 rounded-xl px-3 py-2 text-xs border border-slate-200"
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g. ML Eng)"
                    value={member.role}
                    onChange={(e) => handleMemberChange(idx, 'role', e.target.value)}
                    className="w-full bg-white text-slate-900 rounded-xl px-3 py-2 text-xs border border-slate-200"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit Actions */}
        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <Button variant="ghost" size="md" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<Rocket className="w-4 h-4" />}
          >
            Confirm Registration
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RegistrationModal;

