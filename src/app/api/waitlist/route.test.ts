import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const post = (body: unknown) =>
  POST(new Request("http://test/api/waitlist", { method: "POST", body: JSON.stringify(body) }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("POST /api/waitlist", () => {
  it("rejects an invalid address", async () => {
    const response = await post({ email: "nope" });
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ ok: false, code: "invalid_email" });
  });

  it("reports that nothing was saved when no provider is connected", async () => {
    vi.stubEnv("WAITLIST_WEBHOOK_URL", "");
    const response = await post({ email: "a@studio.com" });
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ ok: false, code: "not_connected" });
  });

  it("forwards a valid signup to the webhook", async () => {
    vi.stubEnv("WAITLIST_WEBHOOK_URL", "https://hook.test/in");
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await post({ email: " A@Studio.com ", interest: "membership" });
    expect(response.status).toBe(200);
    const sent = JSON.parse(fetchMock.mock.calls[0]?.[1].body as string);
    expect(sent).toMatchObject({ email: "a@studio.com", interest: "membership" });
  });

  it("reports a failed delivery instead of claiming success", async () => {
    vi.stubEnv("WAITLIST_WEBHOOK_URL", "https://hook.test/in");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 })));
    const response = await post({ email: "a@studio.com" });
    expect(response.status).toBe(502);
  });

  it("drops bot submissions without contacting the provider", async () => {
    vi.stubEnv("WAITLIST_WEBHOOK_URL", "https://hook.test/in");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await post({ email: "a@studio.com", company: "spam" });
    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
