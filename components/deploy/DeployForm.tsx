"use client";

import { useState } from "react";
import { useDeployB20 } from "@/hooks/useDeployB20";

export function DeployForm() {
  const { deploy, isDeploying, result } = useDeployB20();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await deploy({ name, symbol });
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: "0.75rem" }}>
      <input placeholder="Token name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
      <button type="submit" disabled={isDeploying}>
        {isDeploying ? "Deploying…" : "Deploy"}
      </button>
      {result?.address && <p>Deployed at: {result.address}</p>}
      {result?.error && <p style={{ color: "crimson" }}>{result.error}</p>}
    </form>
  );
}
