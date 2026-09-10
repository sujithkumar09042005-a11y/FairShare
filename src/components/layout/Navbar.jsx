import React, { useState } from 'react';
import { useGroups } from '../../context/GroupsContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import {
  Plus,
  Settings,
  ChevronDown,
  FolderPlus,
  Edit,
  Trash2,
  Disc3,
  ArrowLeft,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';

const SERVICE_TITLES = {
  wheel: 'Services Wheel',
  landing: 'Services Wheel',
  equal: 'Equal Split',
  items: 'Items Split',
  trip: 'Trip Split',
  workspace: 'Trip Workspace',
};

export default function Navbar({
  currentView = 'wheel',
  onSwitchView,
  onOpenNewGroup,
  onOpenEditGroup,
  onOpenAddExpense,
  onOpenSettings,
}) {
  const { groups, activeGroup, setActiveGroupId, deleteGroup } = useGroups();
  const { isDark, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDeleteCurrentGroup = () => {
    if (!activeGroup) return;
    if (groups.length <= 1) {
      alert('You must have at least one active group.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${activeGroup.name}"?`)) {
      deleteGroup(activeGroup.id);
      setDropdownOpen(false);
    }
  };

  const isAtWheel = currentView === 'wheel' || currentView === 'landing';

  return (
    <header className="sticky top-0 z-40 w-full px-2 xs:px-3 sm:px-8 py-2 sm:py-3.5">
      <div className="max-w-7xl mx-auto bg-[#E0E5EC] rounded-[20px] sm:rounded-[24px] px-2.5 xs:px-3.5 sm:px-6 py-1.5 sm:py-2.5 flex items-center justify-between shadow-neu-extruded gap-1 xs:gap-2">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Main Brand Button: when at wheel, always visible; when in service, visible on sm+ screens */}
          <button
            type="button"
            onClick={() => onSwitchView && onSwitchView('wheel')}
            className={`items-center gap-2 sm:gap-2.5 text-left group cursor-pointer ${
              !isAtWheel ? 'hidden sm:flex' : 'flex'
            }`}
          >
            <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#E0E5EC] shadow-neu-extruded-sm flex items-center justify-center p-1 group-hover:shadow-neu-extruded transition-all overflow-hidden flex-shrink-0">
              <img
                src="/app-icon.png"
                alt="SplitWise Logo"
                className="w-full h-full object-contain rounded-full select-none"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-extrabold font-display tracking-tight text-[#3D4852] flex items-center gap-1.5 leading-none">
                SplitWise
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E0E5EC] text-[#6C63FF] shadow-neu-inset-sm font-sans">
                  SOFT UI
                </span>
              </h1>
              <p className="text-[11px] text-[#6B7280] mt-0.5 font-sans">
                Neumorphic Expense Splitter
              </p>
            </div>
          </button>

          {/* Navigation Controls: Back to Wheel OR Dial Status */}
          {!isAtWheel ? (
            <>
              {/* Mobile (<sm) Compact Back-to-Wheel Button with brand token */}
              <button
                type="button"
                onClick={() => onSwitchView && onSwitchView('wheel')}
                className="sm:hidden inline-flex items-center gap-1.5 px-2 xs:px-2.5 py-1.5 rounded-xl bg-[#E0E5EC] shadow-neu-extruded-sm hover:shadow-neu-extruded active:shadow-neu-pressed transition-all cursor-pointer flex-shrink-0"
                title="Return to 360° selection wheel"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#6C63FF] flex-shrink-0" />
                <div className="w-5 h-5 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src="/app-icon.png"
                    alt="SplitWise"
                    className="w-full h-full object-contain rounded-full select-none"
                  />
                </div>
                <span className="hidden xs:inline text-xs font-bold text-[#3D4852]">Wheel</span>
              </button>

              {/* Tablet/Desktop (sm+) Back-to-Wheel Button */}
              <button
                type="button"
                onClick={() => onSwitchView && onSwitchView('wheel')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-[#E0E5EC] shadow-neu-extruded-sm hover:shadow-neu-extruded active:shadow-neu-pressed text-xs font-bold text-[#3D4852] transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
                title="Return to the 360° selection wheel"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#6C63FF]" />
                <span className="hidden md:inline">Back to</span>
                <span>Wheel</span>
              </button>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E0E5EC] shadow-neu-inset-sm text-xs font-semibold text-[#6B7280]">
              <Disc3 className="w-3.5 h-3.5 text-[#6C63FF] animate-spin" style={{ animationDuration: '10s' }} />
              <span>360° Turntable Dial</span>
            </div>
          )}
        </div>

        {/* Center: Active View Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E0E5EC] shadow-neu-inset-sm text-xs font-medium">
          <span className="text-[#6B7280]">Active View:</span>
          <span className="text-[#6C63FF] font-bold">
            {SERVICE_TITLES[currentView] || 'Service'}
          </span>
        </div>

        {/* Right: Group Selector, Add Expense, Settings */}
        <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-3 flex-shrink-0">
          {/* Group Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 xs:gap-1.5 px-2 xs:px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#E0E5EC] shadow-neu-extruded-sm hover:shadow-neu-extruded active:shadow-neu-pressed text-[11px] xs:text-xs sm:text-sm font-semibold text-[#3D4852] transition-all max-w-[76px] xs:max-w-[110px] sm:max-w-[200px] cursor-pointer"
            >
              <span className="truncate">{activeGroup?.name || 'Workspace'}</span>
              <ChevronDown
                className={`w-3 h-3 xs:w-3.5 xs:h-3.5 text-[#6B7280] flex-shrink-0 transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-[#E0E5EC] rounded-2xl p-3 z-40 shadow-neu-extruded-lg animate-in fade-in zoom-in-95">
                  <span className="text-[10px] uppercase font-bold text-[#6B7280] px-2 py-1 block tracking-wider font-sans">
                    Your Groups ({groups.length})
                  </span>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 my-2">
                    {groups.map((grp) => {
                      const isActive = grp.id === activeGroup?.id;
                      return (
                        <button
                          key={grp.id}
                          type="button"
                          onClick={() => {
                            setActiveGroupId(grp.id);
                            if (onSwitchView) onSwitchView('workspace');
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#E0E5EC] text-[#6C63FF] font-bold shadow-neu-inset-sm'
                              : 'text-[#3D4852] hover:shadow-neu-extruded-sm'
                          }`}
                        >
                          <span className="truncate">{grp.name}</span>
                          <span className="text-[10px] text-[#6B7280] flex-shrink-0 ml-1">
                            {grp.members?.length} members
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-black/5 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenNewGroup();
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-[#6C63FF] hover:shadow-neu-extruded-sm active:shadow-neu-pressed flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      Create New Group
                    </button>

                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          onOpenEditGroup();
                        }}
                        className="flex-1 px-2.5 py-1.5 rounded-xl text-[11px] text-[#6B7280] hover:text-[#3D4852] hover:shadow-neu-extruded-sm flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <Edit className="w-3 h-3" />
                        Edit Current
                      </button>
                      {groups.length > 1 && (
                        <button
                          type="button"
                          onClick={handleDeleteCurrentGroup}
                          className="px-2.5 py-1.5 rounded-xl text-[11px] text-[#EF4444] hover:shadow-neu-extruded-sm flex items-center justify-center gap-1 transition-all cursor-pointer"
                          title="Delete Group"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Add Expense Button */}
          <button
            type="button"
            onClick={onOpenAddExpense}
            className="inline-flex items-center justify-center gap-1.5 px-2 xs:px-2.5 sm:px-3.5 py-1.5 rounded-xl neu-btn-primary text-xs font-semibold text-white shadow-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer flex-shrink-0"
            title="Add Expense"
          >
            <Plus className="w-3.5 h-3.5 text-white flex-shrink-0" />
            <span className="hidden sm:inline">Add Expense</span>
          </button>

          {/* Theme Toggle Button (Light / Dark) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-8 h-8 xs:w-8.5 xs:h-8.5 sm:w-9 sm:h-9 rounded-xl bg-[#E0E5EC] shadow-neu-extruded-sm hover:shadow-neu-extruded active:shadow-neu-pressed flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-[#F59E0B] transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-[#6C63FF] transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="w-8 h-8 xs:w-8.5 xs:h-8.5 sm:w-9 sm:h-9 rounded-xl bg-[#E0E5EC] text-[#6B7280] hover:text-[#3D4852] shadow-neu-extruded-sm hover:shadow-neu-extruded active:shadow-neu-pressed flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
            title="Settings & Data Management"
            aria-label="Settings & Data Management"
          >
            <Settings className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
