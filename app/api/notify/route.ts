import { NextRequest, NextResponse } from "next/server";
import { sendBaseNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, title, message } = body ?? {};

    if (!token || !title) {
      return NextResponse.json(
        { error: "token and title are required" },
        { status: 400 }
      );
    }

    const result = await sendBaseNotification({ token, title, message });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "notify failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
