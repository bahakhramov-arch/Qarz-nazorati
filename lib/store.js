const KEY = "qarz-nazorati-v1";

export const DEBT_TYPES = [
  { id: "Kredit", uz: "Kredit", ru: "Кредит" },
  { id: "Nasiya", uz: "Nasiya", ru: "Рассрочка" },
  { id: "Mikroqarz", uz: "Mikroqarz", ru: "Микрозайм" },
];

export const defaultDebts = [
  {
    id: "d1",
    creditor: "Ipoteka (Ipak Yo'l Bank)",
    type: "Kredit",
    monthly: 1800000,
    months: 14,
    remaining: 0,
    note: "",
    color: "#3b82f6",
  },
  {
    id: "d2",
    creditor: "Uzum Nasiya",
    type: "Nasiya",
    monthly: 900000,
    months: 7,
    remaining: 0,
    note: "",
    color: "#8b5cf6",
  },
  {
    id: "d3",
    creditor: "Mikroqarz (Onlayn)",
    type: "Mikroqarz",
    monthly: 1500000,
    months: 4,
    remaining: 0,
    note: "",
    color: "#f59e0b",
  },
  {
    id: "d4",
    creditor: "Kreditor",
    type: "Nasiya",
    monthly: 500000,
    months: 6,
    remaining: 0,
    note: "",
    color: "#6366f1",
  },
  {
    id: "d5",
    creditor: "Kreditor",
    type: "Nasiya",
    monthly: 500000,
    months: 6,
    remaining: 0,
    note: "",
    color: "#6366f1",
  },
];

export function emptyState() {
  return {
    lang: "uz",
    income: 10000000,
    extraPayment: 1000000,
    debts: defaultDebts,
    user: null,
  };
}

export function loadState() {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    return { ...emptyState(), ...JSON.parse(raw) };
  } catch {
    return emptyState();
  }
}

export function saveState(state) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export const TYPE_COLORS = {
  Kredit: "#3b82f6",
  Nasiya: "#6366f1",
  Mikroqarz: "#f59e0b",
};
