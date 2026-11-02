import { NextResponse } from "next/server";
import { isValidEmail, waitlistInterests, type WaitlistInterest, type WaitlistResult } from "@/lib/waitlist";

function respond(result: WaitlistResult, status: number) {
  return NextResponse.json(result, { status });
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const { email, interest, company } = (body ?? {}) as Record<string, unknown>;

  // Hidden field. Bots fill it in; accept quietly and drop the submission.
  if (company) return respond({ ok: true }, 200);

  if (!isValidEmail(email)) return respond({ ok: false, code: "invalid_email" }, 400);

  const webhook = process.env.WAITLIST_WEBHOOK_URL;
  if (!webhook) return respond({ ok: false, code: "not_connected" }, 503);

  const safeInterest: WaitlistInterest = waitlistInterests.includes(interest as WaitlistInterest)
    ? (interest as WaitlistInterest)
    : "general";

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        interest: safeInterest,
        submittedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return respond({ ok: false, code: "delivery_failed" }, 502);
  } catch {
    return respond({ ok: false, code: "delivery_failed" }, 502);
  }

  return respond({ ok: true }, 200);
}
