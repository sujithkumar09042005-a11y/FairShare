import React, { useState, useEffect } from 'react';
import { AnimatedTopDock } from '../../shaders/animated-top-dock/AnimatedTopDock';
import { useGroups } from '../../context/GroupsContext.jsx';
import {
  ChevronDown,
  FolderPlus,
  Edit,
  Trash2,
  Users,
  Settings,
  Menu,
  X,
  Plus,
  Scale,
  Receipt,
  Plane,
  HandCoins,
} from 'lucide-react';
import LogoIcon from '../ui/LogoIcon.jsx';

const FAIRSHARE_DOCK_ITEMS = [
  {
    id: 'equal',
    label: 'Equal',
    icon: (
      <>
        <line x1="3" y1="6" x2="13" y2="6" stroke="currentColor" strokeWidth="1.8" />
        <line x1="3" y1="10" x2="13" y2="10" stroke="currentColor" strokeWidth="1.8" />
      </>
    ),
  },
  {
    id: 'items',
    label: 'Items',
    icon: (
      <>
        <path d="M3.4 2.4h5.4l3.8 3.8v7.4H3.4z" />
        <path d="M8.8 2.4v3.8h3.8M5.9 9h4.2M5.9 11.2h3" />
      </>
    ),
  },
  {
    id: 'trip',
    label: 'Trip',
    icon: (
      <>
        <circle cx="8" cy="8" r="5.9" />
        <path d="M2.4 8h11.2M8 2.4a9.6 9.6 0 0 1 0 11.2M8 2.4a9.6 9.6 0 0 0 0 11.2" />
      </>
    ),
  },
  {
    id: 'workspace',
    label: 'Crew',
    icon: (
      <>
        <path d="M8 1.9 14.1 5v6L8 14.1 1.9 11V5z" />
        <path d="M1.9 5 8 8.1 14.1 5M8 8.1v6" />
      </>
    ),
  },
];

export default function Navbar({
  currentView = 'wheel',
  onSwitchView,
  onOpenNewGroup,
  onOpenEditGroup,
  onDeleteGroup,
  onOpenAddExpense,
  onOpenSettings,
  isHidden = false,
}) {
  const { groups, activeGroup, setActiveGroupId, deleteGroup } = useGroups();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDeleteGroup = (group) => {
    if (!group) return;
    setDropdownOpen(false);
    if (onDeleteGroup) {
      onDeleteGroup(group);
    } else {
      deleteGroup(group.id);
    }
  };

  if (isHidden) return null;

  const renderGroupDropdown = () => (
    <>
      <div
        className="fixed inset-0 z-30 bg-slate-950/25 backdrop-blur-2xs"
        onClick={() => setDropdownOpen(false)}
      />
      <div className="absolute right-0 top-full mt-2.5 w-72 max-w-[calc(100vw-1.5rem)] glass-dropdown text-slate-900 rounded-2xl p-3 z-[110] shadow-[0_24px_60px_-10px_rgba(0,82,255,0.2),0_12px_28px_rgba(0,0,0,0.12)] border border-white/90 animate-in fade-in zoom-in-95">
        <span className="text-[10px] uppercase font-mono text-slate-400 px-2 py-1 block tracking-wider">
          YOUR CREW GROUPS ({groups.length})
        </span>

        <div className="space-y-1 max-h-48 overflow-y-auto pr-1 my-2">
          {groups.map((grp) => {
            const isActive = grp.id === activeGroup?.id;
            return (
              <div
                key={grp.id}
                className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-sans font-medium flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-[#0052FF] text-white font-semibold shadow-sm'
                    : 'text-slate-700 hover:bg-blue-50/70 hover:text-blue-600'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveGroupId(grp.id);
                    setDropdownOpen(false);
                    setMobileMenuOpen(false);
                    if (onSwitchView) onSwitchView('workspace');
                  }}
                  className="flex-1 flex items-center justify-between min-w-0 pr-2 cursor-pointer text-left"
                >
                  <span className="truncate">{grp.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ml-1.5 flex-shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {grp.members?.length || 0}
                  </span>
                </button>

                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(false);
                      onOpenEditGroup(grp);
                    }}
                    className={`p-1 rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? 'text-white/80 hover:text-white hover:bg-white/20'
                        : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    title={`Edit ${grp.name}`}
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGroup(grp);
                    }}
                    className={`p-1 rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? 'text-white/80 hover:text-white hover:bg-rose-500/80'
                        : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                    title={`Delete ${grp.name}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-1">
          <button
            type="button"
            onClick={() => {
              setDropdownOpen(false);
              onOpenNewGroup();
            }}
            className="w-full px-3 py-1.5 rounded-xl text-xs font-medium text-blue-600 hover:bg-blue-50 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            Create New Group
          </button>

          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                onOpenEditGroup(activeGroup);
              }}
              className="flex-1 px-2.5 py-1.5 rounded-xl text-[11px] text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Edit className="w-3 h-3" />
              Edit Active Group
            </button>
            <button
              type="button"
              onClick={() => handleDeleteGroup(activeGroup)}
              className="px-2.5 py-1.5 rounded-xl text-[11px] text-rose-600 hover:bg-rose-50 flex items-center justify-center gap-1 transition-colors cursor-pointer"
              title="Delete Active Group"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <nav className="sticky top-0 z-[100] w-full pointer-events-none transition-all duration-300 py-2 sm:py-3.5">
      {/* DESKTOP NAVBAR (>= 1024px / lg:) */}
      <div className="hidden lg:flex max-w-[88rem] w-full mx-auto px-4 sm:px-8 relative items-center justify-center overflow-visible pointer-events-auto">
        {/* ThreeUI Command Bar Header (<AnimatedTopDock />) */}
        <AnimatedTopDock
          variant="modern"
          proximity={122}
          spring={0.19}
          damping={0.70}
          widthGrowth={17}
          heightGrowth={16}
          drop={3.5}
          brandName="FairShare"
          brandMark={<LogoIcon className="w-5 h-5 text-white" />}
          onBrandClick={() => onSwitchView && onSwitchView('wheel')}
          items={FAIRSHARE_DOCK_ITEMS}
          activeId={currentView}
          onItemSelect={(id) => onSwitchView && onSwitchView(id)}
          ghostSlot={
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="atd-modern__ghost flex items-center gap-1.5 px-3 rounded-full text-slate-700 hover:text-blue-600 transition-colors cursor-pointer text-xs font-mono font-medium"
                title="Active Workspace Group"
              >
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span className="max-w-[100px] sm:max-w-[120px] truncate">{activeGroup?.name || 'Workspace'}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && renderGroupDropdown()}
            </div>
          }
          ctaLabel="Add Expense"
          onCtaClick={onOpenAddExpense}
          hideStage={true}
          className={isScrolled ? 'is-scrolled' : ''}
        />

        {/* Settings Button (Top Right of Hero Header) */}
        <div className="flex items-center absolute right-4 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20">
          <button
            type="button"
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-slate-700 hover:text-slate-900 text-xs font-medium hover:border-blue-500/40 hover:bg-white transition-all backdrop-blur-md cursor-pointer group ${
              isScrolled
                ? 'bg-white/95 border border-white/95 shadow-md'
                : 'bg-white/80 border border-slate-200/90 shadow-xs'
            }`}
            title="Settings & Preferences"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-600 group-hover:rotate-45 transition-all" />
            <span className="hidden xs:inline">Settings</span>
          </button>
        </div>
      </div>

      {/* MOBILE & TABLET NAVBAR (< 1024px / < lg:) */}
      <div className="flex lg:hidden w-full max-w-full px-2.5 sm:px-4 pointer-events-auto justify-center">
        <div
          className={`flex w-full max-w-4xl h-[58px] sm:h-[62px] px-3.5 sm:px-5 items-center justify-between relative rounded-2xl transition-all duration-300 ${
            isScrolled
              ? 'bg-white/92 backdrop-blur-2xl border border-white/95 shadow-[0_12px_28px_rgba(0,82,255,0.08)]'
              : 'bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)]'
          }`}
        >
          {/* Brand (Home Button) */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onSwitchView && onSwitchView('wheel');
            }}
            className="flex items-center gap-2 cursor-pointer focus:outline-none group"
            title="FairShare • Return to Home"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform p-1">
              <LogoIcon className="w-5 h-3 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-slate-900 font-sans group-hover:text-blue-600 transition-colors">
              FairShare
            </span>
          </button>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-1.5 xs:gap-2">
            {/* Active Group Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/90 border border-slate-200 text-slate-700 hover:text-blue-600 text-xs font-mono font-medium shadow-xs cursor-pointer"
                title="Active Group"
              >
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span className="max-w-[70px] xs:max-w-[100px] truncate">{activeGroup?.name || 'Group'}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && renderGroupDropdown()}
            </div>

            {/* Settings Button */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="w-8 h-8 rounded-full bg-white/90 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all shadow-xs cursor-pointer"
              title="Settings"
              aria-label="Settings"
            >
              <Settings className="w-3.5 h-3.5 text-slate-600" />
            </button>

            {/* Menu Toggle Button */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setDropdownOpen(false);
              }}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all shadow-xs cursor-pointer ${
                mobileMenuOpen
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white/90 text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          {/* Collapsible Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <>
              {/* Dimmed backdrop to completely prevent background text bleed & tap to close */}
              <div
                className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-xs animate-in fade-in duration-200"
                onClick={() => setMobileMenuOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute top-[calc(100%+10px)] inset-x-0 bg-white/98 backdrop-blur-3xl border border-slate-200/90 shadow-[0_24px_60px_-10px_rgba(0,0,0,0.3)] rounded-2xl p-3.5 xs:p-4 space-y-3 animate-in slide-in-from-top-2 duration-200 z-50">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'equal', label: 'Equal Split', icon: Scale, desc: 'Split Evenly' },
                    { id: 'items', label: 'Items Split', icon: Receipt, desc: 'Itemized Receipt' },
                    { id: 'trip', label: 'Trip Split', icon: Plane, desc: 'Travel & Budget' },
                    { id: 'workspace', label: 'Workspace', icon: Users, desc: 'Ledger & Balances' },
                    { id: 'settle', label: 'Settle Up', icon: HandCoins, desc: 'Simplify Debts' },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onSwitchView && onSwitchView(item.id);
                        }}
                        className={`p-2.5 rounded-xl text-left transition-all flex items-start gap-2.5 cursor-pointer border ${
                          isActive
                            ? 'bg-[#0052FF] text-white border-[#0052FF] shadow-sm font-semibold'
                            : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-200/80 hover:border-blue-300 shadow-2xs'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive ? 'bg-white/20 text-white' : 'bg-white text-blue-600 border border-slate-200/60 shadow-2xs'
                        }`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate leading-tight">{item.label}</div>
                          <div className={`text-[10px] truncate leading-tight mt-0.5 ${isActive ? 'text-white/80' : 'text-slate-500'}`}>{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Quick CTA inside Mobile Menu */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAddExpense && onOpenAddExpense();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0052FF] hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Expense</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
