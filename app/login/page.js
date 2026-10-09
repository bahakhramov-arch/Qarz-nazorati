"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { useApp } from "@/components/AppProvider";

export default function LoginPage() {
  const app = useApp();
  const { tr } = app;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function enter(user) {
    app.setUser(user);
    router.push("/");
  }

  return (
    <div className="auth-wrap">
      <section className="card auth-card">
        <div className="brand" style={{ marginBottom: 12 }}>
          <span className="brand-mark">
            <Shield size={18} />
          </span>
          <b>{tr("brand")}</b>
        </div>
        <h1 className="h1" style={{ fontSize: 26 }}>
          {tr("login")}
        </h1>
        <p className="tiny">{tr("demoAuth")}</p>
        <label className="muted">{tr("email")}</label>
        <input className="num" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="muted" style={{ marginTop: 8, display: "block" }}>
          {tr("password")}
        </label>
        <input
          className="num"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn-primary wide"
          onClick={() => email && enter({ email, provider: "email" })}
        >
          {tr("login")}
        </button>
        <button
          className="btn-ghost wide"
          style={{ width: "100%", marginTop: 8 }}
          onClick={() => enter({ email: email || "google@guest.local", provider: "google" })}
        >
          {tr("google")}
        </button>
        <button
          className="btn-ghost wide"
          style={{ width: "100%", marginTop: 8 }}
          onClick={() => {
            app.setUser(null);
            router.push("/");
          }}
        >
          {tr("continueGuest")}
        </button>
        <p className="tiny" style={{ marginTop: 12 }}>
          {tr("privacyBody")}
        </p>
      </section>
    </div>
  );
}
