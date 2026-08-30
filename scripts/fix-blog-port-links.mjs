#!/usr/bin/env node
/**
 * fix-blog-port-links.mjs
 * ------------------------
 * Fixes hardcoded /mare/{slug} markdown links in content/blog/*.mdx to the
 * state-qualified format /mare/{estado}/{slug}, using redirects.json as the
 * source of truth.
 *
 * Usage:
 *   node scripts/fix-blog-port-links.mjs          # apply fixes (writes files)
 *   node scripts/fix-blog-port-links.mjs --check  # dry-run, report only
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const checkOnly = process.argv.includes('--check');

// ── 1. build slug → destination map from redirects.json ─────────────────────
const redirects = JSON.parse(fs.readFileSync(path.join(root, 'redirects.json'), 'utf8'));
const slugMap = {};
const ignored = [];

for (const r of redirects) {
  // only single-segment /mare/{slug} sources mapping to /mare/{estado}/{slug}
  if (r.source.startsWith('/mare/') && r.destination.startsWith('/mare/')) {
    const sourceSegs = r.source.split('/').filter(Boolean);
    const destSegs = r.destination.split('/').filter(Boolean);
    if (sourceSegs.length === 2 && destSegs.length === 3) {
      slugMap[sourceSegs[1]] = r.destination;
    }
  }
}

// ── 2. scan content/blog/*.mdx ───────────────────────────────────────────────
const blogDir = path.join(root, 'content', 'blog');
const files = fs
  .readdirSync(blogDir)
  .filter((f) => f.endsWith('.mdx'))
  .sort();

const LINK_RE = /\]\(\/mare\/([a-z0-9-]+)\)/g;

let totalLinks = 0;
let totalReplaced = 0;
let filesModified = 0;
const unchangedRefs = new Map(); // slug -> count
const changedRefs = new Map(); // slug -> count

for (const file of files) {
  const filePath = path.join(blogDir, file);
  const original = fs.readFileSync(filePath, 'utf8');

  let updated = original;
  let match;
  const regex = new RegExp(LINK_RE.source, 'g');
  let fileLinks = 0;
  let fileReplaced = 0;

  while ((match = regex.exec(original)) !== null) {
    const slug = match[1];
    totalLinks++;
    fileLinks++;

    if (slugMap[slug]) {
      const target = `](/mare/${slug})`;
      const replacement = `](${slugMap[slug]})`;
      updated = updated.split(target).join(replacement);
      fileReplaced++;
      totalReplaced++;
      changedRefs.set(slug, (changedRefs.get(slug) || 0) + 1);
    } else {
      unchangedRefs.set(slug, (unchangedRefs.get(slug) || 0) + 1);
    }
  }

  if (fileReplaced > 0) {
    filesModified++;
    if (checkOnly) {
      console.log(`[check] ${file}: ${fileReplaced} link(s) found in old format (would be rewritten)`);
    } else {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`[fix]   ${file}: ${fileReplaced} link(s) rewritten`);
    }
  }
}

console.log('\n──────────────────────────');
console.log(`Files scanned     : ${files.length}`);
console.log(`Files modified    : ${filesModified}`);
console.log(`Old-format links  : ${totalLinks}`);
console.log(`Links rewritten   : ${totalReplaced}`);

if (unchangedRefs.size > 0) {
  console.log('\nLinks NOT in redirects map (left unchanged):');
  for (const [slug, count] of [...unchangedRefs.entries()].sort()) {
    console.log(`  /mare/${slug}  (${count})`);
  }
}

if (checkOnly && totalLinks === 0) {
  console.log('\nCHECK PASSED: no old-format /mare/{slug} links remain in content/blog/*.mdx.');
} else if (checkOnly) {
  console.log(`\nCHECK FAILED: ${totalLinks} old-format /mare/{slug} link(s) remain.`);
}