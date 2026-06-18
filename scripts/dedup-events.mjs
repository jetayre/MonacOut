#!/usr/bin/env node
/**
 * Supprime les événements en double exact (même catégorie + date + titre + lieu),
 * en gardant la première occurrence. Évite les répétitions créées par le scan auto.
 * Exécuté chaque jour par daily-check.yml (avant le build & push).
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "../src/data/events.js");

const lines = readFileSync(FILE, "utf8").split("\n");
const seen = new Set();
let removed = 0;
const kept = lines.filter((l) => {
  if (!/^\s*\{id:\d+,/.test(l)) return true;
  const cat = (l.match(/cat:"([^"]*)"/) || [])[1] || "";
  const date = (l.match(/date:"([^"]*)"/) || [])[1] || "";
  const title = (l.match(/title:"([^"]*)"/) || [])[1] || "";
  const sub = (l.match(/subtitle:"([^"]*)"/) || [])[1] || "";
  const year = (l.match(/year:(\d+)/) || [])[1] || "2026";
  const key = `${year}|${cat}|${date}|${title}|${sub}`;
  if (seen.has(key)) { removed++; return false; }
  seen.add(key);
  return true;
});

writeFileSync(FILE, kept.join("\n"));
console.log("Doublons exacts supprimés :", removed);
