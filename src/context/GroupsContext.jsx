import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import { INITIAL_DEMO_GROUPS } from '../utils/exportImport.js';

const GroupsContext = createContext();

const STORAGE_KEY = 'billsplitter:groups';

export function GroupsProvider({ children }) {
  const [groups, setGroups] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed reading groups from localStorage:', e);
    }
    return INITIAL_DEMO_GROUPS;
  });


  const [activeGroupId, setActiveGroupId] = useState(() => {
    return groups[0]?.id || '';
  });

  // Keep activeGroupId valid if groups change
  useEffect(() => {
    if (!groups.find((g) => g.id === activeGroupId) && groups.length > 0) {
      setActiveGroupId(groups[0].id);
    }
  }, [groups, activeGroupId]);

  // Debounced auto-save to localStorage
  const saveTimeoutRef = useRef(null);
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
      } catch (e) {
        console.error('Failed writing groups to localStorage:', e);
      }
    }, 300);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [groups]);

  // Derived active group
  const activeGroup = useMemo(() => {
    return groups.find((g) => g.id === activeGroupId) || groups[0] || null;
  }, [groups, activeGroupId]);

  // Actions
  const addGroup = (groupData) => {
    const newGroup = {
      id: `grp-${crypto.randomUUID()}`,
      createdAt: Date.now(),
      expenses: [],
      settlements: [],
      ...groupData,
    };
    setGroups((prev) => [newGroup, ...prev]);
    setActiveGroupId(newGroup.id);
    return newGroup;
  };

  const updateGroup = (groupId, partial) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, ...partial } : g))
    );
  };

  const deleteGroup = (groupId) => {
    setGroups((prev) => {
      const next = prev.filter((g) => g.id !== groupId);
      if (next.length === 0) {
        const fresh = {
          id: `grp-${crypto.randomUUID()}`,
          name: 'My Expenses',
          description: 'Personal and shared expenses',
          currency: 'INR',
          createdAt: Date.now(),
          members: [
            { id: `mem-${crypto.randomUUID()}`, name: 'You', avatarColor: '#6C63FF' },
            { id: `mem-${crypto.randomUUID()}`, name: 'Friend', avatarColor: '#38B2AC' },
          ],
          expenses: [],
          settlements: [],
        };
        setActiveGroupId(fresh.id);
        return [fresh];
      }
      if (activeGroupId === groupId) {
        setActiveGroupId(next[0].id);
      }
      return next;
    });
  };

  const addExpense = (groupId, expenseData) => {
    const newExpense = {
      id: `exp-${crypto.randomUUID()}`,
      date: new Date().toISOString(),
      ...expenseData,
    };

    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          expenses: [newExpense, ...g.expenses],
        };
      })
    );
    return newExpense;
  };

  const updateExpense = (groupId, expenseId, updatedData) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          expenses: g.expenses.map((e) =>
            e.id === expenseId ? { ...e, ...updatedData } : e
          ),
        };
      })
    );
  };

  const deleteExpense = (groupId, expenseId) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          expenses: g.expenses.filter((e) => e.id !== expenseId),
        };
      })
    );
  };

  const recordSettlement = (groupId, settlementData) => {
    const newSettlement = {
      id: `set-${crypto.randomUUID()}`,
      date: new Date().toISOString(),
      ...settlementData,
    };

    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          settlements: [newSettlement, ...(g.settlements || [])],
        };
      })
    );
    return newSettlement;
  };

  const deleteSettlement = (groupId, settlementId) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          settlements: (g.settlements || []).filter((s) => s.id !== settlementId),
        };
      })
    );
  };

  const resetToDemoData = () => {
    setGroups(INITIAL_DEMO_GROUPS);
    setActiveGroupId(INITIAL_DEMO_GROUPS[0].id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_GROUPS));
  };

  const importGroups = (importedList) => {
    setGroups(importedList);
    if (importedList.length > 0) {
      setActiveGroupId(importedList[0].id);
    }
  };

  return (
    <GroupsContext.Provider
      value={{
        groups,
        activeGroupId,
        activeGroup,
        setActiveGroupId,
        addGroup,
        updateGroup,
        deleteGroup,
        addExpense,
        updateExpense,
        deleteExpense,
        recordSettlement,
        deleteSettlement,
        resetToDemoData,
        importGroups,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
}

export function useGroups() {
  const context = useContext(GroupsContext);
  if (!context) {
    throw new Error('useGroups must be used within a GroupsProvider');
  }
  return context;
}
