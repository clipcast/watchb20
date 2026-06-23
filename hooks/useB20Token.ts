"use client";

import { useAccount, useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { B20_ABI } from "@/config/b20";

export interface B20TokenData {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  supplyCap: string;
  balance: string;
  totalSupplyRaw: bigint;
  supplyCapRaw: bigint;
  balanceRaw: bigint;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

/** Batch-read core B20 token data for a given token address. */
export function useB20Token(tokenAddress: `0x${string}`): B20TokenData {
  const { address: connected } = useAccount();
  const contract = { address: tokenAddress, abi: B20_ABI } as const;

  const { data, isLoading, isError, refetch } = useReadContracts({
    contracts: [
      { ...contract, functionName: "name" },
      { ...contract, functionName: "symbol" },
      { ...contract, functionName: "decimals" },
      { ...contract, functionName: "totalSupply" },
      { ...contract, functionName: "supplyCap" },
      {
        ...contract,
        functionName: "balanceOf",
        args: [connected ?? "0x0000000000000000000000000000000000000000"],
      },
    ],
    query: { enabled: Boolean(tokenAddress) },
  });

  const name = (data?.[0]?.result as string | undefined) ?? "";
  const symbol = (data?.[1]?.result as string | undefined) ?? "";
  const decimals = (data?.[2]?.result as number | undefined) ?? 18;
  const totalSupplyRaw = (data?.[3]?.result as bigint | undefined) ?? 0n;
  const supplyCapRaw = (data?.[4]?.result as bigint | undefined) ?? 0n;
  const balanceRaw = (data?.[5]?.result as bigint | undefined) ?? 0n;

  return {
    name,
    symbol,
    decimals,
    totalSupply: formatUnits(totalSupplyRaw, decimals),
    supplyCap: formatUnits(supplyCapRaw, decimals),
    balance: formatUnits(balanceRaw, decimals),
    totalSupplyRaw,
    supplyCapRaw,
    balanceRaw,
    isLoading,
    isError,
    refetch,
  };
}
