import { describe, expect, it } from "vitest";

describe("Supabase connection", () => {
  it("can reach the Bean and Brew menu endpoint with the configured publishable key", async () => {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    expect(url).toBeTruthy();
    expect(key).toBeTruthy();

    const response = await fetch(`${url}/rest/v1/menu_categories?select=id&limit=1`, {
      headers: {
        apikey: key as string,
        Authorization: `Bearer ${key}`,
      },
    });

    expect(response.ok).toBe(true);
  }, 15_000);
});
