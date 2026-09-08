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
    exportDataAsJSON(groups, `splitwise-all-groups-${Date.now()}.json`);
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
      subtitle="Neumorphism design system, export PDF summaries, backup & restore"
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        {message && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
              message.type === 'success'
                ? 'bg-[#E0E5EC] shadow-neu-inset-sm text-[#10B981]'
                : 'bg-[#E0E5EC] shadow-neu-inset-sm text-[#EF4444]'
            }`}
          >
            {message.type === 'success' ? (
              <Check className="w-4 h-4 text-[#10B981]" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Active Design System Information */}
        <div className="p-4 rounded-2xl bg-[#E0E5EC] shadow-neu-inset-sm flex items-start gap-3">
          <NeuIconWell icon={Palette} size="md" color="violet" />
          <div>
            <span className="text-xs font-bold text-[#3D4852] block">
              Neumorphism (Soft UI) Active
            </span>
            <p className="text-[11px] text-[#6B7280] mt-0.5 leading-relaxed">
              Monochromatic cool-grey surface (<code className="font-mono text-[#6C63FF]">#E0E5EC</code>), dual opposing shadows for tactile elevation, and zero hard borders.
            </p>
          </div>
        </div>

        {/* PDF & Export Section */}
        <div className="pt-2 border-t border-black/5">
          <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2.5 ml-1">
            Reports & Backup
          </label>
          <div className="space-y-2.5">
            {/* Download PDF for Active Group */}
            <button
              type="button"
              onClick={handleExportPDF}
              className="w-full p-3.5 rounded-2xl bg-[#E0E5EC] shadow-neu-extruded-sm hover:shadow-neu-extruded flex items-center justify-between text-xs text-[#3D4852] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileDown className="w-4 h-4 text-[#6C63FF]" />
                <div className="text-left">
                  <span className="font-semibold block">Download Trip Summary PDF</span>
                  <span className="text-[10px] text-[#6B7280]">
                    Formatted statement for "{activeGroup?.name}"
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#6C63FF]">Download</span>
            </button>

            {/* Export JSON */}
            <button
              type="button"
              onClick={handleExportJSON}
              className="w-full p-3.5 rounded-2xl bg-[#E0E5EC] shadow-neu-extruded-sm hover:shadow-neu-extruded flex items-center justify-between text-xs text-[#3D4852] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Download className="w-4 h-4 text-[#38B2AC]" />
                <div className="text-left">
                  <span className="font-semibold block">Export Full JSON Backup</span>
                  <span className="text-[10px] text-[#6B7280]">
                    Backup all {groups.length} groups, expenses, and settlements
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#38B2AC]">Export</span>
            </button>

            {/* Import JSON */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3.5 rounded-2xl bg-[#E0E5EC] shadow-neu-extruded-sm hover:shadow-neu-extruded flex items-center justify-between text-xs text-[#3D4852] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileUp className="w-4 h-4 text-[#8B84FF]" />
                <div className="text-left">
                  <span className="font-semibold block">Import JSON Data</span>
                  <span className="text-[10px] text-[#6B7280]">
                    Restore groups and transactions from a previous backup
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#8B84FF]">Upload</span>
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
        <div className="pt-3 border-t border-black/5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#3D4852] block">
              Reset Workspace Data
            </span>
            <span className="text-[10px] text-[#6B7280]">
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
