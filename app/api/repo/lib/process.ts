type RawCommit = {
  commit: {
    author: {
      date: string
    }
    message: string
  }
  author: {
    login: string
  } | null
}

export function normalizeCommits(data: RawCommit[]) {
  return data.map((c) => ({
    date: c.commit.author.date,
    author: c.author?.login || "unknown",
    message: c.commit.message
  }))
}

export function buildTimeline(commits: any[]) {
  const map: Record<string, number> = {}

  for (const c of commits) {
    const date = c.date.split("T")[0]
    map[date] = (map[date] || 0) + 1
  }

  return Object.entries(map).map(([date, commits]) => ({
    date,
    commits
  }))
}

export function buildContributors(commits: any[]) {
  const map: Record<string, number> = {}

  for (const c of commits) {
    map[c.author] = (map[c.author] || 0) + 1
  }

  return Object.entries(map)
    .map(([name, commits]) => ({ name, commits }))
    .sort((a, b) => b.commits - a.commits)
}

export function buildPRContributors(prs: any[]) {
  const map: Record<string, number> = {}

  for (const pr of prs) {
    const author = pr.user?.login || "unknown"
    map[author] = (map[author] || 0) + 1
  }

  return Object.entries(map)
    .map(([name, prs]) => ({ name, prs }))
    .sort((a, b) => b.prs - a.prs)
}