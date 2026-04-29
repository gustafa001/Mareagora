import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { Port } from './ports';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  updatedAt: string;
  author: string;
  category: string;
  tags: string[];
  excerpt: string;
  content: string;
  readingTime: string;
}

function getSlug(filename: string): string {
  return filename.replace(/\.mdx?$/, '');
}

export function getPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

  const posts = files.map((filename) => {
    const filepath = path.join(BLOG_DIR, filename);
    const raw = fs.readFileSync(filepath, 'utf-8');
    const { data, content } = matter(raw);
    const stats = readingTime(content);

    const date = (data.date as string) ?? '2026-01-01';

    return {
      slug: getSlug(filename),
      title: (data.title as string) ?? filename,
      date: date,
      updatedAt: (data.updatedAt as string) ?? date,
      author: (data.author as string) ?? 'Equipe MaréAgora',
      category: (data.category as string) ?? 'Geral',
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
      excerpt: (data.excerpt as string) ?? '',
      content,
      readingTime: stats.text,
    } satisfies BlogPost;
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPost(slug: string): BlogPost | null {
  const candidates = [`${slug}.mdx`, `${slug}.md`];
  const filename = candidates.find((f) =>
    fs.existsSync(path.join(BLOG_DIR, f))
  );

  if (!filename) return null;

  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8');
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  const date = (data.date as string) ?? '2026-01-01';

  return {
    slug,
    title: (data.title as string) ?? slug,
    date: date,
    updatedAt: (data.updatedAt as string) ?? date,
    author: (data.author as string) ?? 'Equipe MaréAgora',
    category: (data.category as string) ?? 'Geral',
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    excerpt: (data.excerpt as string) ?? '',
    content,
    readingTime: stats.text,
  };
}

export function getRelatedPosts(
  currentSlug: string,
  category: string,
  tags: string[],
  limit = 3
): BlogPost[] {
  const all = getPosts().filter((p) => p.slug !== currentSlug);

  const scored = all.map((p) => {
    let score = 0;
    if (p.category === category) score += 2;
    score += p.tags.filter((t) => tags.includes(t)).length;
    return { post: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.post);
}

export function getPostsByPort(port: Port, limit = 3): { posts: BlogPost[], strategy: 'specific' | 'generic' } {
  const all = getPosts();
  const slug = port.slug;
  const state = port.state.toLowerCase();
  const region = port.region;

  const slugWords = slug
    .replace(/-fiscal$/, '')
    .replace(/^(porto-de-|porto-do-|terminal-|arquipelago-de-)/, '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const scored = all.map(post => {
    let score = 0;
    const haystack = [
      String(post.title || '').toLowerCase(),
      ...(post.tags || []).filter(t => typeof t === 'string').map(t => t.toLowerCase()),
      String(post.excerpt || '').toLowerCase(),
    ].join(' ');

    // PRIORIDADE 1: Nome do Porto ou Slug (Peso 10)
    if (haystack.includes(slug.toLowerCase()) || haystack.includes(slugWords.toLowerCase())) {
      score += 10;
    }

    // PRIORIDADE 2: Estado (Peso 5)
    // Busca pelo nome completo (ex: "são paulo") ou sigla (se houver mapeamento, mas aqui usamos o campo state do objeto port)
    if (haystack.includes(state)) {
      score += 5;
    }

    // PRIORIDADE 3: Região (Peso 2)
    if (haystack.includes(region.toLowerCase())) {
      score += 2;
    }

    return { post, score };
  });

  // Filtrar apenas os que tem algum score (pelo menos regional)
  const relevantScored = scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score);

  if (relevantScored.length > 0 && relevantScored[0].score >= 5) {
    // Temos pelo menos match de Estado ou Porto
    return {
      posts: relevantScored.slice(0, limit).map(s => s.post),
      strategy: 'specific'
    };
  }

  // Fallback: posts com algum score (mesmo baixo), ordenados por score desc
  // Se nenhum tem score > 0, pega os mais recentes mas muda o título
  const comAlgumScore = scored.filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return {
    posts: comAlgumScore.length > 0
      ? comAlgumScore.slice(0, limit).map(s => s.post)
      : all.slice(0, limit),
    strategy: 'generic'
  };
}
