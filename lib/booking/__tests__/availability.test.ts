import { test } from "node:test";
import assert from "node:assert/strict";
import { generateSlots, availableSlots, isSlotBookable } from "../availability";
import type { DaySchedule } from "../availability";

const base: DaySchedule = {
  start_time: "09:00",
  end_time: "12:00",
  slot_duration_minutes: 30,
  break_start: null,
  break_end: null,
  max_patients: null,
};

test("generates contiguous slots across the window", () => {
  const slots = generateSlots(base);
  assert.deepEqual(
    slots.map((s) => s.start_time),
    ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"]
  );
  assert.equal(slots.every((s) => s.is_available), true);
});

test("excludes slots overlapping the break window", () => {
  const slots = generateSlots({ ...base, break_start: "10:00", break_end: "10:30" });
  const tenAM = slots.find((s) => s.start_time === "10:00");
  assert.equal(tenAM?.is_available, false);
  assert.equal(slots.find((s) => s.start_time === "09:30")?.is_available, true);
});

test("marks already-booked start times unavailable (double-booking prevention)", () => {
  const slots = generateSlots(base, { bookedStartTimes: ["10:00", "11:30"] });
  assert.equal(slots.find((s) => s.start_time === "10:00")?.is_available, false);
  assert.equal(slots.find((s) => s.start_time === "11:30")?.is_available, false);
  assert.equal(slots.find((s) => s.start_time === "09:00")?.is_available, true);
});

test("isSlotBookable rejects a taken slot and accepts a free one", () => {
  assert.equal(isSlotBookable(base, "10:00", { bookedStartTimes: ["10:00"] }), false);
  assert.equal(isSlotBookable(base, "09:30", { bookedStartTimes: ["10:00"] }), true);
  assert.equal(isSlotBookable(base, "08:00"), false); // outside window
});

test("hides past slots when the date is today", () => {
  const slots = generateSlots(base, { nowIfToday: "10:10" });
  assert.equal(slots.find((s) => s.start_time === "09:00")?.is_available, false);
  assert.equal(slots.find((s) => s.start_time === "10:30")?.is_available, true);
});

test("respects a minimum lead time", () => {
  assert.equal(isSlotBookable(base, "10:30", { nowIfToday: "10:00", minLeadMinutes: 60 }), false);
  assert.equal(isSlotBookable(base, "11:30", { nowIfToday: "10:00", minLeadMinutes: 60 }), true);
});

test("enforces max_patients capacity", () => {
  const avail = availableSlots(
    { ...base, max_patients: 2 },
    { bookedStartTimes: ["09:00", "09:30"] }
  );
  // 2 already booked == capacity reached -> no further availability
  assert.equal(avail.length, 0);
});

test("returns empty when end <= start", () => {
  assert.deepEqual(generateSlots({ ...base, start_time: "12:00", end_time: "09:00" }), []);
});

test("throws on invalid slot duration", () => {
  assert.throws(() => generateSlots({ ...base, slot_duration_minutes: 0 }));
});
