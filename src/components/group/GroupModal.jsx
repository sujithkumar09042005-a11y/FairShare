import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal.jsx';
import MemberChip from './MemberChip.jsx';
import NeuButton from '../ui/NeuButton.jsx';
import { SUPPORTED_CURRENCIES } from '../../utils/currency.js';
import { Plus, Users, Trash2 } from 'lucide-react';

const PALETTE_COLORS = [
  '#6C63FF', '#38B2AC', '#8B84FF', '#4FD1C5',
  '#EC4899', '#F59E0B', '#10B981', '#6366F1',
];

export default function GroupModal({ isOpen, onClose, onSave, onDelete, editingGroup = null }) {
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
          <div className="p-3 text-xs font-medium rounded-xl bg-red-50 text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">
            Group Name *
          </label>
          <div className="bg-[#F5F5F5] rounded-xl border border-black/[0.06] px-3.5 py-2.5 flex items-center focus-within:border-black/30 focus-within:bg-white transition-all">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Group name (e.g. Trip, Household, Project)"
              className="w-full bg-transparent text-sm text-black placeholder-gray-400 border-none outline-none font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">
              Currency
            </label>
            <div className="glass-select rounded-xl px-3 py-2.5 flex items-center">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-black border-none outline-none cursor-pointer"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-white text-black">
                    {c.symbol} {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">
              Description (Optional)
            </label>
            <div className="bg-[#F5F5F5] rounded-xl border border-black/[0.06] px-3.5 py-2.5 flex items-center focus-within:border-black/30 focus-within:bg-white transition-all">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Goa trip with friends"
                className="w-full bg-transparent text-sm text-black placeholder-gray-400 border-none outline-none font-medium"
              />
            </div>
          </div>
        </div>

        {/* Group Members Section */}
        <div className="pt-2 border-t border-black/5">
          <div className="flex items-center justify-between mb-2 ml-1">
            <label className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-black" />
              Members ({members.length})
            </label>
            <span className="text-[11px] text-gray-400">At least 2 required</span>
          </div>

          {/* Member chips */}
          <div className="flex flex-wrap gap-2 mb-3 min-h-[44px] p-2.5 rounded-xl bg-[#F5F5F5] border border-black/[0.06]">
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
            <div className="flex-1 bg-[#F5F5F5] rounded-xl border border-black/[0.06] px-3.5 py-2 flex items-center focus-within:border-black/30 focus-within:bg-white transition-all">
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
                className="w-full bg-transparent text-sm text-black placeholder-gray-400 border-none outline-none font-medium"
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
        <div className="flex flex-col-reverse xs:flex-row xs:items-center justify-between pt-3 border-t border-black/5 gap-2.5 xs:gap-3">
          <div>
            {editingGroup && onDelete && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(editingGroup);
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Group
              </button>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 xs:gap-3 w-full xs:w-auto">
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
              arrowBadge={true}
            >
              {editingGroup ? 'Save Changes' : 'Create Group'}
            </NeuButton>
          </div>
        </div>
      </form>
    </Modal>
  );
}
