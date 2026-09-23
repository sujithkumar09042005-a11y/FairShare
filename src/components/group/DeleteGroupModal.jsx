import React from 'react';
import Modal from '../ui/Modal.jsx';
import NeuButton from '../ui/NeuButton.jsx';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function DeleteGroupModal({
  isOpen,
  onClose,
  group,
  onConfirm,
}) {
  if (!group) return null;

  const expensesCount = group.expenses?.length || 0;
  const membersCount = group.members?.length || 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Group"
      subtitle="This action cannot be undone"
      maxWidth="max-w-md"
    >
      <div className="space-y-5">
        <div className="p-4 rounded-2xl bg-rose-50/90 border border-rose-200/80 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0 text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-xs text-rose-950 space-y-1.5 flex-1 min-w-0">
            <p className="font-semibold text-sm text-rose-700 truncate">
              Delete &quot;{group.name}&quot;?
            </p>
            <p className="text-rose-600/90 leading-relaxed">
              Are you sure you want to delete this group? All{' '}
              <strong className="text-rose-700">{expensesCount} recorded expenses</strong>,{' '}
              <strong className="text-rose-700">{membersCount} members</strong>, and debt records will be permanently removed.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse xs:flex-row items-center justify-end gap-2.5 xs:gap-3 pt-3 border-t border-slate-200/80">
          <NeuButton
            type="button"
            variant="neutral"
            size="md"
            onClick={onClose}
            className="w-full xs:w-auto"
          >
            Cancel
          </NeuButton>
          <button
            type="button"
            onClick={() => {
              onConfirm(group.id);
              onClose();
            }}
            className="w-full xs:w-auto justify-center px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer hover:shadow-md"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Group
          </button>
        </div>
      </div>
    </Modal>
  );
}
