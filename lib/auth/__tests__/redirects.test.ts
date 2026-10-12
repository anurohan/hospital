import test from "node:test";
import assert from "node:assert/strict";
import { safeInternalPath } from "../roles";

test("safeInternalPath only allows internal relative routes", () => {
  assert.equal(safeInternalPath("/portal", "/login"), "/portal");
  assert.equal(safeInternalPath("/reception/appointments", "/login"), "/reception/appointments");
  assert.equal(safeInternalPath("https://evil.example", "/login"), "/login");
  assert.equal(safeInternalPath("//evil.example", "/login"), "/login");
  assert.equal(safeInternalPath("javascript:alert(1)", "/login"), "/login");
  assert.equal(safeInternalPath("", "/login"), "/login");
  assert.equal(safeInternalPath("\\evil\\path", "/login"), "/login");
});
