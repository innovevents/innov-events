// ===== Innov Events — WordPress via Vercel Proxy =====
// Le navigateur ne contacte plus directement InfinityFree :
// il appelle la fonction Vercel, qui récupère les articles WordPress.
const WORDPRESS_PROXY_URL = "https://innov-events-swart.vercel.app/api/posts";

function escapeHtml(str = "") {
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

function stripHtml(html = "") {
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.innerText || "").replace(/\s+/g, " ").trim();
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getFeaturedImage(post) {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  return media?.source_url || media?.media_details?.sizes?.large?.source_url || media?.media_details?.sizes?.medium_large?.source_url || "";
}

async function getPublishedPosts() {
  const response = await fetch(`${WORDPRESS_PROXY_URL}?per_page=100&orderby=date&order=desc&_embed=1`);
  if (!response.ok) throw new Error(`WordPress proxy: ${response.status}`);
  return response.json();
}

async function getPostBySlug(slug) {
  const response = await fetch(`${WORDPRESS_PROXY_URL}?slug=${encodeURIComponent(slug)}&_embed=1`);
  if (!response.ok) throw new Error(`WordPress proxy: ${response.status}`);
  const posts = await response.json();
  return posts[0] || null;
}
