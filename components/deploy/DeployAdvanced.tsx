"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useDeployB20 } from "@/hooks/useDeployB20";
import { EXPLORER_URL } from "@/config/b20";

export function DeployAdvanced() {
  const { address } = useAccount();
  const { deploy, isPending, isConfirming, isSuccess, tokenAddress, error } =
    useDeployB20();

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("");
  const [decimals, setDecimals] = useState(18);
  const [supplyCap, setSupplyCap] = useState("");
  const [grantMint, setGrantMint] = useState(true);
  const [grantBurn, setGrantBurn] = useState(false);
  const [adminAddress, setAdminAddress] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [validationError, setValidationError] = useState("");

  function validate(): boolean {
    if (!name.trim()) {
      setValidationError("Token name is required");
      return false;
    }
    if (symbol.length < 2 || symbol.length > 8) {
      setValidationError("Symbol must be 2-8 characters");
      return false;
    }
    if (!supply || Number(supply) <= 0) {
      setValidationError("Initial supply must be greater than 0");
      return false;
    }
    if (decimals < 6 || decimals > 18) {
      setValidationError("Decimals must be between 6 and 18");
      return false;
    }
    if (adminAddress && !/^0x[a-fA-F0-9]{40}$/.test(adminAddress)) {
      setValidationError("Admin address is not a valid address");
      return false;
    }
    setValidationError("");
    return true;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || !address) return;
    const admin = (adminAddress || address) as `0x${string}`;
    await deploy({
      name: name.trim(),
      symbol: symbol.trim(),
      decimals,
      supplyCap: supplyCap || supply,
      adminAddress: admin,
    });
  }

  return (
    <form onSubmit={onSubmit} className="wb-card p-6 grid gap-4">
      <div>
        <label className="block text-sm mb-1">Token Name</label>
        <input className="wb-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Token" />
      </div>
      <div>
        <label className="block text-sm mb-1">Token Symbol</label>
        <input
          className="wb-input font-mono"
          value={symbol}
          maxLength={8}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="MTK"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Initial Supply</label>
        <input className="wb-input" type="number" min="0" value={supply} onChange={(e) => setSupply(e.target.value)} placeholder="1000000" />
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced((s) => !s)}
        className="text-left text-sm text-[#3b82f6]"
      >
        {showAdvanced ? "▾" : "▸"} Advanced Settings
      </button>

      {showAdvanced && (
        <div className="grid gap-4 border-t border-[rgba(255,255,255,0.08)] pt-4">
          <div>
            <label className="block text-sm mb-1">Decimals (6-18)</label>
            <input
              className="wb-input"
              type="number"
              min="6"
              max="18"
              value={decimals}
              onChange={(e) => setDecimals(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Supply Cap (optional)</label>
            <input
              className="wb-input"
              type="number"
              min="0"
              value={supplyCap}
              onChange={(e) => setSupplyCap(e.target.value)}
              placeholder="Defaults to initial supply"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={grantMint} onChange={(e) => setGrantMint(e.target.checked)} />
            Grant MINT_ROLE to deployer
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={grantBurn} onChange={(e) => setGrantBurn(e.target.checked)} />
            Grant BURN_ROLE to deployer
          </label>
          <div>
            <label className="block text-sm mb-1">Additional Admin Address (optional)</label>
            <input
              className="wb-input font-mono"
              value={adminAddress}
              onChange={(e) => setAdminAddress(e.target.value)}
              placeholder="0x…"
            />
          </div>
        </div>
      )}

      {validationError && <p className="text-sm" style={{ color: "#ef4444" }}>{validationError}</p>}
      {error && <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>}

      <button type="submit" disabled={isPending || isConfirming} className="wb-btn wb-btn-primary">
        {isPending
          ? "Confirm in wallet…"
          : isConfirming
          ? "Waiting for confirmation…"
          : "Deploy Token (advanced)"}
      </button>

      {isSuccess && tokenAddress && (
        <div className="text-sm" style={{ color: "#22c55e" }}>
          Deployed at{" "}
          <a href={`${EXPLORER_URL}/address/${tokenAddress}`} target="_blank" rel="noreferrer" className="underline font-mono">
            {tokenAddress}
          </a>
        </div>
      )}
    </form>
  );
}
