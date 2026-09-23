import React, { useState, useRef } from 'react';
import Modal from '../ui/Modal.jsx';
import NeuButton from '../ui/NeuButton.jsx';
import NeuIconWell from '../ui/NeuIconWell.jsx';
import { useGroups } from '../../context/GroupsContext.jsx';
import { exportGroupPDF } from '../../utils/pdfExport.js';
import { exportDataAsJSON, parseAndValidateImport } from '../../utils/exportImport.js';
import {
  FileDown,
  FileUp,
  Download,
  RotateCcw,
  AlertTriangle,
  Check,
  ShieldCheck,
  Palette,
} from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const { groups, activeGroup, resetToDemoData, importGroups } = useGroups();
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleExportPDF = () => {
    if (!activeGroup) return;
    exportGroupPDF(activeGroup);
    setMessage({ type: 'success', text: `Downloaded PDF summary for "${activeGroup.name}".` });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleExportJSON = () => {
    exportDataAsJSON(groups, `fairshare-all-groups-${Date.now()}.json`);
    setMessage({ type: 'success', text: 'Downloaded full JSON backup.' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      const res = parseAndValidateImport(content);
      if (res.success) {
        importGroups(res.data);
        setMessage({ type: 'success', text: `Successfully restored ${res.data.length} groups!` });
        setTimeout(() => setMessage(null), 3500);
      } else {
        setMessage({ type: 'error', text: res.error });
      }
    };
    reader.readAsText(file);
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset all data to a clean fresh workspace?')) {
      resetToDemoData();
      setMessage({ type: 'success', text: 'Workspace reset successfully!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings & Data Management"
      subtitle="Fintech design system, export PDF summaries, backup & restore"
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        {message && (
          <div
            className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2.5 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Active Design System Information */}
        <div className="p-4 rounded-xl bg-[#F5F5F5] border border-black/[0.06] flex items-start gap-3">
          <NeuIconWell icon={Palette} size="md" color="default" />
          <div>
            <span className="text-xs font-semibold text-black block">
              Fintech Design System Active
            </span>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
              Architectural <code className="font-mono text-black font-semibold">#F5F5F5</code> canvas, TT Norms Pro typography, signature black pill buttons, hairline borders, and deep <code className="font-mono text-black font-semibold">#2B2644</code> accents.
            </p>
          </div>
        </div>

        {/* PDF & Export Section */}
        <div className="pt-2 border-t border-black/5">
          <label className="block text-xs font-medium text-gray-500 mb-2.5 ml-1">
            Reports & Backup
          </label>
          <div className="space-y-2.5">
            {/* Download PDF for Active Group */}
            <button
              type="button"
              onClick={handleExportPDF}
              className="w-full p-3.5 rounded-xl bg-white border border-black/[0.06] shadow-sm hover:border-black/20 flex items-center justify-between text-xs text-black transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileDown className="w-4 h-4 text-black" />
                <div className="text-left">
                  <span className="font-medium block">Download Trip Summary PDF</span>
                  <span className="text-[10px] text-gray-500">
                    Formatted statement for "{activeGroup?.name}"
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-black">Download</span>
            </button>

            {/* Export JSON */}
            <button
              type="button"
              onClick={handleExportJSON}
              className="w-full p-3.5 rounded-xl bg-white border border-black/[0.06] shadow-sm hover:border-black/20 flex items-center justify-between text-xs text-black transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Download className="w-4 h-4 text-black" />
                <div className="text-left">
                  <span className="font-medium block">Export Full JSON Backup</span>
                  <span className="text-[10px] text-gray-500">
                    Backup all {groups.length} groups, expenses, and settlements
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-black">Export</span>
            </button>

            {/* Import JSON */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3.5 rounded-xl bg-white border border-black/[0.06] shadow-sm hover:border-black/20 flex items-center justify-between text-xs text-black transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileUp className="w-4 h-4 text-black" />
                <div className="text-left">
                  <span className="font-medium block">Import JSON Data</span>
                  <span className="text-[10px] text-gray-500">
                    Restore groups and transactions from a previous backup
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-black">Upload</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json,application/json"
              className="hidden"
            />
          </div>
        </div>

        {/* Demo Data Reset */}
        <div className="pt-3 border-t border-black/5 flex flex-col xs:flex-row xs:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-medium text-black block">
              Reset Workspace Data
            </span>
            <span className="text-[10px] text-gray-500">
              Reset to clean workspace with zero expenses
            </span>
          </div>

          <NeuButton
            type="button"
            variant="neutral"
            size="sm"
            onClick={handleResetDemo}
            icon={RotateCcw}
          >
            Reset Data
          </NeuButton>
        </div>
      </div>
    </Modal>
  );
}
