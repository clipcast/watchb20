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

export interface TransferEntry {
  to: `0x${string}`;
  amount: string;
}

export interface UseTransfer {
  transfer: (to: `0x${string}`, amount: string, decimals: number) => Promise<void>;
  batchTransfer: (entries: TransferEntry[], decimals: number) => Promise<void>;
  supportsBatching: boolean;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  txHash?: Hash;
  error?: string;
}

/** Transfer B20 tokens, with smart-wallet multi-transfer batch support. */
export function useTransfer(tokenAddress: `0x${string}`): UseTransfer {
  const { writeContractAsync, isPending } = useWriteContract();
  const { sendCallsAsync } = useSendCalls();
  const { supportsBatching } = useWalletCapabilities();

  const [txHash, setTxHash] = useState<Hash | undefined>();
  const [error, setError] = useState<string | undefined>();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  async function transfer(
    to: `0x${string}`,
    amount: string,
    decimals: number
  ): Promise<void> {
    setError(undefined);
    try {
      const hash = await writeContractAsync({
        address: tokenAddress,
        abi: B20_ABI,
        functionName: "transfer",
        args: [to, parseUnits(amount, decimals)],
      });
      setTxHash(hash);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "transfer failed");
    }
  }

  async function batchTransfer(
    entries: TransferEntry[],
    decimals: number
  ): Promise<void> {
    if (!supportsBatching) {
      setError("Connected wallet does not support batched calls");
      return;
    }
    setError(undefined);
    try {
      await sendCallsAsync({
        calls: entries.map((e) => ({
          to: tokenAddress,
          data: encodeFunctionData({
            abi: B20_ABI,
            functionName: "transfer",
            args: [e.to, parseUnits(e.amount, decimals)],
          }),
        })),
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "batch transfer failed");
    }
  }

  return {
    transfer,
    batchTransfer,
    supportsBatching,
    isPending,
    isConfirming,
    isSuccess,
    txHash,
    error,
  };
}
