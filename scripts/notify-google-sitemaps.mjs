#!/usr/bin/env node
/**
 * notify-google-sitemaps.mjs
 * ---------------------------
 * Notifies Google Search Console that the sitemaps have been updated.
 *
 * Property type: domain (sc-domain:mareagora.com.br)
 *
 * NOTE: this project uses app/sitemap.ts with generateSitemaps() which
 * produces /sitemap/{id}.xml per sub-sitemap. There is NO /sitemap.xml
 * index (that endpoint only exists without generateSitemaps). So we
 * submit each of the 6 sub-sitemaps individually to GSC.
 *
 * Environment variables (set via GitHub Secrets):
 *   GOOGLE_SERVICE_ACCOUNT_JSON  – full JSON key of a GCP service account
 *                                  with Search Console API access.
 *
 * Usage:
 *   node scripts/notify-google-sitemaps.mjs
 */

const SITE_URL = 'sc-domain:mareagora.com.br';
const SITEMAPS = [
  'https://mareagora.com.br/sitemap/index.xml',
  'https://mareagora.com.br/sitemap/praias.xml',
  'https://mareagora.com.br/sitemap/guia-praias.xml',
  'https://mareagora.com.br/sitemap/portos.xml',
  'https://mareagora.com.br/sitemap/estados.xml',
  'https://mareagora.com.br/sitemap/blog.xml',
];

function log(label, ok, detail = '') {
  const icon = ok ? '✅' : '❌';
  const suffix = detail ? ` — ${detail}` : '';
  console.log(`${icon} ${label}${suffix}`);
}

async function submitSitemap(accessToken, sitemapUrl) {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  return res;
}

async function notifyGoogle() {
  const json = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!json) {
    log('Google Search Console', false, 'GOOGLE_SERVICE_ACCOUNT_JSON not set — skipping');
    return;
  }

  let credentials;
  try {
    credentials = JSON.parse(json);
  } catch {
    log('Google Search Console', false, 'GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON');
    return;
  }

  try {
    // --- obtain a short-lived OAuth2 access token via JWT -------------------
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const claimSet = {
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/webmasters',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    function base64url(obj) {
      return Buffer.from(JSON.stringify(obj))
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    }

    const signingInput = `${base64url(header)}.${base64url(claimSet)}`;
    const sign = await import('crypto').then((m) =>
      m.default.createSign('RSA-SHA256').update(signingInput).sign(credentials.private_key, 'base64'),
    );
    const jwt = `${signingInput}.${sign.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}`;

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    const tokenBody = await tokenRes.json();
    if (!tokenRes.ok || !tokenBody.access_token) {
      log('Google Search Console', false, `Token exchange failed (${tokenRes.status}): ${tokenBody.error_description || tokenBody.error || 'unknown'}`);
      return;
    }

    // --- submit each sub-sitemap (PUT, no body) ------------------------------
    let allOk = true;
    for (const sitemap of SITEMAPS) {
      const submitRes = await submitSitemap(tokenBody.access_token, sitemap);
      const submitBody = await submitRes.json().catch(() => null);
      if (submitRes.ok) {
        log('Google Search Console', true, `Submitted ${sitemap} (${submitRes.status})`);
      } else {
        allOk = false;
        const msg = submitBody?.error?.message || JSON.stringify(submitBody) || `HTTP ${submitRes.status}`;
        log('Google Search Console', false, `${sitemap} — ${msg}`);
      }
    }

    if (allOk) {
      log('All sitemaps', true, `${SITEMAPS.length} submitted`);
    }
  } catch (err) {
    const detail = [
      err.message,
      err.stack && err.stack.split('\n').slice(0, 3).join(' | '),
    ].filter(Boolean).join(' — ');
    log('Google Search Console', false, detail || 'Unknown error');
  }
}

// ── main ─────────────────────────────────────────────────────────────────────

console.log(`\nSite URL    : ${SITE_URL}`);
console.log(`Sitemaps    : ${SITEMAPS.length} sub-sitemaps\n`);

await notifyGoogle();

console.log('\nDone.');
