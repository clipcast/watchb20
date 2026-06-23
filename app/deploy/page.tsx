"use client";

export const dynamic = "force-dynamic";


import { useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ConnectWallet } from "@/components/ConnectWallet";
import { DeployForm } from "@/components/deploy/DeployForm";
import { DeployAdvanced } from "@/components/deploy/DeployAdvanced";

type Tab = "simple" | "advanced";

export default function DeployPage() {
  const { isConnected } = useAccount();
  const [tab, setTab] = useState<Tab>("simple");

  return (
    <main className="min-h-screen bg-[#07080d] text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.08)]">
        <Link href="/" className="font-bold text-lg">WatchB20</Link>
        <ConnectWallet />
      </nav>

      <section className="px-6 py-12 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold">Deploy B20 Token</h1>

        {!isConnected ? (
          <div className="wb-card p-6 mt-6 text-center">
            <p className="text-[rgba(200,196,188,0.6)] mb-4">
              Connect a wallet to deploy a token.
            </p>
            <ConnectWallet />
          </div>
        ) : (
          <>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setTab("simple")}
                className={`wb-btn text-sm ${tab === "simple" ? "wb-btn-primary" : "wb-btn-secondary"}`}
              >
                Simple
              </button>
              <button
                onClick={() => setTab("advanced")}
                className={`wb-btn text-sm ${tab === "advanced" ? "wb-btn-primary" : "wb-btn-secondary"}`}
              >
                Advanced
              </button>
            </div>

            <div className="mt-6">
              {tab === "simple" ? <DeployForm /> : <DeployAdvanced />}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
