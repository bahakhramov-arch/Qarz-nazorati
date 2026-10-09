"use client";

import { useApp } from "@/components/AppProvider";
import Link from "next/link";

export default function SettingsPage() {
  const app = useApp();
  const { tr } = app;

  return (
    <>
      <h1 className="h1">{tr("settings")}</h1>
      <section className="card" style={{ marginTop: 16, maxWidth: 640 }}>
        <label className="muted">{tr("income")}</label>
        <input
          className="num"
          type="number"
          value={app.income}
          onChange={(e) => app.setIncome(e.target.value)}
        />
        <div style={{ marginTop: 16 }}>
          <div className="muted">{tr("language")}</div>
          <div className="lang" style={{ marginTop: 8, width: "fit-content" }}>
            <button className={app.lang === "uz" ? "on" : ""} onClick={() => app.setLang("uz")}>
              UZ
            </button>
            <button className={app.lang === "ru" ? "on" : ""} onClick={() => app.setLang("ru")}>
              RU
            </button>
          </div>
        </div>
        <h3 style={{ marginTop: 24 }}>{tr("privacyTitle")}</h3>
        <p className="sub">{tr("privacyBody")}</p>
        <p className="tiny">{tr("disclaimer")}</p>
        <div style={{ marginTop: 16 }}>
          {app.user ? (
            <>
              <div>
                {tr("signedIn")}: <b>{app.user.email}</b>
              </div>
              <button className="btn-ghost" style={{ marginTop: 8 }} onClick={app.logout}>
                {tr("logout")}
              </button>
            </>
          ) : (
            <Link className="btn-primary" href="/login">
              {tr("login")}
            </Link>
          )}
        </div>
      </section>
    </>
  );
}
