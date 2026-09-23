import React, { useState } from 'react';
import CustomCursor from './components/ui/CustomCursor.jsx';
import AmbientBackground from './components/layout/AmbientBackground.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import LandingHero from './components/landing/LandingHero.jsx';
import EqualSplitService from './components/services/EqualSplitService.jsx';
import ItemsSplitService from './components/services/ItemsSplitService.jsx';
import TripSplitService from './components/services/TripSplitService.jsx';
import GroupHeader from './components/group/GroupHeader.jsx';
import ExpenseList from './components/expense/ExpenseList.jsx';
import ExpenseModal from './components/expense/ExpenseModal.jsx';
import GroupModal from './components/group/GroupModal.jsx';
import BalancesDashboard from './components/settle/BalancesDashboard.jsx';
import SettleUpView from './components/settle/SettleUpView.jsx';
import SettingsModal from './components/settings/SettingsModal.jsx';
import DeleteGroupModal from './components/group/DeleteGroupModal.jsx';
import { useGroups } from './context/GroupsContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

function MainContent() {
  const {
    groups,
    activeGroup,
    addGroup,
    updateGroup,
    deleteGroup,
    addExpense,
    updateExpense,
    deleteExpense,
    recordSettlement,
    deleteSettlement,
  } = useGroups();

  // Navigation views: 'wheel' (default landing), 'equal', 'items', 'trip', 'workspace'
  const [currentView, setCurrentView] = useState('wheel');
  const [activeTab, setActiveTab] = useState('expenses');

  // Modal states
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupToDelete, setGroupToDelete] = useState(null);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const isAnyModalOpen = isExpenseModalOpen || isGroupModalOpen || isSettingsModalOpen || Boolean(groupToDelete);

  // Wheel Service Selection
  const handleSelectService = (serviceId) => {
    if (serviceId === 'settle') {
      setActiveTab('settle');
      setCurrentView('workspace');
    } else {
      setCurrentView(serviceId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers
  const handleOpenAddExpense = () => {
    setEditingExpense(null);
    setIsExpenseModalOpen(true);
  };

  const handleOpenEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  const handleSaveExpense = (expenseData) => {
    if (!activeGroup) return;
    if (editingExpense) {
      updateExpense(activeGroup.id, editingExpense.id, expenseData);
    } else {
      addExpense(activeGroup.id, expenseData);
    }
  };

  const handleOpenNewGroup = () => {
    setEditingGroup(null);
    setIsGroupModalOpen(true);
  };

  const handleOpenEditGroup = (groupToEdit = activeGroup) => {
    setEditingGroup(groupToEdit);
    setIsGroupModalOpen(true);
  };

  const handleSaveGroup = (groupData) => {
    if (editingGroup) {
      updateGroup(editingGroup.id, groupData);
    } else {
      addGroup(groupData);
    }
  };

  const handleConfirmDeleteGroup = (groupId) => {
    deleteGroup(groupId);
    setGroupToDelete(null);
  };

  // Called from any Service (Equal, Items, Trip) to save as an active ledger and view workspace
  const handleSaveServiceToGroup = (newGroupData) => {
    addGroup(newGroupData);
    setCurrentView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] selection:bg-[#0052FF]/20 selection:text-[#0052FF] font-sans text-slate-900 overflow-x-clip">
      <CustomCursor />
      <AmbientBackground />

      {/* Main Dynamic Viewport with Zoom Transition */}
      <main className="flex-1 max-w-[88rem] w-full mx-auto px-3 sm:px-8 pb-8 flex flex-col justify-center">
        {/* Top Navbar - Part of Main Class */}
        <Navbar
          currentView={currentView}
          onSwitchView={handleSelectService}
          onOpenNewGroup={handleOpenNewGroup}
          onOpenEditGroup={handleOpenEditGroup}
          onDeleteGroup={(grp) => setGroupToDelete(grp)}
          onOpenAddExpense={handleOpenAddExpense}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          isHidden={isAnyModalOpen}
        />

        {/* VIEW 1: LANDING PAGE - Glassmorphic Stacked Cards Deck */}
        {currentView === 'wheel' && (
          <div key="wheel" className="w-full animate-zoom-in">
            <LandingHero onSelectService={handleSelectService} />
          </div>
        )}

        {/* VIEW 2: DEDICATED SERVICE A - Equal Split */}
        {currentView === 'equal' && (
          <div key="equal" className="w-full animate-zoom-in">
            <EqualSplitService
              onBackToWheel={() => setCurrentView('wheel')}
              onSaveToGroup={handleSaveServiceToGroup}
            />
          </div>
        )}

        {/* VIEW 3: DEDICATED SERVICE B - Items Split */}
        {currentView === 'items' && (
          <div key="items" className="w-full animate-zoom-in">
            <ItemsSplitService
              onBackToWheel={() => setCurrentView('wheel')}
              onSaveToGroup={handleSaveServiceToGroup}
            />
          </div>
        )}

        {/* VIEW 4: DEDICATED SERVICE C - Trip Split */}
        {currentView === 'trip' && (
          <div key="trip" className="w-full animate-zoom-in">
            <TripSplitService
              onBackToWheel={() => setCurrentView('wheel')}
              onSaveToGroup={handleSaveServiceToGroup}
            />
          </div>
        )}

        {/* VIEW 5: FULL WORKSPACE - Ledgers, Balances, Settle Up */}
        {currentView === 'workspace' && (
          <div key="workspace" className="w-full animate-zoom-in space-y-6">
            {activeGroup ? (
              <>
                <GroupHeader
                  group={activeGroup}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  onOpenAddExpense={handleOpenAddExpense}
                  onEditGroup={handleOpenEditGroup}
                  onDeleteGroup={(grp) => setGroupToDelete(grp)}
                />

                {/* Active Tab Views */}
                {activeTab === 'expenses' && (
                  <ExpenseList
                    expenses={activeGroup.expenses || []}
                    members={activeGroup.members || []}
                    currency={activeGroup.currency || 'INR'}
                    onAddExpense={handleOpenAddExpense}
                    onEditExpense={handleOpenEditExpense}
                    onDeleteExpense={(id) => deleteExpense(activeGroup.id, id)}
                  />
                )}

                {activeTab === 'balances' && (
                  <BalancesDashboard
                    group={activeGroup}
                    onNavigateToSettle={() => setActiveTab('settle')}
                  />
                )}

                {activeTab === 'settle' && (
                  <SettleUpView
                    group={activeGroup}
                    onRecordSettlement={(settlement) =>
                      recordSettlement(activeGroup.id, settlement)
                    }
                    onDeleteSettlement={(settlementId) =>
                      deleteSettlement(activeGroup.id, settlementId)
                    }
                  />
                )}
              </>
            ) : (
              <div className="p-10 rounded-2xl bg-white border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.03)] text-center max-w-md mx-auto my-12 space-y-4">
                <h3 className="text-xl font-medium tracking-tight text-black">
                  No Active Workspace
                </h3>
                <p className="text-sm text-gray-500">
                  Select a service from the wheel or create a group to start splitting expenses.
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentView('wheel')}
                  className="inline-flex items-center gap-2 bg-black text-white font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors text-sm cursor-pointer shadow-sm"
                >
                  Return to Home
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Minimal Glassmorphic Footer */}
      <Footer onSelectService={handleSelectService} currentView={currentView} />

      {/* Modals */}
      {isExpenseModalOpen && (
        <ExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          group={activeGroup}
          onSave={handleSaveExpense}
          editingExpense={editingExpense}
        />
      )}

      {isGroupModalOpen && (
        <GroupModal
          isOpen={isGroupModalOpen}
          onClose={() => setIsGroupModalOpen(false)}
          onSave={handleSaveGroup}
          onDelete={(grp) => setGroupToDelete(grp)}
          editingGroup={editingGroup}
        />
      )}

      {groupToDelete && (
        <DeleteGroupModal
          isOpen={Boolean(groupToDelete)}
          group={groupToDelete}
          onClose={() => setGroupToDelete(null)}
          onConfirm={handleConfirmDeleteGroup}
        />
      )}

      {isSettingsModalOpen && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
}
