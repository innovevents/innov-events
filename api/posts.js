export default async function handler(req, res) {
  const origin = req.headers.origin || "*";

  res.setHeader(
    "Access-Control-Allow-Origin",
    origin === "null" ? "*" : origin
  );
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const wpUrl = new URL(
    "https://public-api.wordpress.com/rest/v1.1/sites/innoveventscms.wordpress.com/posts/"
  );

  for (const [key, value] of Object.entries(req.query || {})) {
    if (Array.isArray(value)) {
      value.forEach((v) => wpUrl.searchParams.append(key, v));
    } else if (value !== undefined) {
      wpUrl.searchParams.set(key, value);
    }
  }

  if (!wpUrl.searchParams.has("number")) {
    wpUrl.searchParams.set("number", "20");
  }

  if (!wpUrl.searchParams.has("order")) {
    wpUrl.searchParams.set("order", "DESC");
  }

  try {
    const response = await fetch(wpUrl.toString(), {
      headers: {
        Accept: "application/json"
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // WordPress.com renvoie { posts: [...] }.
    // Notre frontend reçoit directement le tableau des articles.
    const posts = Array.isArray(data.posts) ? data.posts : [];

    res.setHeader(
      "Content-Type",
      "application/json; charset=utf-8"
    );

    return res.status(200).json(posts);

  } catch (error) {
    console.error("WordPress.com proxy error:", error);

    return res.status(502).json({
      error: "Impossible de joindre WordPress.com.",
      details: error.message
    });
  }
}
