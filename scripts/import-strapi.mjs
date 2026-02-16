#!/usr/bin/env node
// Import mock data to Strapi using REST API.
// Requires: Node 18+ (global fetch, FormData, Blob). Strapi should be running.
// Env: NEXT_PUBLIC_CMS_URL, CMS_API_TOKEN (optional if public permissions are open)

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = path.resolve(process.cwd());
const EXPORTS_DIR = path.join(ROOT, "strapi", "exports");
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:1337";
const TOKEN = process.env.CMS_API_TOKEN || "";

function authHeaders(json = true) {
  const h = {};
  if (TOKEN) h.Authorization = `Bearer ${TOKEN}`;
  if (json) h["content-type"] = "application/json";
  return h;
}

async function getOneBySlug(collection, slug) {
  const url = new URL(`/api/${collection}?filters[slug][$eq]=${encodeURIComponent(slug)}`, CMS_URL);
  const res = await fetch(url, { headers: authHeaders(false) });
  if (!res.ok) return null;
  const data = await res.json();
  const arr = data?.data || [];
  return arr.length ? arr[0] : null;
}

async function createEntry(collection, data) {
  const url = new URL(`/api/${collection}`, CMS_URL);
  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders(true),
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Create ${collection} failed: ${res.status} ${txt}`);
  }
  return await res.json();
}

async function importProducts() {
  const file = path.join(EXPORTS_DIR, "products.json");
  if (!fs.existsSync(file)) return;
  const items = JSON.parse(fs.readFileSync(file, "utf8"));
  console.log(`Importing products (${items.length})...`);
  for (const p of items) {
    const exists = await getOneBySlug("products", p.slug);
    if (exists) {
      console.log(`- skip (exists): ${p.slug}`);
      continue;
    }
    await createEntry("products", p);
    console.log(`+ created: ${p.slug}`);
  }
}

async function importPosts() {
  const file = path.join(EXPORTS_DIR, "posts.json");
  if (!fs.existsSync(file)) return;
  const items = JSON.parse(fs.readFileSync(file, "utf8"));
  console.log(`Importing posts (${items.length})...`);
  for (const p of items) {
    const exists = await getOneBySlug("posts", p.slug);
    if (exists) {
      console.log(`- skip (exists): ${p.slug}`);
      continue;
    }
    await createEntry("posts", p);
    console.log(`+ created: ${p.slug}`);
  }
}

async function importRecipes() {
  const file = path.join(EXPORTS_DIR, "recipes.json");
  if (!fs.existsSync(file)) return;
  const items = JSON.parse(fs.readFileSync(file, "utf8"));
  console.log(`Importing recipes (${items.length})...`);
  for (const r of items) {
    const exists = await getOneBySlug("recipes", r.slug);
    if (exists) {
      console.log(`- skip (exists): ${r.slug}`);
      continue;
    }
    await createEntry("recipes", r);
    console.log(`+ created: ${r.slug}`);
  }
}

async function importStores() {
  const file = path.join(EXPORTS_DIR, "stores.json");
  if (!fs.existsSync(file)) return;
  const items = JSON.parse(fs.readFileSync(file, "utf8"));
  console.log(`Importing stores (${items.length})...`);
  for (const s of items) {
    await createEntry("stores", s);
    console.log(`+ created store: ${s.title}`);
  }
}

async function importDocuments() {
  const file = path.join(EXPORTS_DIR, "documents.json");
  if (!fs.existsSync(file)) return;
  const items = JSON.parse(fs.readFileSync(file, "utf8"));
  console.log(`Importing documents (${items.length})...`);
  for (const d of items) {
    const form = new FormData();
    const payload = { title: d.title };
    form.append("data", JSON.stringify(payload));
    if (d.file) {
      const p = path.isAbsolute(d.file) ? d.file : path.join(EXPORTS_DIR, d.file);
      if (fs.existsSync(p)) {
        const buf = fs.readFileSync(p);
        const blob = new Blob([buf], { type: "application/pdf" });
        form.append("files.file", blob, path.basename(p));
      }
    }
    const url = new URL("/api/documents", CMS_URL);
    const headers = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};
    const res = await fetch(url, { method: "POST", body: form, headers });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Create document failed: ${res.status} ${txt}`);
    }
    console.log(`+ created document: ${d.title}`);
  }
}

async function main() {
  console.log(`CMS: ${CMS_URL}`);
  await importProducts();
  await importPosts();
  await importRecipes();
  await importStores();
  await importDocuments();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


