"use client";

import { useState } from "react";
import { DeployForm } from "@/components/deploy/DeployForm";
import { DeployAdvanced } from "@/components/deploy/DeployAdvanced";

export default function DeployPage() {
  const [advanced, setAdvanced] = useState(false);

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "2rem" }}>
      <h1>Deploy B20</h1>
      <label style={{ display: "block", margin: "1rem 0" }}>
        <input
          type="checkbox"
          checked={advanced}
          onChange={(e) => setAdvanced(e.target.checked)}
        />{" "}
        Advanced mode
      </label>
      {advanced ? <DeployAdvanced /> : <DeployForm />}
    </main>
  );
}
