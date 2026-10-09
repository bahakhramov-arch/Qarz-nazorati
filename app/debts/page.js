"use client";

import { useApp } from "@/components/AppProvider";
import { remainingPrincipal, monthlyPayments } from "@/lib/calc.mjs";
import { formatSom, typeLetter } from "@/lib/format";

export default function DebtsPage() {
  const app = useApp();
  const { tr, debts } = app;
  const total = remainingPrincipal(debts);
  const monthly = monthlyPayments(debts);

  const byCreditor = debts.reduce((acc, d) => {
    acc[d.creditor] = (acc[d.creditor] || 0) + (d.remaining || d.monthly * d.months);
    return acc;
  }, {});

  return (
    <>
      <h1 className="h1">{tr("myDebts")}</h1>
      <p className="sub">{tr("helloSub")}</p>
      <div className="grid-top" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <section className="card">
          <div className="muted">{tr("totalLeft")}</div>
          <div className="kpi">{formatSom(total)}</div>
          <div className="muted">{tr("som")}</div>
        </section>
        <section className="card">
          <div className="muted">{tr("totalPay")}</div>
          <div className="kpi">{formatSom(monthly)}</div>
          <div className="muted">{tr("som")} / {tr("months")}</div>
        </section>
      </div>
      <section className="card" style={{ marginTop: 16 }}>
        <h3>{tr("obligations")}</h3>
        {debts.length === 0 ? (
          <p className="sub">{tr("emptyDebts")}</p>
        ) : (
          <ul className="who-list">
            {debts.map((d) => (
              <li key={d.id}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span className="badge" style={{ background: d.color }}>
                    {typeLetter(d.type)}
                  </span>
                  <div>
                    <b>{d.creditor}</b>
                    <div className="tiny">
                      {d.type} · {formatSom(d.monthly)} / {tr("months")} · {d.months} {tr("months")}
                    </div>
                  </div>
                </div>
                <div>
                  <b>{formatSom(d.remaining || d.monthly * d.months)}</b>
                  <button className="btn-ghost" style={{ marginLeft: 8 }} onClick={() => app.openEdit(d)}>
                    {tr("edit")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="card" style={{ marginTop: 16 }}>
        <h3>{tr("whoHowMuch")}</h3>
        <ul className="who-list">
          {Object.entries(byCreditor).map(([name, sum]) => (
            <li key={name}>
              <span>{name}</span>
              <b>{formatSom(sum)} {tr("som")}</b>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
