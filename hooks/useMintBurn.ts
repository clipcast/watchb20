"use client";

import { useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useSendCalls,
} from "wagmi";
import { parseUnits, encodeFunctionData, type Hash } from "viem";
import { B20_ABI } from "@/config/b20";
import { useWalletCapabilities } from "./useWalletCapabilities";

export interface UseMintBurn {
  mint: (to: `0x${string}`, amount: string, decimals: number) => Promise<void>;
  burn: (amount: string, decimals: number) => Promise<void>;
  batchMint: (
    entries: { to: `0x${string}`; amount: string }[],
    decimals: number,
    tokenAddress: `0x${string}`
  ) => Promise<void>;
  isMinting: boolean;
  isBurning: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  txHash?: Hash;
  error?: string;
}

/** Mint and burn B20 tokens, with smart-wallet batch support. */
export function useMintBurn(tokenAddress: `0x${string}`): UseMintBurn {
  const { writeContractAsync, isPending } = useWriteContract();
  const { sendCallsAsync } = useSendCalls();
  const { supportsBatching } = useWalletCapabilities();

  const [txHash, setTxHash] = useState<Hash | undefined>();
  const [isMinting, setIsMinting] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  async function mint(
    to: `0x${string}`,
    amount: string,
    decimals: number
  ): Promise<void> {
    setError(undefined);
    setIsMinting(true);
    try {
      const hash = await writeContractAsync({
        address: tokenAddress,
        abi: B20_ABI,
        functionName: "mint",
        args: [to, parseUnits(amount, decimals)],
      });
      setTxHash(hash);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "mint failed");
    } finally {
      setIsMinting(false);
    }
  }

  async function burn(amount: string, decimals: number): Promise<void> {
    setError(undefined);
    setIsBurning(true);
    try {
      const hash = await writeContractAsync({
        address: tokenAddress,
        abi: B20_ABI,
        functionName: "burn",
        args: [parseUnits(amount, decimals)],
      });
      setTxHash(hash);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "burn failed");
    } finally {
      setIsBurning(false);
    }
  }

  async function batchMint(
    entries: { to: `0x${string}`; amount: string }[],
    decimals: number,
    token: `0x${string}`
  ): Promise<void> {
    if (!supportsBatching) {
      setError("Connected wallet does not support batched calls");
      return;
    }
    setError(undefined);
    setIsMinting(true);
    try {
      await sendCallsAsync({
        calls: entries.map((e) => ({
          to: token,
          data: encodeFunctionData({
            abi: B20_ABI,
            functionName: "mint",
            args: [e.to, parseUnits(e.amount, decimals)],
          }),
        })),
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "batch mint failed");
    } finally {
      setIsMinting(false);
    }
  }

  return {
    mint,
    burn,
    batchMint,
    isMinting,
    isBurning,
    isConfirming,
    isSuccess,
    txHash,
    error,
  };
}
