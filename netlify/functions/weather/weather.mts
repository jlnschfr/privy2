import { createClient } from "@supabase/supabase-js";
import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  const token = authHeader?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return { statusCode: 401, body: JSON.stringify({}) };
  }

  const anonClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
  );
  const {
    data: { user },
    error: authError,
  } = await anonClient.auth.getUser(token);
  if (authError || !user) {
    return { statusCode: 401, body: JSON.stringify({}) };
  }

  const { lat, long } = event.queryStringParameters ?? {};

  if (
    !lat ||
    !long ||
    !/^-?\d+(\.\d+)?$/.test(lat) ||
    !/^-?\d+(\.\d+)?$/.test(long)
  ) {
    return { statusCode: 400, body: JSON.stringify({}) };
  }

  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({}) };
  }

  const url = new URL("https://api.weatherapi.com/v1/current.json");
  url.searchParams.set("aqi", "no");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("q", `${lat},${long}`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { statusCode: 502, body: JSON.stringify({}) };
    }
    const json = await response.json();
    return { statusCode: 200, body: JSON.stringify(json) };
  } catch {
    return { statusCode: 502, body: JSON.stringify({}) };
  }
};
