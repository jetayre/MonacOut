#!/usr/bin/env node
/**
 * MonacOut — Scan hebdomadaire des sources
 * Vérifie les 8 sources actives et envoie un rapport par email.
 * Lancé chaque lundi à 7h Monaco via GitHub Actions.
 */

import https from 'https';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_TO = 'stephanie.ayre@icloud.com';

const eventsContent = readFileSync(join(__dirname, '../src/data/events.js'), 'utf8');

const SOURCES = [
  { name: 'Opéra de Monte-Carlo',  url: 'https://opmc.mc/en/concert/',                              cat: 'Concert · Opéra · Musical',             emoji: '🎭' },
  { name: 'Grimaldi Forum',        url: 'https://www.grimaldiforum.com/en/events-schedule-monaco',  cat: 'Spectacles · Galas · Expos · Ateliers',  emoji: '🎪' },
  { name: 'Culture Monaco',        url: 'https://culture.mc/en/what-s-on',                          cat: 'Théâtre · Concerts · Danse',             emoji: '🎨' },
  { name: 'Mairie de Monaco',      url: 'https://www.mairie.mc/agenda',                             cat: 'Sport · Fêtes · Marchés · Danse',        emoji: '🏛️' },
  { name: 'La Note Bleue',         url: 'https://lanotebleue.mc/en/',                               cat: 'Jazz Live · DJ Set · Brunch',            emoji: '🎷' },
  { name: 'HVMC — Enchères',       url: 'https://hvmc.com/ventes-a-venir/',                         cat: 'Enchères · Mobilier · Art · Bijoux',      emoji: '🔨' },
  { name: 'Cinémas 2 Monaco',      url: 'https://www.cinemas2monaco.com',                           cat: 'Films VF · VO',                          emoji: '🎬' },
  { name: 'NMNM',                  url: 'https://www.nmnm.mc/',                                     cat: 'Expositions · Ateliers',                 emoji: '🖼️' },
];

// ── Fetch ──────────────────────────────────────────────────────────────────────

function fetchPage(url) {
  return new Promise(resolve => {
    let body = '';
    const opts = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      },
      timeout: 12000,
      rejectUnauthorized: false,
    };
    https.get(url, opts, res => {
      res.on('data', c => body += c);
      res.on('end', () => resolve({ ok: res.statusCode < 400, status: res.statusCode, body }));
    })
    .on('error', e => resolve({ ok: false, status: 'ERR', body: '', error: e.message }))
    .on('timeout', function () { this.destroy(); resolve({ ok: false, status: 'TIMEOUT', body: '' }); });
  });
}

// ── Extraction ─────────────────────────────────────────────────────────────────

function extractEvents(body) {
  const events = [];

  // 1. JSON-LD structured data
  const ldRe = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = ldRe.exec(body)) !== null) {
    try {
      const data = JSON.parse(m[1]);
      const items = Array.isArray(data) ? data : (data['@graph'] || [data]);
      for (const item of items) {
        const types = ['Event','MusicEvent','TheaterEvent','ExhibitionEvent','Festival','SportsEvent','DanceEvent'];
        if (types.includes(item['@type'])) {
          const title = item.name || '';
          const date  = item.startDate ? item.startDate.slice(0, 10) : '';
          if (title && !eventsContent.toLowerCase().includes(title.toLowerCase().slice(0, 25))) {
            events.push({ title, date, location: item.location?.name || '', url: item.url || '', via: 'JSON-LD', isNew: true });
          }
        }
      }
    } catch (e) {}
  }
  if (events.length > 0) return events;

  // 2. French date patterns in stripped text
  const text = body
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');

  const months = 'janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre';
  const dateRe = new RegExp(`(\\d{1,2})\\s+(${months})(?:\\s+20[2-9]\\d)?`, 'gi');

  while ((m = dateRe.exec(text)) !== null) {
    const ctx = text.slice(Math.max(0, m.index - 60), m.index + m[0].length + 100).trim().replace(/\s+/g, ' ');
    const alreadyIn = eventsContent.toLowerCase().includes(m[1] + ' ' + m[2].toLowerCase());
    events.push({ title: ctx.slice(0, 160), date: m[0], location: '', url: '', via: 'texte', isNew: !alreadyIn });
    if (events.length >= 12) break;
  }

  return events;
}

// ── Email ──────────────────────────────────────────────────────────────────────

function buildEmail(results, dateStr) {
  const accessible = results.filter(r => r.result.ok).length;
  const total      = results.length;
  const detections = results.reduce((n, r) => n + r.events.filter(e => e.isNew).length, 0);

  let rows = '';
  for (const { source, result, events } of results) {
    const ok          = result.ok;
    const statusColor = ok ? '#2A7A2A' : '#B83030';
    const statusLabel = ok ? '✓ accessible' : `✗ ${result.status}`;
    const newEvents   = events.filter(e => e.isNew);

    let detailHtml = '';
    if (!ok) {
      detailHtml = `<span style="color:#999;font-size:12px;">Inaccessible — à vérifier manuellement</span>`;
    } else if (newEvents.length > 0) {
      detailHtml = newEvents.slice(0, 5).map(e =>
        `<div style="margin-bottom:5px;font-size:12px;line-height:1.4;">
          <strong style="color:#0F1D3A;">${e.date || '—'}</strong>&nbsp;
          ${e.title.slice(0, 90)}
          ${e.url ? `<a href="${e.url}" style="color:#B8962E;font-size:11px;"> ↗</a>` : ''}
        </div>`
      ).join('');
    } else {
      detailHtml = `<span style="color:#999;font-size:12px;">Rien de nouveau détecté automatiquement</span>`;
    }

    rows += `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #EEE;vertical-align:top;width:200px;">
        <div style="font-size:14px;font-weight:700;color:#0F1D3A;">${source.emoji}&nbsp;${source.name}</div>
        <div style="font-size:11px;color:#999;margin-top:2px;">${source.cat}</div>
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #EEE;vertical-align:top;width:120px;">
        <span style="color:${statusColor};font-size:12px;font-weight:600;">${statusLabel}</span>
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #EEE;vertical-align:top;">${detailHtml}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #EEE;vertical-align:middle;text-align:center;width:80px;">
        <a href="${source.url}" style="display:inline-block;background:#0F1D3A;color:white;text-decoration:none;padding:5px 12px;border-radius:3px;font-size:11px;font-weight:600;letter-spacing:0.3px;">Ouvrir</a>
      </td>
    </tr>`;
  }

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F0EDE8;font-family:Arial,sans-serif;">
  <div style="max-width:680px;margin:32px auto;background:white;border-radius:6px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.10);">

    <!-- Header -->
    <div style="background:#0F1D3A;padding:28px 32px 22px;">
      <div style="color:#B8962E;font-size:10px;letter-spacing:4px;text-transform:uppercase;margin-bottom:8px;">Rapport hebdomadaire</div>
      <div style="color:white;font-size:26px;font-weight:700;letter-spacing:1px;">MonacOut</div>
      <div style="color:#7B90B8;font-size:12px;margin-top:6px;font-style:italic;">Tout ce qui se passe à Monaco</div>
      <div style="color:#8898B8;font-size:11px;margin-top:10px;">${dateStr}</div>
    </div>

    <!-- Summary bar -->
    <div style="background:#FFF8EC;padding:13px 32px;border-bottom:2px solid #E8E0D0;display:flex;gap:32px;align-items:center;">
      <span style="font-size:13px;color:#5A4A20;">📡 <strong>${accessible}/${total}</strong> sources accessibles</span>
      <span style="font-size:13px;color:#5A4A20;">🔍 <strong>${detections}</strong> nouveauté(s) détectée(s)</span>
    </div>

    <!-- Table -->
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="background:#F8F6F2;">
          <th style="padding:9px 16px;text-align:left;font-size:10px;color:#888;font-weight:700;letter-spacing:1px;border-bottom:2px solid #EEE;text-transform:uppercase;">Source</th>
          <th style="padding:9px 16px;text-align:left;font-size:10px;color:#888;font-weight:700;letter-spacing:1px;border-bottom:2px solid #EEE;text-transform:uppercase;">Statut</th>
          <th style="padding:9px 16px;text-align:left;font-size:10px;color:#888;font-weight:700;letter-spacing:1px;border-bottom:2px solid #EEE;text-transform:uppercase;">Détections</th>
          <th style="padding:9px 16px;text-align:center;font-size:10px;color:#888;font-weight:700;letter-spacing:1px;border-bottom:2px solid #EEE;text-transform:uppercase;">Lien</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <!-- Footer -->
    <div style="background:#F8F6F2;padding:16px 32px;border-top:1px solid #EEE;">
      <p style="margin:0;font-size:11px;color:#AAA;">
        Scan automatique chaque lundi matin &middot;
        <a href="https://github.com/jetayre/MonacOut/actions" style="color:#B8962E;text-decoration:none;">Voir les logs GitHub</a>
        &middot; MonacOut &copy; 2026
      </p>
    </div>

  </div>
</body>
</html>`;
}

function sendEmail(subject, html) {
  return new Promise((resolve, reject) => {
    if (!RESEND_API_KEY) {
      console.log('⚠️  RESEND_API_KEY absent — email non envoyé (mode local)');
      resolve();
      return;
    }
    const payload = JSON.stringify({
      from: 'MonacOut <onboarding@resend.dev>',
      to: [EMAIL_TO],
      subject,
      html,
    });
    const options = {
      hostname: 'api.resend.com',
      port: 443,
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('✓ Email envoyé →', EMAIL_TO);
          resolve();
        } else {
          console.error('✗ Erreur Resend:', res.statusCode, data);
          reject(new Error(`Resend ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  const now     = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', { weekday:'long', year:'numeric', month:'long', day:'numeric', timeZone:'Europe/Monaco' });

  console.log(`\nMonacOut — Scan hebdomadaire — ${dateStr}\n`);

  const results = [];
  for (const source of SOURCES) {
    process.stdout.write(`  ${source.emoji} ${source.name}... `);
    const result = await fetchPage(source.url);
    const events = result.ok ? extractEvents(result.body) : [];
    const newCount = events.filter(e => e.isNew).length;
    console.log(result.ok ? `✓ — ${newCount} nouveauté(s)` : `✗ ${result.status}`);
    results.push({ source, result, events });
  }

  const detections = results.reduce((n, r) => n + r.events.filter(e => e.isNew).length, 0);
  const subject    = `MonacOut · lundi ${now.toLocaleDateString('fr-FR', { day:'numeric', month:'long', timeZone:'Europe/Monaco' })} · ${detections} nouveauté(s)`;
  const html       = buildEmail(results, dateStr);

  await sendEmail(subject, html);
}

main().catch(err => { console.error(err); process.exit(1); });
