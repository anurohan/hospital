import { test } from "node:test";
import assert from "node:assert/strict";
import { toMinutes, fromMinutes, addMinutes, overlaps, dayOfWeek } from "../time";

test("toMinutes / fromMinutes round-trip", () => {
  assert.equal(toMinutes("09:00"), 540);
  assert.equal(toMinutes("13:30"), 810);
  assert.equal(fromMinutes(540), "09:00");
  assert.equal(fromMinutes(810), "13:30");
});

test("toMinutes rejects malformed input", () => {
  assert.throws(() => toMinutes("9am"));
  assert.throws(() => toMinutes("24:00"));
  assert.throws(() => toMinutes("10:75"));
});

test("addMinutes handles hour rollover", () => {
  assert.equal(addMinutes("09:45", 30), "10:15");
  assert.equal(addMinutes("23:50", 20), "00:10");
});

test("overlaps detects half-open interval overlap", () => {
  assert.equal(overlaps("09:00", "09:15", "09:15", "09:30"), false); // adjacent, no overlap
  assert.equal(overlaps("09:00", "09:30", "09:15", "09:45"), true);
  assert.equal(overlaps("13:00", "13:15", "13:00", "14:00"), true);
});

test("dayOfWeek is correct and tz-stable", () => {
  assert.equal(dayOfWeek("2026-10-09"), "friday");
  assert.equal(dayOfWeek("2026-10-12"), "monday");
});
