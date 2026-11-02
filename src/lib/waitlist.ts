export const waitlistInterests = ["membership", "plugins", "sounds", "general"] as const;
export type WaitlistInterest = (typeof waitlistInterests)[number];

export type WaitlistResult =
  | { ok: true }
  | { ok: false; code: "invalid_email" | "not_connected" | "delivery_failed" };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && value.length <= 254 && emailPattern.test(value.trim());
}

export function isWaitlistConnected(): boolean {
  return Boolean(process.env.WAITLIST_WEBHOOK_URL);
}
