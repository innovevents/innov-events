// ===== Connexion au mini-CMS (Supabase) =====
// Renseigne ces deux valeurs depuis Project Settings > API sur supabase.com
// avant de mettre le site en ligne. Tant qu'elles ne sont pas remplies,
// le blog et l'administration afficheront un message de configuration.
const SUPABASE_URL = "sb_publishable_y_5BcfIahyWuwJxBJkV2vQ_XxLyyeNQ";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6bnZ4aWdsaWVuenptYWZremhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxMTY3MzUsImV4cCI6MjEwNTY5MjczNX0.psls0VoOIAmV_jlNT8dWtyCwSJtbsJQRBuMZDYdLDrc";

const isSupabaseConfigured = () =>
  SUPABASE_URL &&
  !SUPABASE_URL.startsWith("REMPLACER") &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_ANON_KEY.startsWith("REMPLACER");

let supabaseClient = null;
function getSupabase() {
  if (!isSupabaseConfigured()) return null;
  if (!supabaseClient && window.supabase) {
    supabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
    );
  }
  return supabaseClient;
}

function slugify(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Convertit un texte brut (paragraphes séparés par une ligne vide) en HTML sûr.
function textToHtml(text) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function showConfigNotice(container) {
  if (!container) return;
  container.innerHTML = `<div class="blog-empty">
    Le blog n'est pas encore connecté à sa base de données.
    Renseigne <code>SUPABASE_URL</code> et <code>SUPABASE_ANON_KEY</code> dans <code>cms.js</code> pour l'activer.
  </div>`;
}
