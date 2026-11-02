"use client";

import { useId, useState, type FormEvent } from "react";
import { site } from "@/content/site";
import type { WaitlistInterest, WaitlistResult } from "@/lib/waitlist";
import { isValidEmail } from "@/lib/waitlist";
import { buttonStyles } from "./ui";

type Status = "idle" | "sending" | "joined" | "invalid_email" | "not_connected" | "delivery_failed";

function Fallback({ children }: { children: string }) {
  return (
    <>
      {children}{" "}
      <a className="text-link" href={`mailto:${site.email}?subject=Prodify%20waitlist`}>
        Email {site.email}
      </a>{" "}
      and we will tell you first.
    </>
  );
}

export function WaitlistForm({
  interest,
  connected,
  label = "Join the waitlist",
  stacked = false,
}: {
  interest: WaitlistInterest;
  connected: boolean;
  label?: string;
  stacked?: boolean;
}) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = data.get("email");
    if (!isValidEmail(email)) {
      setStatus("invalid_email");
      form.querySelector("input")?.focus();
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, interest, company: data.get("company") }),
      });
      const result = (await response.json()) as WaitlistResult;
      setStatus(result.ok ? "joined" : result.code);
    } catch {
      setStatus("delivery_failed");
    }
  }

  if (status === "joined") {
    return (
      <p role="status" className="border-t border-brand pt-4 font-medium text-fg">
        You are on the list. We will email you when it opens.
      </p>
    );
  }

  const hasError = status === "invalid_email";
  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-fg">
        Email address
      </label>
      <div className={`flex flex-col gap-2 ${stacked ? "" : "sm:flex-row"}`}>
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          spellCheck={false}
          required
          placeholder="you@studio.com"
          aria-invalid={hasError}
          aria-describedby={`${id}-message`}
          className="min-h-12 min-w-0 flex-1 rounded-control border border-line-strong bg-surface px-4 text-base text-fg placeholder:text-fg-muted focus:border-fg-muted"
        />
        <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button type="submit" disabled={status === "sending"} className={`${buttonStyles.primary} shrink-0 disabled:opacity-60`}>
          {status === "sending" ? "Sending…" : label}
        </button>
      </div>
      <p id={`${id}-message`} role="status" className="mt-3 text-sm text-fg-muted">
        {status === "invalid_email" ? <span className="text-fg">Enter a full email address, like name@studio.com.</span> : null}
        {status === "not_connected" ? (
          <span className="text-fg">
            <Fallback>The waitlist is not connected yet, so your address was not saved.</Fallback>
          </span>
        ) : null}
        {status === "delivery_failed" ? (
          <span className="text-fg">
            <Fallback>Your address could not be saved. Try again in a moment.</Fallback>
          </span>
        ) : null}
        {status === "idle" || status === "sending" ? (
          connected ? (
            "We only use your address to tell you about Prodify releases. Unsubscribe at any time."
          ) : (
            <Fallback>Preview: signups are not stored yet.</Fallback>
          )
        ) : null}
      </p>
    </form>
  );
}
