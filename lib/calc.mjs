export const DTI_LIMIT = 50;

export function toNumber(value) {
  const n = Number(String(value).replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

export function monthlyPayments(debts) {
  return debts.reduce((sum, d) => sum + toNumber(d.monthly), 0);
}

export function remainingAfterPayments(income, debts) {
  return toNumber(income) - monthlyPayments(debts);
}

export function remainingPrincipal(debts) {
  return debts.reduce((sum, d) => {
    const explicit = toNumber(d.remaining);
    if (explicit > 0) return sum + explicit;
    return sum + toNumber(d.monthly) * toNumber(d.months);
  }, 0);
}

export function debtLoadPercent(income, debts, extraPayment = 0) {
  const inc = toNumber(income);
  if (inc <= 0) return 0;
  const load = monthlyPayments(debts) + toNumber(extraPayment);
  return Math.round((load / inc) * 1000) / 10;
}

export function loadZone(percent) {
  if (percent > DTI_LIMIT) return "red";
  if (percent >= 35) return "yellow";
  return "green";
}

export function whatIf(income, debts, extraPayment) {
  const now = debtLoadPercent(income, debts, 0);
  const next = debtLoadPercent(income, debts, extraPayment);
  return {
    now,
    next,
    nowZone: loadZone(now),
    nextZone: loadZone(next),
    exceeds: next > DTI_LIMIT,
  };
}

/**
 * Plan: pay scheduled amounts; recommend order by highest monthly payment
 * so DTI drops fastest. Months to freedom = max remaining term.
 */
export function payoffPlan(debts) {
  const items = debts
    .filter((d) => toNumber(d.monthly) > 0 && toNumber(d.months) > 0)
    .map((d) => ({
      id: d.id,
      creditor: d.creditor,
      type: d.type,
      monthly: toNumber(d.monthly),
      months: toNumber(d.months),
      remaining:
        toNumber(d.remaining) || toNumber(d.monthly) * toNumber(d.months),
    }))
    .sort((a, b) => b.monthly - a.monthly);

  const monthsToFreedom = items.reduce((m, d) => Math.max(m, d.months), 0);
  const timeline = [];
  let month = 0;
  const left = items.map((d) => ({ ...d, monthsLeft: d.months }));

  while (left.some((d) => d.monthsLeft > 0) && month < 360) {
    month += 1;
    const paidOff = [];
    for (const d of left) {
      if (d.monthsLeft <= 0) continue;
      d.monthsLeft -= 1;
      if (d.monthsLeft === 0) paidOff.push(d.creditor);
    }
    if (paidOff.length) {
      timeline.push({ month, paidOff });
    }
  }

  return {
    order: items,
    monthsToFreedom,
    timeline,
  };
}

export function numbersForAi({ income, debts, extraPayment = 0 }) {
  const totalMonthly = monthlyPayments(debts);
  const dti = debtLoadPercent(income, debts);
  const extra = whatIf(income, debts, extraPayment);
  const plan = payoffPlan(debts);
  return {
    monthlyIncome: toNumber(income),
    obligationCount: debts.length,
    totalMonthly,
    leftover: remainingAfterPayments(income, debts),
    dtiPercent: dti,
    dtiLimit: DTI_LIMIT,
    zone: loadZone(dti),
    extraPayment: toNumber(extraPayment),
    extraDtiPercent: extra.next,
    monthsToFreedom: plan.monthsToFreedom,
    debts: debts.map((d) => ({
      type: d.type,
      monthly: toNumber(d.monthly),
      months: toNumber(d.months),
    })),
  };
}
