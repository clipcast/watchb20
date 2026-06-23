"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

/**
 * EIP-5792 wallet capabilities detection.
 * Checks whether the connected wallet supports atomic batch calls.
 */
export function useWalletCapabilities() {
  const { connector, address, chainId } = useAccount();
  const [supportsBatch, setSupportsBatch] = useState(false);
  const [capabilities, setCapabilities] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (!connector || !address) return;
      try {
        const provider: any = await connector.getProvider();
        const caps = await provider.request({
          method: "wallet_getCapabilities",
          params: [address],
        });
        if (cancelled) return;
        setCapabilities(caps);
        const chainCaps = chainId ? caps?.[`0x${chainId.toString(16)}`] : undefined;
        setSupportsBatch(Boolean(chainCaps?.atomicBatch?.supported));
      } catch {
        if (!cancelled) setSupportsBatch(false);
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [connector, address, chainId]);

  return { supportsBatch, capabilities };
}
