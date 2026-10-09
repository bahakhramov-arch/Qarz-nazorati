"use client";

import { useApp } from "@/components/AppProvider";
import { payoffPlan } from "@/lib/calc.mjs";
import { formatSom } from "@/lib/format";

export default function PlanPage() {
  const app = useApp();
  const { tr, debts } = app;
  const plan = payoffPlan(debts);

  return (
    <>
      <h1 className="h1">{tr("planTitle")}</h1>
      <p className="sub">{tr("planSub")}</p>
      <section className="card" style={{ marginTop: 16 }}>
        <div className="kpi">{plan.monthsToFreedom || 0}</div>
        <div className="muted">{tr("monthsFree")}</div>
      </section>
      <div className="grid-bot">
        <section className="card">
          <h3>{tr("order")}</h3>
          <ol className="plan-list">
            {plan.order.map((d, i) => (
              <li key={d.id}>
                <span>
                  {i + 1}. {d.creditor} · {d.type}
                </span>
                <b>
                  {formatSom(d.monthly)} · {d.months} {tr("monthN")}
                </b>
              </li>
            ))}
          </ol>
        </section>
        <section className="card">
          <h3>{tr("timeline")}</h3>
          <ul className="who-list">
            {plan.timeline.map((step) => (
              <li key={step.month}>
                <span>
                  {step.month}
                  {tr("monthLabel")}
                </span>
                <b>{step.paidOff.join(", ")}</b>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <p className="tiny" style={{ marginTop: 16 }}>
        {tr("disclaimer")}
      </p>
    </>
  );
}
