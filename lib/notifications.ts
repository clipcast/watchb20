const BASE_API = "https://dashboard.base.org/api/v1";

export interface NotificationPayload {
  walletAddresses: string[];
  title: string;
  message: string;
  targetPath?: string;
  appUrl?: string;
}

export interface NotificationResult {
  success: boolean;
  sentCount: number;
  failedCount: number;
  results?: unknown;
  error?: string;
}

export interface UserStatus {
  walletAddress: string;
  notificationEnabled: boolean;
}

/** Send a notification by calling our own /api/notify route (keeps API key server-side). */
export async function sendNotification(
  payload: NotificationPayload
): Promise<NotificationResult> {
  const res = await fetch("/api/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return (await res.json()) as NotificationResult;
}

/** Check a single user's notification opt-in status. */
export async function getUserNotificationStatus(
  walletAddress: string,
  appUrl: string
): Promise<UserStatus> {
  const url = `${BASE_API}/notifications/app/user/status?address=${encodeURIComponent(
    walletAddress
  )}&app_url=${encodeURIComponent(appUrl)}`;
  const res = await fetch(url, {
    headers: { "x-api-key": process.env.BASE_NOTIFICATIONS_API_KEY ?? "" },
  });
  const data = (await res.json()) as { notification_enabled?: boolean };
  return {
    walletAddress,
    notificationEnabled: Boolean(data.notification_enabled),
  };
}

/** List wallet addresses that have opted in to notifications for this app. */
export async function getOptedInUsers(appUrl: string): Promise<string[]> {
  const url = `${BASE_API}/notifications/app/users?notification_enabled=true&app_url=${encodeURIComponent(
    appUrl
  )}`;
  const res = await fetch(url, {
    headers: { "x-api-key": process.env.BASE_NOTIFICATIONS_API_KEY ?? "" },
  });
  const data = (await res.json()) as { users?: { address: string }[] };
  return (data.users ?? []).map((u) => u.address);
}
