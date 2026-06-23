"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button onClick={() => disconnect()}>
        {address.slice(0, 6)}…{address.slice(-4)} · Disconnect
      </button>
    );
  }

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      {connectors.map((c) => (
        <button key={c.uid} onClick={() => connect({ connector: c })} disabled={isPending}>
          Connect {c.name}
        </button>
      ))}
    </div>
  );
}
