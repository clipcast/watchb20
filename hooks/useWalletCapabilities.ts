"use client";

import { useCapabilities } from "wagmi";
import { baseSepolia } from "wagmi/chains";

export interface WalletCapabilities {
  supportsBatching: boolean;
  supportsPaymaster: boolean;
}

/** EIP-5792 wallet capability detection (atomic batch + paymaster). */
export function useWalletCapabilities(): WalletCapabilities {
  const { data } = useCapabilities();

  const chainCaps = data?.[baseSepolia.id] as
    | {
        atomic?: { status?: string };
        paymasterService?: { supported?: boolean };
      }
    | undefined;

  const atomicStatus = chainCaps?.atomic?.status;
  const supportsBatching =
    atomicStatus === "ready" || atomicStatus === "supported";
  const supportsPaymaster = chainCaps?.paymasterService?.supported === true;

  return { supportsBatching, supportsPaymaster };
}
