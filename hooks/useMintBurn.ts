"use client";

import { useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { B20_TOKEN_ABI } from "@/config/b20";

/** Mint or burn B20 tokens. */
export function useMintBurn(address?: `0x${string}`, decimals = 18) {
  const { writeContractAsync, isPending } = useWriteContract();

  async function mint(to: `0x${string}`, amount: string) {
    if (!address) throw new Error("token address required");
    return writeContractAsync({
      address,
      abi: B20_TOKEN_ABI,
      functionName: "mint",
      args: [to, parseUnits(amount, decimals)],
    });
  }

  async function burn(amount: string) {
    if (!address) throw new Error("token address required");
    return writeContractAsync({
      address,
      abi: B20_TOKEN_ABI,
      functionName: "burn",
      args: [parseUnits(amount, decimals)],
    });
  }

  return { mint, burn, isPending };
}
