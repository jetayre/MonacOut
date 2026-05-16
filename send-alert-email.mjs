#!/usr/bin/env node
/**
 * MonacOut — Envoi d'alerte email si verify-events a détecté des problèmes.
 * Lit verify-events-report.txt et envoie via Resend si problèmes > 0.
 *
 * Usage : node send-alert-email.mjs
 * Toujours exit 0 (ne bloque pas le workflow CI).
 */

import https  from 'https';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname      = dirname(fileURLToPath(import.meta.url));
const REPORT_FILE    = join(__dirname, 'verify-events-report.txt');
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_TO       = 'stephanie.ayre@icloud.com';
const NAVY           = '#0F1D3A';
const GOLD           = '#C4A241';

// ── Lecture du rapport ────────────────────────────────────────────────────────

if (!existsSync(REPORT_FILE)) {
  console.log('send-alert-email: rapport introuvable, rien à envoyer.');
  process.exit(0);
}

const report = readFileSync(REPORT_FILE, 'utf8');

const problemMatch = report.match(/Problèmes détectés\s*:\s*(\d+)/);
const problemCount = problemMatch ? parseInt(problemMatch[1]) : 0;

if (problemCount === 0) {
  console.log('send-alert-email: aucun problème détecté — email non envoyé.');
  process.exit(0);
}

// ── Construction du rapport en HTML ──────────────────────────────────────────

const dateStr = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Monaco', dateStyle: 'full', timeStyle: 'short' });

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function reportToHtml(txt) {
  return txt.split('\n').map(line => {
    if (line.startsWith('✓')) return `<p style="color:#2A7A3A;margin:4px 0;">✓ ${escHtml(line.slice(1).trim())}</p>`;
    if (line.startsWith('──') || line.startsWith('========')) return `<hr style="border:none;border-top:1px solid rgba(15,29,58,0.15);margin:12px 0;">`;
    if (line.trim() === '') return '<br>';
    return `<p style="margin:3px 0;font-size:13px;color:#333;">${escHtml(line)}</p>`;
  }).join('');
}

const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F2EDE6;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,29,58,0.12);">

    <!-- Header -->
    <div style="background:${NAVY};padding:28px 28px 20px;text-align:center;">
      <div style="font-family:Georgia,serif;font-style:italic;font-size:28px;color:#fff;letter-spacing:1px;">MonacOut</div>
      <div style="font-size:11px;color:${GOLD};letter-spacing:2px;text-transform:uppercase;margin-top:4px;">Alerte quotidienne</div>
    </div>

    <!-- Alert banner -->
    <div style="background:#FFF3CD;border-left:4px solid #E6A817;padding:14px 24px;font-size:14px;color:#7A5000;">
      ⚠️ <strong>${problemCount} problème${problemCount > 1 ? 's' : ''} détecté${problemCount > 1 ? 's' : ''}</strong> lors de la vérification du ${dateStr}
    </div>

    <!-- Report body -->
    <div style="padding:24px 28px;">
      <div style="font-family:Georgia,serif;font-size:15px;color:${NAVY};margin-bottom:18px;font-style:italic;">
        Rapport complet de vérification
      </div>
      <div style="background:#F8F6F2;border-radius:8px;padding:16px 20px;font-size:12px;line-height:1.7;font-family:'Courier New',monospace;">
        ${reportToHtml(report)}
      </div>
    </div>

    <!-- CTA -->
    <div style="padding:0 28px 28px;text-align:center;">
      <a href="https://github.com/jetayre/MonacOut/actions"
         style="display:inline-block;background:${NAVY};color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.5px;">
        Voir les logs GitHub Actions →
      </a>
    </div>

    <!-- Footer -->
    <div style="background:#F8F6F2;padding:14px 28px;text-align:center;font-size:11px;color:#999;">
      Rapport automatique — MonacOut © 2026
    </div>
  </div>
</body>
</html>`;

// ── Envoi Resend ──────────────────────────────────────────────────────────────

function sendEmail(subject, htmlBody) {
  return new Promise((resolve, reject) => {
    if (!RESEND_API_KEY) {
      console.log('send-alert-email: RESEND_API_KEY absent — email non envoyé (mode local).');
      console.log('Sujet:', subject);
      resolve();
      return;
    }
    const payload = JSON.stringify({
      from:    'MonacOut <onboarding@resend.dev>',
      to:      [EMAIL_TO],
      subject,
      html:    htmlBody,
    });
    const options = {
      hostname: 'api.resend.com',
      port:     443,
      path:     '/emails',
      method:   'POST',
      headers:  {
        'Authorization':  `Bearer ${RESEND_API_KEY}`,
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`send-alert-email: ✓ email envoyé à ${EMAIL_TO}`);
          resolve();
        } else {
          console.error(`send-alert-email: ✗ Resend ${res.statusCode} — ${data}`);
          resolve(); // ne pas bloquer le workflow
        }
      });
    });
    req.on('error', e => { console.error('send-alert-email: erreur réseau —', e.message); resolve(); });
    req.write(payload);
    req.end();
  });
}

const todayShort = new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', timeZone:'Europe/Monaco' });
const subject    = `⚠️ MonacOut · ${problemCount} problème${problemCount > 1 ? 's' : ''} · ${todayShort}`;

await sendEmail(subject, html);
