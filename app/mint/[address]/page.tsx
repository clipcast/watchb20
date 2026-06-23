"use client";

export const dynamic = "force-dynamic";


import Link from "next/link";
import { useAccount, useReadContracts } from "wagmi";
import { ConnectWallet } from "@/components/ConnectWallet";
import { MintForm } from "@/components/mint/MintForm";
import { BurnForm } from "@/components/mint/BurnForm";
import { B20_ABI, MINT_ROLE, BURN_ROLE } from "@/config/b20";

export default function MintPage({
  params,
}: {
  params: { address: string };
}) {
  const { address: account, isConnected } = useAccount();
  const isValid = /^0x[a-fA-F0-9]{40}$/.test(params.address);
  const token = params.address as `0x${string}`;

  const { data } = useReadContracts({
    contracts: [
      {
        address: token,
        abi: B20_ABI,
        functionName: "hasRole",
        args: [MINT_ROLE, account ?? "0x0000000000000000000000000000000000000000"],
      },
      {
        address: token,
        abi: B20_ABI,
        functionName: "hasRole",
        args: [BURN_ROLE, account ?? "0x0000000000000000000000000000000000000000"],
      },
    ],
    query: { enabled: isValid && Boolean(account) },
  });

  const hasMint = (data?.[0]?.result as boolean | undefined) ?? false;
  const hasBurn = (data?.[1]?.result as boolean | undefined) ?? false;

  return (
    <main className="min-h-screen bg-[#07080d] text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.08)]">
        <Link href="/" className="font-bold text-lg">WatchB20</Link>
        <ConnectWallet />
      </nav>

      <section className="px-6 py-12 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold">Mint / Burn</h1>
        <p className="text-sm font-mono text-[rgba(200,196,188,0.6)] mt-1 break-all">{token}</p>

        {!isValid ? (
          <p className="mt-6" style={{ color: "#ef4444" }}>Invalid token address.</p>
        ) : !isConnected ? (
          <div className="wb-card p-6 mt-6 text-center">
            <p className="text-[rgba(200,196,188,0.6)] mb-4">Connect a wallet to continue.</p>
            <ConnectWallet />
          </div>
        ) : !hasMint && !hasBurn ? (
          <div className="wb-card p-6 mt-6 text-center text-[rgba(200,196,188,0.6)]">
            You don&apos;t have mint or burn permissions for this token.
          </div>
        ) : (
          <div className="mt-6 grid gap-6">
            {hasMint && <MintForm tokenAddress={token} />}
            {hasBurn && <BurnForm tokenAddress={token} />}
          </div>
        )}
      </section>
    </main>
  );
}
