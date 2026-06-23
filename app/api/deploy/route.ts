import { NextRequest, NextResponse } from "next/server";
import { runForgeDeploy } from "@/lib/forge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, symbol, maxSupply } = body ?? {};

    if (!name || !symbol) {
      return NextResponse.json(
        { error: "name and symbol are required" },
        { status: 400 }
      );
    }

    const result = await runForgeDeploy({ name, symbol, maxSupply });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "deploy failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
