"use client";

import { TransferForm } from "@/components/transfer/TransferForm";

export default function TransferPage() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "2rem" }}>
      <h1>Transfer &amp; Payment</h1>
      <TransferForm />
    </main>
  );
}
