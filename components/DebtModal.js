"use client";

import { useEffect, useState } from "react";
import { useApp } from "./AppProvider";
import { DEBT_TYPES } from "@/lib/store";

const empty = {
  creditor: "",
  type: "Nasiya",
  monthly: "",
  months: "",
  remaining: "",
  note: "",
};

export default function DebtModal() {
  const app = useApp();
  const { tr } = app;
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (app.editing) {
      setForm({
        creditor: app.editing.creditor,
        type: app.editing.type,
        monthly: app.editing.monthly,
        months: app.editing.months,
        remaining: app.editing.remaining || "",
        note: app.editing.note || "",
      });
    } else {
      setForm(empty);
    }
  }, [app.editing, app.modalOpen]);

  if (!app.modalOpen) return null;

  function submit(e) {
    e.preventDefault();
    app.saveDebt({
      id: app.editing?.id,
      ...form,
      monthly: Number(form.monthly) || 0,
      months: Number(form.months) || 0,
      remaining: Number(form.remaining) || 0,
    });
  }

  return (
    <div className="overlay" onClick={app.closeModal}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h3>{app.editing ? tr("edit") : tr("addDebt")}</h3>
        <label>
          {tr("creditor")}
          <input
            required
            value={form.creditor}
            onChange={(e) => setForm({ ...form, creditor: e.target.value })}
          />
        </label>
        <label>
          {tr("debtType")}
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            {DEBT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {app.lang === "ru" ? t.ru : t.uz}
              </option>
            ))}
          </select>
        </label>
        <div className="row-2">
          <label>
            {tr("monthly")}
            <input
              required
              type="number"
              min="0"
              value={form.monthly}
              onChange={(e) => setForm({ ...form, monthly: e.target.value })}
            />
          </label>
          <label>
            {tr("months")}
            <input
              required
              type="number"
              min="1"
              value={form.months}
              onChange={(e) => setForm({ ...form, months: e.target.value })}
            />
          </label>
        </div>
        <label>
          {tr("remaining")}
          <input
            type="number"
            min="0"
            value={form.remaining}
            onChange={(e) => setForm({ ...form, remaining: e.target.value })}
          />
        </label>
        <label>
          {tr("note")}
          <input
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </label>
        <div className="modal-actions">
          {app.editing ? (
            <button
              type="button"
              className="btn-danger"
              onClick={() => {
                app.removeDebt(app.editing.id);
                app.closeModal();
              }}
            >
              {tr("delete")}
            </button>
          ) : (
            <span />
          )}
          <div className="row-r">
            <button type="button" className="btn-ghost" onClick={app.closeModal}>
              {tr("cancel")}
            </button>
            <button type="submit" className="btn-primary">
              {tr("save")}
            </button>
          </div>
        </div>
        <p className="tiny">{tr("disclaimer")}</p>
      </form>
    </div>
  );
}
