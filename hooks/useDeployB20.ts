"use client";

import { useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";
import { parseUnits, decodeEventLog, type Hash } from "viem";
import { B20_FACTORY_ADDRESS, B20_FACTORY_ABI } from "@/config/b20";

export interface DeployParams {
  name: string;
  symbol: string;
  decimals: number;
  supplyCap: string;
  adminAddress: `0x${string}`;
}

export interface UseDeployB20 {
  deploy: (params: DeployParams) => Promise<void>;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  tokenAddress?: `0x${string}`;
  txHash?: Hash;
  error?: string;
}

/** Deploy a new B20 token via the factory and parse the deployed address. */
export function useDeployB20(): UseDeployB20 {
  const publicClient = usePublicClient();
  const { writeContractAsync, isPending } = useWriteContract();
  const [txHash, setTxHash] = useState<Hash | undefined>();
  const [tokenAddress, setTokenAddress] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState<string | undefined>();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  async function deploy(params: DeployParams): Promise<void> {
    setError(undefined);
    setTokenAddress(undefined);
    try {
      const cap = parseUnits(params.supplyCap || "0", params.decimals);
      const hash = await writeContractAsync({
        address: B20_FACTORY_ADDRESS,
        abi: B20_FACTORY_ABI,
        functionName: "createB20",
        args: [
          params.name,
          params.symbol,
          params.decimals,
          cap,
          params.adminAddress,
        ],
      });
      setTxHash(hash);

      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        for (const log of receipt.logs) {
          try {
            const parsed = decodeEventLog({
              abi: B20_FACTORY_ABI,
              data: log.data,
              topics: log.topics,
            });
            if (parsed.eventName === "B20Created") {
              const args = parsed.args as unknown as { token: `0x${string}` };
              setTokenAddress(args.token);
              break;
            }
          } catch {
            // not the event we want — skip
          }
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "deploy failed");
    }
  }

  return {
    deploy,
    isPending,
    isConfirming,
    isSuccess,
    tokenAddress,
    txHash,
    error,
  };
}
