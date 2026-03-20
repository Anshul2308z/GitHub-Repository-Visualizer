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

export function buildIssueContributors(issues: any[]) {
  const map: Record<string, number> = {}

  for (const issue of issues) {
    //  FILTER OUT PRs
    if (issue.pull_request) continue

    const author = issue.user?.login || "unknown"
    map[author] = (map[author] || 0) + 1
  }

  return Object.entries(map)
    .map(([name, issues]) => ({ name, issues }))
    .sort((a, b) => b.issues - a.issues)
}

export function buildStats(
  commits: any[],
  contributors: any[],
  prs: any[],
  issues: any[]
) {
  const totalCommits = commits.length

  // active days
  const uniqueDays = new Set(
    commits.map(c => c.date.split("T")[0])
  )
  const activeDays = uniqueDays.size

  // bus factor (top contributor share)
  const topCommits = contributors[0]?.commits || 0
  const busFactor = totalCommits
    ? Number((topCommits / totalCommits).toFixed(2))
    : 0

  const totalPRs = prs.reduce((sum, p) => sum + p.prs, 0)
  const totalIssues = issues.reduce((sum, i) => sum + i.issues, 0)
  const totalContributors = contributors.length

  return {
    totalCommits,
    activeDays,
    busFactor,
    totalPRs,
    totalIssues,
    totalContributors
  }
}