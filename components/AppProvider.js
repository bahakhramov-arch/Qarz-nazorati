"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadState, saveState, emptyState, TYPE_COLORS } from "@/lib/store";
import { t } from "@/lib/i18n";

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(emptyState);
  const [ready, setReady] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveState(state);
  }, [state, ready]);

  const api = useMemo(() => {
    const lang = state.lang || "uz";
    return {
      ...state,
      ready,
      modalOpen,
      editing,
      tr: (key) => t(lang, key),
      setLang: (lang) => setState((s) => ({ ...s, lang })),
      setIncome: (income) => setState((s) => ({ ...s, income: Number(income) || 0 })),
      setExtra: (extraPayment) =>
        setState((s) => ({ ...s, extraPayment: Number(extraPayment) || 0 })),
      openAdd: () => {
        setEditing(null);
        setModalOpen(true);
      },
      openEdit: (debt) => {
        setEditing(debt);
        setModalOpen(true);
      },
      closeModal: () => {
        setModalOpen(false);
        setEditing(null);
      },
      updateDebt: (debt) => {
        setState((s) => {
          const color = TYPE_COLORS[debt.type] || debt.color || "#6366f1";
          return {
            ...s,
            debts: s.debts.map((d) => (d.id === debt.id ? { ...d, ...debt, color } : d)),
          };
        });
      },
      saveDebt: (debt) => {
        setState((s) => {
          const color = TYPE_COLORS[debt.type] || "#6366f1";
          if (debt.id && s.debts.some((d) => d.id === debt.id)) {
            return {
              ...s,
              debts: s.debts.map((d) => (d.id === debt.id ? { ...d, ...debt, color } : d)),
            };
          }
          return {
            ...s,
            debts: [...s.debts, { ...debt, id: crypto.randomUUID(), color }],
          };
        });
        setModalOpen(false);
        setEditing(null);
      },
      removeDebt: (id) =>
        setState((s) => ({ ...s, debts: s.debts.filter((d) => d.id !== id) })),
      setUser: (user) => setState((s) => ({ ...s, user })),
      logout: () => setState((s) => ({ ...s, user: null })),
    };
  }, [state, ready, modalOpen, editing]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp outside provider");
  return ctx;
}
