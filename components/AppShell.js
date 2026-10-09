"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Wallet,
  Route,
  FileSearch,
  Settings,
  Plus,
  Shield,
  Bot,
} from "lucide-react";
import { useApp } from "./AppProvider";
import DebtModal from "./DebtModal";

const NAV = [
  { href: "/", key: "home", icon: Home },
  { href: "/debts", key: "myDebts", icon: Wallet },
  { href: "/plan", key: "plan", icon: Route },
  { href: "/contract", key: "contract", icon: FileSearch },
  { href: "/ai-chat", key: "aiChat", icon: Bot },
  { href: "/settings", key: "settings", icon: Settings },
];

export default function AppShell({ children }) {
  const app = useApp();
  const path = usePathname();
  const { tr } = app;

  if (path === "/login") return children;

  return (
    <div className="app-bg min-h-screen">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <Shield size={18} />
          </span>
          <div>
            <div className="brand-name">{tr("brand")}</div>
          </div>
        </div>
        <p className="tagline">{tr("tagline")}</p>
        <nav className="nav">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = path === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "nav-item active" : "nav-item"}
              >
                <Icon size={18} />
                {/* Если для aiChat еще нет перевода, можно временно написать "AI Maslahatchi" */}
                {item.key === "aiChat" ? "AI Maslahatchi" : tr(item.key)}
              </Link>
            );
          })}
        </nav>
        <p className="side-foot">{tr("privacyFoot")}</p>
      </aside>

      <div className="main">
        <header className="topbar">
          <div />
          <div className="top-actions">
            <div className="lang">
              <button
                className={app.lang === "uz" ? "on" : ""}
                onClick={() => app.setLang("uz")}
              >
                UZ
              </button>
              <button
                className={app.lang === "ru" ? "on" : ""}
                onClick={() => app.setLang("ru")}
              >
                RU
              </button>
            </div>
            {app.user ? (
              <Link href="/settings" className="guest-note">
                {app.user.email}
              </Link>
            ) : (
              <Link href="/login" className="guest-note">
                {tr("guest")}
              </Link>
            )}
            <button className="btn-primary" onClick={app.openAdd}>
              <Plus size={16} />
              {tr("addDebt")}
            </button>
          </div>
        </header>
        <div className="page">{children}</div>
      </div>
      <DebtModal />
    </div>
  );
}