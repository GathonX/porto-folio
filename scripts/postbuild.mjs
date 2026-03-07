import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const sourceFile = path.join(projectRoot, "send_email.php");
const distDir = path.join(projectRoot, "dist");
const targetFile = path.join(distDir, "send_email.php");
const logsDir = path.join(distDir, "storage", "logs");

try {
  await mkdir(logsDir, { recursive: true });
  await copyFile(sourceFile, targetFile);
  console.log(`[postbuild] Copied ${sourceFile} -> ${targetFile}`);
} catch (error) {
  console.error("[postbuild] Failed to copy PHP backend files:", error);
  process.exit(1);
}
