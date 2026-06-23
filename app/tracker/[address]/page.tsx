"use client";

import { TokenStats } from "@/components/tracker/TokenStats";
import { SupplyBar } from "@/components/tracker/SupplyBar";
import { HolderLookup } from "@/components/tracker/HolderLookup";

export default function TrackerPage({
  params,
}: {
  params: { address: string };
}) {
  const address = params.address as `0x${string}`;

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem" }}>
      <h1>Token Dashboard</h1>
      <p style={{ fontFamily: "monospace", opacity: 0.7 }}>{address}</p>
      <TokenStats address={address} />
      <SupplyBar address={address} />
      <HolderLookup address={address} />
    </main>
  );
}
