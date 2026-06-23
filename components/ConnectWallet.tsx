"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

function truncate(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function ConnectWallet() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnecting || isReconnecting) {
    return (
      <button className="wb-btn wb-btn-secondary" disabled>
        Connecting…
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="wb-btn font-mono text-sm"
        style={{ border: "1px solid #3b82f6", background: "transparent", color: "#f0ede6" }}
      >
        {truncate(address)} · Disconnect
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="wb-btn wb-btn-primary text-sm"
        >
          {isPending ? "…" : connector.name}
        </button>
      ))}
    </div>
  );
}
