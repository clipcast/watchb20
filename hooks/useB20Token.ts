"use client";

import { useReadContracts } from "wagmi";
import { B20_TOKEN_ABI } from "@/config/b20";

export interface B20TokenData {
  name?: string;
  symbol?: string;
  decimals?: number;
  totalSupply?: bigint;
  maxSupply?: bigint;
}

/** Read core B20 token data for a given token address. */
export function useB20Token(address?: `0x${string}`) {
  const enabled = Boolean(address);
  const contract = { address, abi: B20_TOKEN_ABI } as const;

  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      { ...contract, functionName: "name" },
      { ...contract, functionName: "symbol" },
      { ...contract, functionName: "decimals" },
      { ...contract, functionName: "totalSupply" },
      { ...contract, functionName: "maxSupply" },
    ],
    query: { enabled },
  });

  const token: B20TokenData = {
    name: data?.[0]?.result as string | undefined,
    symbol: data?.[1]?.result as string | undefined,
    decimals: data?.[2]?.result as number | undefined,
    totalSupply: data?.[3]?.result as bigint | undefined,
    maxSupply: data?.[4]?.result as bigint | undefined,
  };

  return { token, isLoading, refetch };
}
