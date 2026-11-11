import React, { useState } from 'react';
import { Rocket, Plus, Trash2, Check } from 'lucide-react';
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
    const numSize = Math.max(1, Math.min(5, parseInt(size, 10)));
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
        course: formData.course,
        branch: formData.branch,
        yearOfStudy: formData.yearOfStudy,
        domain: formData.domain,
        projectName: formData.projectName.trim(),
        pptLink: formData.pptLink.trim(),
        prototypeLink: formData.prototypeLink.trim(),
        demoVideoLink: formData.demoVideoLink.trim(),
        teamSize: formData.teamSize,
        teamMembers: formData.teamMembers.map((m) => ({
          name: m.name.trim(),
          email: m.email.trim().toLowerCase(),
          role: m.role || 'Developer',
        })),
      });

      toast.success('Your hackathon squad registration is confirmed!', 'Registration Complete');
      if (onRegistrationCompleted) onRegistrationCompleted(res.data?.registration || res.data);
      onClose();
    } catch (err) {
      const msg = err.message || 'Unable to submit hackathon registration.';
      setError(msg);
      toast.error(msg, 'Registration Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register Hackathon Squad" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert
            type="error"
            title="Registration Error"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {/* Lead Participant Info */}
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
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">Course</label>
            <input
              type="text"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full bg-white text-black rounded-xl px-3.5 py-2.5 text-sm border border-black/15 outline-none focus:border-[#FF007F] font-sans"
              required
            />
          </div>
          <div className="text-left space-y-1">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">Branch</label>
            <input
              type="text"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              className="w-full bg-white text-black rounded-xl px-3.5 py-2.5 text-sm border border-black/15 outline-none focus:border-[#FF007F] font-sans"
              required
            />
          </div>
          <div className="text-left space-y-1">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">Year</label>
            <select
              value={formData.yearOfStudy}
              onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
              className="w-full bg-white text-black rounded-xl px-3.5 py-2.5 text-sm border border-black/15 outline-none focus:border-[#FF007F] font-sans"
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
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
            Selected Hackathon Domain <span className="text-[#FF007F]">*</span>
          </label>
          <select
            value={formData.domain}
            onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
            className="w-full bg-white text-black rounded-xl px-3.5 py-2.5 text-sm border border-black/15 outline-none focus:border-[#FF007F] font-sans"
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
            placeholder="https://drive.google.com/..."
            value={formData.pptLink}
            onChange={(e) => setFormData({ ...formData, pptLink: e.target.value })}
            required
          />
          <Input
            label="Prototype / Repo Link"
            type="url"
            placeholder="https://github.com/..."
            value={formData.prototypeLink}
            onChange={(e) => setFormData({ ...formData, prototypeLink: e.target.value })}
            required
          />
          <Input
            label="Demo Video Link"
            type="url"
            placeholder="https://youtube.com/..."
            value={formData.demoVideoLink}
            onChange={(e) => setFormData({ ...formData, demoVideoLink: e.target.value })}
          />
        </div>

        {/* Team Size Selector (1 to 5) */}
        <div className="text-left space-y-2 pt-2 border-t border-black/10">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
            Team Squad Size (1-5 Builders)
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleTeamSizeChange(size)}
                className={`py-2 rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer ${
                  formData.teamSize === size
                    ? 'bg-[#FF007F] text-white border-[#FF007F] shadow-glow-pink-sm'
                    : 'bg-white text-neutral-700 border-black/15 hover:border-black/30'
                }`}
              >
                {size} {size === 1 ? 'Solo' : 'Squad'}
              </button>
            ))}
          </div>
        </div>

        {/* Team Members Inputs */}
        {formData.teamSize > 1 && (
          <div className="space-y-3 pt-2 text-left">
            <p className="text-xs font-mono font-bold text-neutral-700 uppercase tracking-wider">
              Squad Member Information ({formData.teamMembers.length} additional members)
            </p>

            {formData.teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-neutral-50 border border-black/10 space-y-2"
              >
                <div className="text-xs font-mono font-bold text-[#FF007F]">Builder #{idx + 2}</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={member.name}
                    onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                    required
                    className="w-full bg-white text-black rounded-xl px-3 py-2 text-xs border border-black/15 outline-none focus:border-[#FF007F] font-sans"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={member.email}
                    onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                    required
                    className="w-full bg-white text-black rounded-xl px-3 py-2 text-xs border border-black/15 outline-none focus:border-[#FF007F] font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g. ML Eng)"
                    value={member.role}
                    onChange={(e) => handleMemberChange(idx, 'role', e.target.value)}
                    className="w-full bg-white text-black rounded-xl px-3 py-2 text-xs border border-black/15 outline-none focus:border-[#FF007F] font-sans"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit Actions */}
        <div className="pt-4 flex justify-end gap-3 border-t border-black/10 font-mono">
          <Button variant="ghost" size="md" type="button" onClick={onClose} className="text-xs text-neutral-700 hover:text-black">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<Rocket className="w-4 h-4" />}
            className="text-xs uppercase tracking-wider font-bold shadow-glow-pink"
          >
            Confirm Registration
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RegistrationModal;
