import { Router } from "express";

export const changelogRouter = Router();

const REPO = process.env.GITHUB_REPO || "DhanushPalani31/Grovance";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes — avoid hammering GitHub's rate limit

interface ChangelogEntry {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

let cache: { entries: ChangelogEntry[]; fetchedAt: number } | null = null;

async function fetchCommits(): Promise<ChangelogEntry[]> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(`https://api.github.com/repos/${REPO}/commits?per_page=8`, { headers });
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  const data = (await res.json()) as any[];
  return data.map((c) => ({
    sha: c.sha.slice(0, 7),
    message: c.commit.message.split("\n")[0],
    author: c.commit.author?.name || "Grovance",
    date: c.commit.author?.date || c.commit.committer?.date,
    url: c.html_url,
  }));
}

changelogRouter.get("/", async (_req, res) => {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    return res.json(cache.entries);
  }

  try {
    const entries = await fetchCommits();
    cache = { entries, fetchedAt: now };
    res.json(entries);
  } catch (err) {
    console.error(err);
    if (cache) {
      // Serve stale cache rather than failing outright
      return res.json(cache.entries);
    }
    res.status(502).json({ error: "Could not reach GitHub" });
  }
});
