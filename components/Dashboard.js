"use client";

import { useApp } from "./AppProvider";
import {
  debtLoadPercent,
  loadZone,
  monthlyPayments,
  remainingAfterPayments,
  whatIf,
} from "@/lib/calc.mjs";
import { formatSom, typeLetter } from "@/lib/format";
import { DEBT_TYPES } from "@/lib/store";
import { X } from "lucide-react";

function zoneText(tr, zone) {
  if (zone === "red") return tr("loadDanger");
  if (zone === "yellow") return tr("loadWarn");
  return tr("loadOk");
}

export default function Dashboard() {
  const app = useApp();
  const { tr, debts, income } = app;
  const dti = debtLoadPercent(income, debts);
  const zone = loadZone(dti);
  const paid = monthlyPayments(debts);
  const left = remainingAfterPayments(income, debts);
  const sim = whatIf(income, debts, app.extraPayment);

  return (
    <>
      <h1 className="h1">{tr("hello")}</h1>
      <p className="sub">{tr("helloSub")}</p>

      <div className="grid-top">
        <section className="card load-card" style={{ width: "100%" }}>
          <div className="muted">{tr("loadTitle")}</div>
          <div className="load-row">
            <div>
              <div className={`pct ${zone}`}>{dti}%</div>
              <div className={`zone-msg ${zone}`}>{zoneText(tr, zone)}</div>
            </div>
            <div className="bar-wrap">
              <div className="bar">
                <div
                  className={`bar-fill ${zone}`}
                  style={{ width: `${Math.min(dti, 100)}%` }}
                />
                <div className="bar-mark" style={{ left: "50%" }} />
              </div>
              <div className="cb-note">{tr("cbNote")}</div>
            </div>
          </div>
          <div className="stats">
            <div>
              <div className="muted">{tr("income")}</div>
              <input
                className="income-input"
                type="number"
                value={income}
                onChange={(e) => app.setIncome(e.target.value)}
              />
            </div>
            <div>
              <div className="muted">{tr("totalPay")}</div>
              <div className="stat-val danger">{formatSom(paid)} {tr("som")}</div>
            </div>
            <div>
              <div className="muted">{tr("leftover")}</div>
              <div className="stat-val">{formatSom(left)} {tr("som")}</div>
            </div>
          </div>
        </section>
      </div>

      <div className="grid-bot">
        <section className="card">
          <h3>{tr("obligations")}</h3>
          {debts.length === 0 ? (
            <p className="sub">{tr("emptyDebts")}</p>
          ) : (
            <ul className="debt-list">
              {debts.map((d) => (
                <li key={d.id}>
                  <span className="badge" style={{ background: d.color }}>
                    {typeLetter(d.type)}
                  </span>
                  <div className="debt-mid">
                    <input
                      className="plain"
                      value={d.creditor}
                      onChange={(e) =>
                        app.updateDebt({ ...d, creditor: e.target.value })
                      }
                    />
                    <select
                      className="plain type"
                      value={d.type}
                      onChange={(e) =>
                        app.updateDebt({ ...d, type: e.target.value })
                      }
                    >
                      {DEBT_TYPES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {app.lang === "ru" ? t.ru : t.uz}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    className="num"
                    type="number"
                    value={d.monthly}
                    onChange={(e) =>
                      app.updateDebt({ ...d, monthly: Number(e.target.value) || 0 })
                    }
                  />
                  <div className="tiny-lab">{tr("perMonth")}</div>
                  <input
                    className="num short"
                    type="number"
                    value={d.months}
                    onChange={(e) =>
                      app.updateDebt({ ...d, months: Number(e.target.value) || 0 })
                    }
                  />
                  <div className="tiny-lab">{tr("months")}</div>
                  <button className="icon-x" onClick={() => app.removeDebt(d.id)}>
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <h3>{tr("whatIf")}</h3>
          <p className="muted">{tr("whatIfHint")}</p>
          <input
            className="num block"
            type="number"
            value={app.extraPayment}
            onChange={(e) => app.setExtra(e.target.value)}
          />
          <input
            type="range"
            min="0"
            max={Math.max(income, 1)}
            step="50000"
            value={app.extraPayment}
            onChange={(e) => app.setExtra(e.target.value)}
          />
          <div className="what-grid">
            <div>
              <div className="muted">{tr("now")}</div>
              <div className={`pct sm ${sim.nowZone}`}>{sim.now}%</div>
              <div className="muted">{tr("dtiLabel")}</div>
            </div>
            <div>
              <div className="muted">{tr("ifTake")}</div>
              <div className={`pct sm ${sim.nextZone}`}>{sim.next}%</div>
              <div className="muted">{tr("dtiLabel")}</div>
            </div>
          </div>
          <p className={sim.exceeds ? "warn-red" : "warn-ok"}>
            {sim.exceeds ? tr("whatIfDanger") : tr("whatIfOk")}
          </p>
        </section>
      </div>
    </>
  );
}