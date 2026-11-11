import React, { useState } from 'react';
import { User, X, Check, Save } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import Alert from '../common/Alert.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';

export const EditProfileModal = ({ isOpen, onClose, onProfileUpdated }) => {
  const { user, updateProfile } = useAuth();
  const toast = useToast();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmed = fullName.trim();
    if (!trimmed || trimmed.length < 3) {
      setError('Full name must be at least 3 characters long.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateProfile({ fullName: trimmed });
      if (res.success) {
        toast.success('Your profile information was updated successfully.', 'Profile Saved');
        if (onProfileUpdated) onProfileUpdated(res.user);
        onClose();
      } else {
        setError(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError(err.message || 'Network error updating profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Participant Profile" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert
            type="error"
            title="Profile Update Error"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        <Input
          label="Full Name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ada Lovelace"
          required
          leftIcon={<User className="w-4 h-4" />}
          helperText="Display name on hackathon participant badges"
        />

        <div className="text-left space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Email Address
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full bg-slate-100 text-slate-500 rounded-xl px-4 py-2.5 text-sm border border-slate-200 cursor-not-allowed"
          />
          <p className="text-[11px] text-slate-400">
            Account email is verified and cannot be changed directly.
          </p>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <Button variant="ghost" size="md" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;

