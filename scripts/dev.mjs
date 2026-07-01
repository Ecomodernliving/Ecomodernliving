/**
 * Dev server — auto-clears .next when the project lives in OneDrive,
 * where sync corrupts Next.js cache and causes Internal Server Error.
 */
import { existsSync, readFileSync, rmSync } from "fs";
import { join } from "path";
import { spawn, spawnSync } from "child_process";

const cwd = process.cwd();
const isOneDrive = /OneDrive/i.test(cwd);

if (isOneDrive) {
  for (const dir of [".next", "node_modules/.cache"]) {
    const path = join(cwd, dir);
    if (existsSync(path)) {
      rmSync(path, { recursive: true, force: true });
      console.log(`Removed ${dir} (OneDrive cache reset)`);
    }
  }
}

const catalogPath = join(cwd, "src/data/marketplace-catalog.json");
if (existsSync(catalogPath)) {
  try {
    const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
    if (!catalog["energy-efficient-appliances"]?.length) {
      console.log("Importing energy-efficient appliances catalog…");
      spawnSync("node", ["scripts/import-energy-appliances.mjs"], {
        stdio: "inherit",
        cwd,
      });
    }
  } catch {
    // Catalog import is best-effort for local dev.
  }
}

const child = spawn("npx", ["next", "dev", "--turbo"], {
  stdio: "inherit",
  shell: true,
  cwd,
});

child.on("exit", (code) => process.exit(code ?? 0));
