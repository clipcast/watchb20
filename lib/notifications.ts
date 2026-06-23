export interface NotifyParams {
  token: string;
  title: string;
  message?: string;
}

export interface NotifyResult {
  ok: boolean;
  status: number;
  body?: unknown;
}

/**
 * Wrapper around the Base Notifications API.
 * Requires BASE_NOTIFY_API_URL and BASE_NOTIFY_API_KEY.
 */
export async function sendBaseNotification(
  params: NotifyParams
): Promise<NotifyResult> {
  const url = process.env.BASE_NOTIFY_API_URL;
  const key = process.env.BASE_NOTIFY_API_KEY;

  if (!url || !key) {
    throw new Error(
      "BASE_NOTIFY_API_URL and BASE_NOTIFY_API_KEY must be set"
    );
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(params),
  });

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = await res.text();
  }

  return { ok: res.ok, status: res.status, body };
}
