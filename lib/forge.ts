import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export interface DeployParams {
  name: string;
  symbol: string;
  maxSupply?: string;
}

export interface DeployResult {
  address?: string;
  txHash?: string;
  raw: string;
}

/**
 * Run the base-forge CLI to deploy a B20 token contract.
 * Server-side only. Requires BASE_FORGE_PATH and DEPLOYER_PRIVATE_KEY.
 */
export async function runForgeDeploy(
  params: DeployParams
): Promise<DeployResult> {
  const forge = process.env.BASE_FORGE_PATH ?? "base-forge";
  const { name, symbol, maxSupply = "0" } = params;

  // NOTE: arguments are passed positionally — adjust to your base-forge schema.
  const cmd = [
    forge,
    "deploy-b20",
    `--name ${JSON.stringify(name)}`,
    `--symbol ${JSON.stringify(symbol)}`,
    `--max-supply ${JSON.stringify(maxSupply)}`,
    "--json",
  ].join(" ");

  const { stdout } = await execAsync(cmd, {
    env: process.env,
    timeout: 120_000,
  });

  let address: string | undefined;
  let txHash: string | undefined;
  try {
    const parsed = JSON.parse(stdout);
    address = parsed.address ?? parsed.token;
    txHash = parsed.txHash ?? parsed.transactionHash;
  } catch {
    // base-forge did not return JSON — return raw output
  }

  return { address, txHash, raw: stdout };
}
