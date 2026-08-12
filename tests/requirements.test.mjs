import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("all assessment routes are declared", async () => {
  const app = await read("app/dashboard-app.tsx");
  for (const route of ["/login", "/forgot-password", "/reset-password", "/dashboard", "/patients", "/doctors", "/appointments", "/beds", "/pharmacy", "/billing", "/notifications", "/profile"]) {
    assert.match(app, new RegExp(`path=\\"${route.replace("/", "\\/")}\\"`), `missing ${route}`);
  }
  assert.match(app, /ProtectedRoute/);
  assert.match(app, /NotFoundPage/);
});

test("state layer exposes CRUD for every requested operational module", async () => {
  const slice = await read("store/slices/appSlice.ts");
  for (const entity of ["Patient", "Doctor", "Appointment", "Bed", "Medicine", "Invoice"]) {
    for (const action of ["add", "update", "delete"]) assert.match(slice, new RegExp(`${action}${entity}`));
  }
  assert.match(slice, /markAllNotificationsRead/);
  assert.match(slice, /toggleTheme/);
  assert.match(slice, /resetDemoData/);
});

test("submission documentation and deployment fallbacks exist", async () => {
  const readme = await read("README.md");
  const vercel = await read("vercel.json");
  assert.match(readme, /admin@medicore\.com/);
  assert.match(readme, /admin123/);
  assert.match(readme, /Redux Toolkit/);
  assert.match(vercel, /nextjs/);
  assert.match(vercel, /build:vercel/);
});
