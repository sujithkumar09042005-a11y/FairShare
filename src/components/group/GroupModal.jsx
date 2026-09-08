import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal.jsx';
import MemberChip from './MemberChip.jsx';
import NeuButton from '../ui/NeuButton.jsx';
import { SUPPORTED_CURRENCIES } from '../../utils/currency.js';
import { Plus, Users } from 'lucide-react';

const PALETTE_COLORS = [
  '#6C63FF', '#38B2AC', '#8B84FF', '#4FD1C5',
  '#EC4899', '#F59E0B', '#10B981', '#6366F1',
];

export default function GroupModal({ isOpen, onClose, onSave, editingGroup = null }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [members, setMembers] = useState([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingGroup) {
      setName(editingGroup.name || '');
      setDescription(editingGroup.description || '');
      setCurrency(editingGroup.currency || 'INR');
      setMembers(editingGroup.members || []);
    } else {
      setName('');
      setDescription('');
      setCurrency('INR');
      setMembers([
        { id: `mem-${crypto.randomUUID()}`, name: 'You', avatarColor: '#6C63FF' },
      ]);
    }
    setError('');
    setNewMemberName('');
  }, [editingGroup, isOpen]);

  const handleAddMember = (e) => {
    e?.preventDefault();
    const trimmed = newMemberName.trim();
    if (!trimmed) return;

    if (members.some((m) => m.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('A member with this name already exists in the group.');
      return;
    }

    const randomColor =
      PALETTE_COLORS[members.length % PALETTE_COLORS.length];

    setMembers([
      ...members,
      {
        id: `mem-${crypto.randomUUID()}`,
        name: trimmed,
        avatarColor: randomColor,
      },
    ]);
    setNewMemberName('');
    setError('');
  };

  const handleRemoveMember = (memberId) => {
    if (members.length <= 1) {
      setError('A group must have at least one member.');
      return;
    }
    setMembers(members.filter((m) => m.id !== memberId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a group name.');
      return;
    }
    if (members.length < 2) {
      setError('Please add at least 2 members to split expenses.');
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      currency,
      members,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingGroup ? 'Edit Group' : 'Create New Group'}
      subtitle="Groups keep track of shared expenses, balances, and trips"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 text-xs font-semibold rounded-2xl bg-[#E0E5EC] shadow-neu-inset-sm text-[#EF4444]">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5 ml-1">
            Group Name *
          </label>
          <div className="neu-input px-3.5 py-2.5 flex items-center">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Group name (e.g. Trip, Household, Project)"
              className="w-full bg-transparent text-sm text-[#3D4852] placeholder-[#9CA3AF] border-none outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5 ml-1">
              Currency
            </label>
            <div className="neu-input px-3 py-2.5 flex items-center">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-[#3D4852] border-none outline-none cursor-pointer"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#E0E5EC] text-[#3D4852]">
                    {c.symbol} {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5 ml-1">
              Description (Optional)
            </label>
            <div className="neu-input px-3.5 py-2.5 flex items-center">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Goa trip with friends"
                className="w-full bg-transparent text-sm text-[#3D4852] placeholder-[#9CA3AF] border-none outline-none"
              />
            </div>
          </div>
        </div>

        {/* Group Members Section */}
        <div className="pt-2 border-t border-black/5">
          <div className="flex items-center justify-between mb-2 ml-1">
            <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#6C63FF]" />
              Members ({members.length})
            </label>
            <span className="text-[11px] text-[#6B7280]">At least 2 required</span>
          </div>

          {/* Member chips */}
          <div className="flex flex-wrap gap-2 mb-3 min-h-[44px] p-2.5 rounded-2xl bg-[#E0E5EC] shadow-neu-inset-sm">
            {members.map((m) => (
              <MemberChip
                key={m.id}
                member={m}
                size="sm"
                onRemove={() => handleRemoveMember(m.id)}
              />
            ))}
          </div>

          {/* Add member input */}
          <div className="flex gap-2">
            <div className="flex-1 neu-input px-3.5 py-2 flex items-center">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMember();
                  }
                }}
                placeholder="Add member name..."
                className="w-full bg-transparent text-sm text-[#3D4852] placeholder-[#9CA3AF] border-none outline-none"
              />
            </div>
            <NeuButton
              type="button"
              variant="primary"
              size="sm"
              onClick={handleAddMember}
              icon={Plus}
            >
              Add
            </NeuButton>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/5">
          <NeuButton
            type="button"
            variant="neutral"
            size="md"
            onClick={onClose}
          >
            Cancel
          </NeuButton>
          <NeuButton
            type="submit"
            variant="primary"
            size="md"
          >
            {editingGroup ? 'Save Changes' : 'Create Group'}
          </NeuButton>
        </div>
      </form>
    </Modal>
  );
}
