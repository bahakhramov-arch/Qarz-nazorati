"use client";

import { useState } from "react";
import { useApp } from "@/components/AppProvider";
import { numbersForAi } from "@/lib/calc.mjs";

export default function ContractPage() {
  const app = useApp();
  const { tr } = app;
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function analyze() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "contract",
          lang: app.lang,
          contractText: text,
          numbers: numbersForAi({
            income: app.income,
            debts: app.debts,
            extraPayment: app.extraPayment,
          }),
        }),
      });
      const data = await res.json();
      setResult(data.result || tr("aiError"));
    } catch {
      setResult(tr("aiError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="h1">{tr("contractTitle")}</h1>
      <p className="sub">{tr("contractSub")}</p>
      <section className="card" style={{ marginTop: 16 }}>
        <textarea
          rows={10}
          placeholder={tr("contractPlaceholder")}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="btn-primary"
          style={{ marginTop: 12 }}
          onClick={analyze}
          disabled={loading || !text.trim()}
        >
          {loading ? tr("analyzing") : tr("analyze")}
        </button>
        {result ? <div className="ai-out">{result}</div> : null}
        <p className="tiny" style={{ marginTop: 12 }}>
          {tr("privacyBody")}
        </p>
      </section>
    </>
  );
}
