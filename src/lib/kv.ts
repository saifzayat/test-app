import { Redis } from "@upstash/redis";

const url =
  process.env.KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL;

const token =
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN;

export const isKvConfigured = Boolean(url && token);

export const kv = isKvConfigured
  ? new Redis({
      url: url!,
      token: token!,
    })
  : null;

export const PORTFOLIO_KV_KEY = "portfolio_data";

export async function getPortfolioFromKV() {
  if (!kv) return null;
  try {
    const data = await kv.get(PORTFOLIO_KV_KEY);
    if (!data) return null;
    // Upstash Redis automatically parses JSON if it was set as an object,
    // but in case it was stored as a string:
    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    }
    return data;
  } catch (err) {
    console.error("Error reading from KV:", err);
    return null;
  }
}

export async function setPortfolioInKV(data: unknown) {
  if (!kv) {
    throw new Error(
      "Vercel KV / Upstash Redis is not configured. Add KV_REST_API_URL and KV_REST_API_TOKEN in your Vercel project environment variables."
    );
  }
  await kv.set(PORTFOLIO_KV_KEY, data);
}
