import { constants } from "node:fs";
import { access, copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const sourceFile = path.join(projectRoot, "send_email.php");
const distDir = path.join(projectRoot, "dist");
const targetFile = path.join(distDir, "send_email.php");
const envSourceFile = path.join(projectRoot, ".env");
const envTargetFile = path.join(distDir, ".env");
const logsDir = path.join(distDir, "storage", "logs");
const htaccessTargetFile = path.join(distDir, ".htaccess");
const htaccessContent = `# Protect sensitive deployment files
<Files ".env">
  Require all denied
</Files>

# Apache 2.2 fallback
<IfModule !mod_authz_core.c>
  <Files ".env">
    Order allow,deny
    Deny from all
  </Files>
</IfModule>
`;

try {
  await mkdir(logsDir, { recursive: true });
  await copyFile(sourceFile, targetFile);
  console.log(`[postbuild] Copied ${sourceFile} -> ${targetFile}`);

  try {
    await access(envSourceFile, constants.F_OK);
    await copyFile(envSourceFile, envTargetFile);
    console.log(`[postbuild] Copied ${envSourceFile} -> ${envTargetFile}`);
  } catch {
    console.warn(`[postbuild] Warning: ${envSourceFile} not found, .env was not copied`);
  }

  await writeFile(htaccessTargetFile, htaccessContent, "utf8");
  console.log(`[postbuild] Generated ${htaccessTargetFile} to block web access to .env`);
} catch (error) {
  console.error("[postbuild] Failed to copy PHP backend files:", error);
  process.exit(1);
}
