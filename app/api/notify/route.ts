import { NextRequest, NextResponse } from "next/server";

const BASE_NOTIFY_URL = "https://dashboard.base.org/api/v1/notifications/send";

interface NotifyBody {
  walletAddresses: string[];
  title: string;
  message: string;
  targetPath?: string;
  appUrl?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as NotifyBody;

    if (!body.title || body.title.length > 30) {
      return NextResponse.json(
        { success: false, error: "title is required and must be <= 30 chars" },
        { status: 400 }
      );
    }
    if (!body.message || body.message.length > 200) {
      return NextResponse.json(
        { success: false, error: "message is required and must be <= 200 chars" },
        { status: 400 }
      );
    }
    if (!Array.isArray(body.walletAddresses) || body.walletAddresses.length === 0) {
      return NextResponse.json(
        { success: false, error: "walletAddresses is required" },
        { status: 400 }
      );
    }
    if (body.walletAddresses.length > 1000) {
      return NextResponse.json(
        { success: false, error: "max 1000 addresses per call" },
        { status: 400 }
      );
    }

    const apiKey = process.env.BASE_NOTIFICATIONS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "BASE_NOTIFICATIONS_API_KEY not configured" },
        { status: 500 }
      );
    }

    const res = await fetch(BASE_NOTIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        addresses: body.walletAddresses,
        title: body.title,
        body: body.message,
        target_path: body.targetPath ?? "/",
        app_url: body.appUrl,
      }),
    });

    if (res.status === 429) {
      const retryAfter = res.headers.get("retry-after") ?? "60";
      return NextResponse.json(
        { success: false, error: "rate limited", retryAfter },
        { status: 429, headers: { "retry-after": retryAfter } }
      );
    }

    const data = (await res.json().catch(() => ({}))) as {
      sent?: number;
      failed?: number;
      results?: unknown;
    };

    return NextResponse.json({
      success: res.ok,
      sentCount: data.sent ?? body.walletAddresses.length,
      failedCount: data.failed ?? 0,
      results: data.results ?? null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "notify failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
