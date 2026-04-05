import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { execSync } from "node:child_process";

const rootDir = process.cwd();
const publicAppDir = resolve(rootDir, "apps", "public");
const adminAppDir = resolve(rootDir, "apps", "admin-next");
const publicDistDir = resolve(publicAppDir, "dist");
const adminDistDir = resolve(adminAppDir, "dist");
const deployDistDir = resolve(rootDir, "dist");
function runWorkspaceBuild(workspace) {
  execSync(`npm run build --workspace ${workspace}`, {
    cwd: rootDir,
    stdio: "inherit",
    shell: true,
  });
}

await rm(deployDistDir, { recursive: true, force: true });

runWorkspaceBuild("@exxonim/public");
runWorkspaceBuild("@exxonim/admin-next");

await mkdir(deployDistDir, { recursive: true });
await cp(publicDistDir, deployDistDir, { recursive: true });

const adminDeployDir = resolve(deployDistDir, "admin");
await rm(adminDeployDir, { recursive: true, force: true });
await cp(adminDistDir, adminDeployDir, { recursive: true });
