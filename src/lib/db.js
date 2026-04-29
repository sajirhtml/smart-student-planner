// Tiny localStorage-backed "DB". One key per table. Seeded on first read.
// Swap this file's internals later for fetch() calls to PHP/Firebase — same API.

import * as SEED from "@/data/seed";

const PREFIX = "scms.";
const TABLES = [
  "USERS", "REGULAR_STUDENT", "FACULTY", "ROOM", "COURSE",
  "PREREQUISITE", "SECTION", "ENROLLMENT", "PLANNED_ENROLLMENT",
  "TASK", "ACADEMIC_RECORDS", "CONSULTATION", "FACULTY_SLOT", "RESOURCES",
];

function key(table) { return PREFIX + table; }

export function getTable(table) {
  const raw = localStorage.getItem(key(table));
  if (raw == null) {
    const seeded = SEED[table] ?? [];
    localStorage.setItem(key(table), JSON.stringify(seeded));
    return structuredClone(seeded);
  }
  try { return JSON.parse(raw); } catch { return []; }
}

export function setTable(table, rows) {
  localStorage.setItem(key(table), JSON.stringify(rows));
  // notify listeners in same tab
  window.dispatchEvent(new CustomEvent("scms:change", { detail: { table } }));
}

export function updateTable(table, updater) {
  const next = updater(getTable(table));
  setTable(table, next);
  return next;
}

export function resetAll() {
  TABLES.forEach((t) => localStorage.removeItem(key(t)));
  TABLES.forEach((t) => getTable(t)); // re-seed
  window.dispatchEvent(new CustomEvent("scms:change", { detail: { table: "*" } }));
}

export const CREDIT_CAP = SEED.CREDIT_CAP;
