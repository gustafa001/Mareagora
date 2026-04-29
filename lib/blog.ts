import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

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

export function getPostsByPort(portSlug: string, limit = 3): BlogPost[] {
  const all = getPosts();

  const slugWords = portSlug
    .replace(/-fiscal$/, '')
    .replace(/^(porto-de-|porto-do-|terminal-|arquipelago-de-)/, '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const filtered = all.filter(post => {
    const haystack = [
      post.title.toLowerCase(),
      ...post.tags.map(t => t.toLowerCase()),
      post.excerpt.toLowerCase(),
    ].join(' ');

    return (
      haystack.includes(portSlug.toLowerCase()) ||
      haystack.includes(slugWords.toLowerCase()) ||
      post.tags.some(tag =>
        portSlug.toLowerCase().includes(tag.toLowerCase()) ||
        tag.toLowerCase().includes(slugWords.toLowerCase())
      )
    );
  });

  return filtered.slice(0, limit);
}
