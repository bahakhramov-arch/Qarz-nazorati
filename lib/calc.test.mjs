import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DTI_LIMIT,
  debtLoadPercent,
  loadZone,
  monthlyPayments,
  remainingAfterPayments,
  whatIf,
  payoffPlan,
  numbersForAi,
} from "./calc.mjs";

const debts = [
  { id: "1", creditor: "A", type: "Kredit", monthly: 1_800_000, months: 14 },
  { id: "2", creditor: "B", type: "Nasiya", monthly: 900_000, months: 7 },
  { id: "3", creditor: "C", type: "Mikroqarz", monthly: 1_500_000, months: 4 },
  { id: "4", creditor: "D", type: "Nasiya", monthly: 500_000, months: 6 },
  { id: "5", creditor: "E", type: "Nasiya", monthly: 500_000, months: 6 },
];

test("monthly payments match demo", () => {
  assert.equal(monthlyPayments(debts), 5_200_000);
});

test("DTI is 52% of 10m income", () => {
  assert.equal(debtLoadPercent(10_000_000, debts), 52);
  assert.equal(loadZone(52), "red");
  assert.equal(DTI_LIMIT, 50);
});

test("leftover income is 4.8m", () => {
  assert.equal(remainingAfterPayments(10_000_000, debts), 4_800_000);
});

test("what-if +1m payment raises DTI to 62%", () => {
  const result = whatIf(10_000_000, debts, 1_000_000);
  assert.equal(result.now, 52);
  assert.equal(result.next, 62);
  assert.equal(result.exceeds, true);
});

test("payoff plan orders by highest monthly and max term", () => {
  const plan = payoffPlan(debts);
  assert.equal(plan.order[0].monthly, 1_800_000);
  assert.equal(plan.monthsToFreedom, 14);
  assert.ok(plan.timeline.length >= 1);
});

test("AI payload has no creditor names", () => {
  const payload = numbersForAi({ income: 10_000_000, debts });
  const json = JSON.stringify(payload);
  assert.equal(json.includes("creditor"), false);
  assert.equal(json.includes("Ipoteka"), false);
  assert.equal(payload.dtiPercent, 52);
  assert.equal(payload.obligationCount, 5);
});
