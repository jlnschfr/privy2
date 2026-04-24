import Parser from "rss-parser";
import type { Handler } from "@netlify/functions";
import { requireUser } from "../_shared/auth";

const MAX_BYTES = 5_000_000;

export const handler: Handler = async (event) => {
  const { response: authResponse } = await requireUser(event);
  if (authResponse) return authResponse;

  const { url } = event.queryStringParameters ?? {};
  if (!url || typeof url !== "string") {
    return { statusCode: 400, body: "{}" };
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { statusCode: 400, body: "{}" };
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { statusCode: 400, body: "{}" };
  }

  try {
    const response = await fetch(parsed, { redirect: "follow" });
    if (!response.ok || !response.body) {
      return { statusCode: 400, body: "{}" };
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) {
        await reader.cancel();
        return { statusCode: 413, body: "{}" };
      }
      chunks.push(value);
    }
    const text = new TextDecoder().decode(
      chunks.reduce<Uint8Array>((acc, c) => {
        const merged = new Uint8Array(acc.length + c.length);
        merged.set(acc);
        merged.set(c, acc.length);
        return merged;
      }, new Uint8Array()),
    );

    const parser: Parser = new Parser();
    const feed = await parser.parseString(text);

    return {
      statusCode: 200,
      body: JSON.stringify(feed),
    };
  } catch {
    return { statusCode: 400, body: "{}" };
  }
};
