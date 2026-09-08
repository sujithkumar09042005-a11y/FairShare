import React, { useState } from 'react';
import CustomCursor from './components/ui/CustomCursor.jsx';
import AmbientBackground from './components/layout/AmbientBackground.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import RadialSelectionWheel from './components/landing/RadialSelectionWheel.jsx';
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

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

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

  const handleOpenEditGroup = () => {
    setEditingGroup(activeGroup);
    setIsGroupModalOpen(true);
  };

  const handleSaveGroup = (groupData) => {
    if (editingGroup) {
      updateGroup(editingGroup.id, groupData);
    } else {
      addGroup(groupData);
    }
  };

  // Called from any Service (Equal, Items, Trip) to save as an active ledger and view workspace
  const handleSaveServiceToGroup = (newGroupData) => {
    addGroup(newGroupData);
    setCurrentView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#6C63FF]/30 selection:text-[#6C63FF]">
      <CustomCursor />
      <AmbientBackground />

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onSwitchView={handleSelectService}
        onOpenNewGroup={handleOpenNewGroup}
        onOpenEditGroup={handleOpenEditGroup}
        onOpenAddExpense={handleOpenAddExpense}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Main Dynamic Viewport with Zoom Transition */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-4 sm:py-6 flex flex-col justify-center">
        {/* VIEW 1: LANDING PAGE - 360 Radial Selection Wheel */}
        {currentView === 'wheel' && (
          <div key="wheel" className="w-full animate-zoom-in">
            <RadialSelectionWheel onSelectService={handleSelectService} />
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
              <div className="p-10 rounded-[32px] bg-[#E0E5EC] shadow-neu-extruded text-center max-w-md mx-auto my-12 space-y-4">
                <h3 className="text-lg font-bold text-[#3D4852]">
                  No Active Workspace
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Select a service from the wheel or create a group to start splitting expenses.
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentView('wheel')}
                  className="neu-btn-primary px-6 py-2.5 text-xs font-semibold inline-block cursor-pointer"
                >
                  Open Services Wheel
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
          editingGroup={editingGroup}
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
