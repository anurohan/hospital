import { test } from "node:test";
import assert from "node:assert/strict";
import {
  formatAppointmentUid,
  formatPatientUid,
  formatToken,
  normalizePrefix,
} from "../ids";

test("normalizePrefix mirrors the DB regex rule", () => {
  assert.equal(normalizePrefix("Arogyan"), "ARO");
  assert.equal(normalizePrefix("a1b2c3"), "ABC");
  assert.equal(normalizePrefix("123"), "HSP");
  assert.equal(normalizePrefix(""), "HSP");
});

test("formatAppointmentUid matches ARO-YYYYMMDD-XXXX", () => {
  assert.equal(formatAppointmentUid("Arogyan", "2026-01-09", 7), "ARO-20260109-0007");
  assert.equal(formatAppointmentUid("Arogyan", "2026-12-31", 1234), "ARO-20261231-1234");
});

test("formatPatientUid matches PREFIX-YYYY-NNNNN", () => {
  assert.equal(formatPatientUid("Arogyan", 2026, 42), "ARO-2026-00042");
});

test("formatToken distinguishes online vs walk-in", () => {
  assert.equal(formatToken("online", 7), "A-007");
  assert.equal(formatToken("walk_in", 7), "W-007");
  assert.equal(formatToken("online", 123), "A-123");
});
