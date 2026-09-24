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
        <div className="p-3.5 xs:p-4 rounded-2xl bg-blue-50/60 border border-blue-200/60 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0052FF] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-900 block">
              Minimalist Modern Design System
            </span>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
              Curated <code className="font-mono text-[#0052FF] font-semibold">#0052FF</code> electric blue, obsidian glass surfaces, and Calistoga &amp; Inter typography.
            </p>
          </div>
        </div>

        {/* PDF & Export Section */}
        <div className="pt-2 border-t border-slate-200/80">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 ml-1 font-mono">
            Reports & Backup
          </label>
          <div className="space-y-2.5">
            {/* Download PDF for Active Group */}
            <button
              type="button"
              onClick={handleExportPDF}
              className="w-full p-3 xs:p-3.5 rounded-xl bg-white/90 hover:bg-white border border-slate-200/80 hover:border-blue-400 shadow-2xs hover:shadow-xs flex items-center justify-between text-xs text-slate-900 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileDown className="w-3.5 h-3.5" />
                </div>
                <div className="text-left min-w-0">
                  <span className="font-semibold block truncate">Download Trip Summary PDF</span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    Formatted statement for "{activeGroup?.name}"
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#0052FF] shrink-0 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/50">Download</span>
            </button>

            {/* Export JSON */}
            <button
              type="button"
              onClick={handleExportJSON}
              className="w-full p-3 xs:p-3.5 rounded-xl bg-white/90 hover:bg-white border border-slate-200/80 hover:border-blue-400 shadow-2xs hover:shadow-xs flex items-center justify-between text-xs text-slate-900 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Download className="w-3.5 h-3.5" />
                </div>
                <div className="text-left min-w-0">
                  <span className="font-semibold block truncate">Export Full JSON Backup</span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    Backup all {groups.length} groups, expenses, and settlements
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#0052FF] shrink-0 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/50">Export</span>
            </button>

            {/* Import JSON */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3 xs:p-3.5 rounded-xl bg-white/90 hover:bg-white border border-slate-200/80 hover:border-blue-400 shadow-2xs hover:shadow-xs flex items-center justify-between text-xs text-slate-900 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileUp className="w-3.5 h-3.5" />
                </div>
                <div className="text-left min-w-0">
                  <span className="font-semibold block truncate">Import JSON Data</span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    Restore groups and transactions from a backup
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#0052FF] shrink-0 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/50">Upload</span>
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
        <div className="pt-3 border-t border-slate-200/80 flex flex-col xs:flex-row xs:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-slate-900 block">
              Reset Workspace Data
            </span>
            <span className="text-[10px] text-slate-500">
              Reset to clean workspace with default demo data
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
