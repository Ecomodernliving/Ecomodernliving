/**
 * Dev server — auto-clears .next when the project lives in OneDrive,
 * where sync corrupts Next.js cache and causes Internal Server Error.
 */
import { existsSync, rmSync } from "fs";
import { join } from "path";
import { spawn } from "child_process";

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

const child = spawn("npx", ["next", "dev", "--turbo"], {
  stdio: "inherit",
  shell: true,
  cwd,
});

child.on("exit", (code) => process.exit(code ?? 0));
