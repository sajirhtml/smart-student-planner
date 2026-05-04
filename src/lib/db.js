// Data layer: fetches from PHP API on init, caches in memory.
// getTable / updateTable keep the same sync API so all pages work unchanged.
// Write-through: mutations update both local cache and the PHP API.

import { fetchAllTables } from "@/lib/api";
import * as SEED from "@/data/seed";

const cache = {};      // { TABLE_NAME: rows[] }
let _ready = false;
let _readyPromise = null;

/**
 * Load all tables from the PHP API (call once on app start).
 * Falls back to seed data if the API is unreachable.
 */
export function loadFromAPI() {
  if (_readyPromise) return _readyPromise;
  _readyPromise = fetchAllTables()
    .then((map) => {
      Object.entries(map).forEach(([name, rows]) => {
        cache[name] = rows;
      });
      // Tables not served by the API — fall back to seed / empty
      if (!cache.FACULTY_SLOT || cache.FACULTY_SLOT.length === 0) {
        cache.FACULTY_SLOT = SEED.FACULTY_SLOT ?? [];
      }
      if (!cache.ACADEMIC_RECORDS) cache.ACADEMIC_RECORDS = SEED.ACADEMIC_RECORDS ?? [];
      _ready = true;
      console.log("[db] Loaded from API", Object.keys(cache).map(k => `${k}(${cache[k]?.length})`));
    })
    .catch((err) => {
      console.warn("[db] API unreachable, falling back to seed data:", err);
      Object.keys(SEED).forEach((k) => {
        if (Array.isArray(SEED[k])) cache[k] = structuredClone(SEED[k]);
      });
      _ready = true;
    });
  return _readyPromise;
}

export function isReady() {
  return _ready;
}

/**
 * Synchronous read — returns cached rows (empty array before load).
 */
export function getTable(table) {
  return cache[table] ?? [];
}

/**
 * Replace a full table in cache and notify listeners.
 */
export function setTable(table, rows) {
  cache[table] = rows;
  window.dispatchEvent(new CustomEvent("scms:change", { detail: { table } }));
}

/**
 * Update a table with a function, notify listeners, and return new rows.
 */
export function updateTable(table, updater) {
  const next = updater(getTable(table));
  setTable(table, next);
  return next;
}

/**
 * Reset cache and reload from API.
 */
export function resetAll() {
  Object.keys(cache).forEach((k) => delete cache[k]);
  _ready = false;
  _readyPromise = null;
  loadFromAPI().then(() => {
    window.dispatchEvent(new CustomEvent("scms:change", { detail: { table: "*" } }));
  });
}

export const CREDIT_CAP = SEED.CREDIT_CAP;
