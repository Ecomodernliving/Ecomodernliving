import { rmSync, existsSync } from "fs";
import { join } from "path";

const dirs = [".next", "node_modules/.cache"];

for (const dir of dirs) {
  const path = join(process.cwd(), dir);
  if (existsSync(path)) {
    rmSync(path, { recursive: true, force: true });
    console.log(`Removed ${dir}`);
  }
}
