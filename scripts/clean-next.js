#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..", ".next");
try {
  fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3, retryDelay: 500 });
  console.log("Cleaned .next");
} catch (e) {
  if (e.code === "ENOENT") return;
  if (e.code === "ENOTEMPTY" || e.code === "EBUSY") {
    console.error("\nCould not delete .next — the dev server may still be running.");
    console.error("Stop it with Ctrl+C, then run: npm run dev:clean\n");
    process.exit(1);
  }
  throw e;
}
