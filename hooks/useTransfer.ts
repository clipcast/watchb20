"use client";

import { useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { B20_TOKEN_ABI } from "@/config/b20";

/** Transfer B20 tokens to another address. */
export function useTransfer(address?: `0x${string}`, decimals = 18) {
  const { writeContractAsync, isPending } = useWriteContract();

  async function transfer(to: `0x${string}`, amount: string) {
    if (!address) throw new Error("token address required");
    return writeContractAsync({
      address,
      abi: B20_TOKEN_ABI,
      functionName: "transfer",
      args: [to, parseUnits(amount, decimals)],
    });
  }

  return { transfer, isPending };
}
