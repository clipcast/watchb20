import { NextRequest, NextResponse } from "next/server";
import { runForgeScript } from "@/lib/forge";

export const maxDuration = 60;

interface DeployBody {
  name: string;
  symbol: string;
  decimals: number;
  supplyCap: string;
  adminAddress: string;
  salt?: string;
}

function buildScript(b: DeployBody): string {
  const salt = b.salt ?? "0x0";
  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";

interface IB20Factory {
    function createB20(
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 supplyCap,
        address admin
    ) external returns (address);
}

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();
        address token = IB20Factory(0xB20f00000000000000000000000000000000000F)
            .createB20("${b.name}", "${b.symbol}", ${b.decimals}, ${b.supplyCap}, ${b.adminAddress});
        console.log("token deployed at:", token);
        vm.stopBroadcast();
    }
}
// salt: ${salt}
`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as DeployBody;

    if (!body.name || !body.symbol) {
      return NextResponse.json(
        { success: false, error: "name and symbol are required" },
        { status: 400 }
      );
    }

    const script = buildScript(body);
    const result = await runForgeScript(script, {
      RPC_URL: process.env.NEXT_PUBLIC_RPC_URL ?? "https://sepolia.base.org",
    });

    if (!result.success || !result.tokenAddress) {
      return NextResponse.json(
        { success: false, error: result.output || "deploy failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, tokenAddress: result.tokenAddress });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "deploy failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
