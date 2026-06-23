import { spawn } from "node:child_process";
import { writeFile, unlink, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export interface ForgeResult {
  success: boolean;
  output: string;
  tokenAddress?: string;
}

const ADDRESS_RE = /(?:token deployed at|deployed to|contract address)[:\s]+(0x[a-fA-F0-9]{40})/i;

/**
 * Run a base-forge script from Node. Writes the script to a temp file,
 * spawns base-forge with the given env vars, parses the deployed address,
 * enforces a 60s timeout, and cleans up the temp file.
 */
export async function runForgeScript(
  scriptContent: string,
  envVars: Record<string, string>
): Promise<ForgeResult> {
  const dir = await mkdtemp(join(tmpdir(), "watchb20-"));
  const scriptPath = join(dir, "Deploy.s.sol");
  await writeFile(scriptPath, scriptContent, "utf8");

  return new Promise<ForgeResult>((resolve) => {
    const child = spawn(
      "base-forge",
      [
        "script",
        scriptPath,
        "--rpc-url",
        envVars.RPC_URL ?? "https://sepolia.base.org",
        "--broadcast",
      ],
      { env: { ...process.env, ...envVars } }
    );

    let output = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
    }, 60_000);

    child.stdout.on("data", (d: Buffer) => {
      output += d.toString();
    });
    child.stderr.on("data", (d: Buffer) => {
      output += d.toString();
    });

    child.on("close", async (code) => {
      clearTimeout(timer);
      await unlink(scriptPath).catch(() => {});
      const match = output.match(ADDRESS_RE);
      resolve({
        success: code === 0,
        output,
        tokenAddress: match?.[1],
      });
    });

    child.on("error", async (err) => {
      clearTimeout(timer);
      await unlink(scriptPath).catch(() => {});
      resolve({ success: false, output: err.message });
    });
  });
}
