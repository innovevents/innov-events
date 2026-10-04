export default async function handler(req, res) {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin === "null" ? "*" : origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const wpUrl = new URL("https://innov-events.free.nf/wp-json/wp/v2/posts");
  for (const [key, value] of Object.entries(req.query || {})) {
    if (Array.isArray(value)) {
      value.forEach((v) => wpUrl.searchParams.append(key, v));
    } else if (value !== undefined) {
      wpUrl.searchParams.set(key, value);
    }
  }

  // Keep the API response compatible with the current frontend.
  if (!wpUrl.searchParams.has("per_page")) wpUrl.searchParams.set("per_page", "100");
  if (!wpUrl.searchParams.has("orderby")) wpUrl.searchParams.set("orderby", "date");
  if (!wpUrl.searchParams.has("order")) wpUrl.searchParams.set("order", "desc");
  if (!wpUrl.searchParams.has("_embed")) wpUrl.searchParams.set("_embed", "1");

  try {
    const response = await fetch(wpUrl.toString(), {
      headers: { Accept: "application/json" },
    });
    const body = await response.text();
    res.status(response.status);
    res.setHeader("Content-Type", response.headers.get("content-type") || "application/json; charset=utf-8");
    return res.send(body);
  } catch (error) {
    console.error("WordPress proxy error:", error);
    return res.status(502).json({ error: "Impossible de joindre WordPress." });
  }
}
