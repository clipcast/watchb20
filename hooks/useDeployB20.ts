"use client";

import { useState } from "react";

export interface DeployInput {
  name: string;
  symbol: string;
  maxSupply?: string;
}

export interface DeployResponse {
  address?: string;
  txHash?: string;
  raw?: string;
  error?: string;
}

/** Deploy a B20 token via the /api/deploy backend (runs base-forge). */
export function useDeployB20() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [result, setResult] = useState<DeployResponse | null>(null);

  async function deploy(input: DeployInput) {
    setIsDeploying(true);
    setResult(null);
    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data: DeployResponse = await res.json();
      setResult(data);
      return data;
    } finally {
      setIsDeploying(false);
    }
  }

  return { deploy, isDeploying, result };
}
