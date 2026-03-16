

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ""


export async function fetchCommits(owner: string, repo: string, branch: string = "main") {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100&sha=${branch}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      }
    }
  )

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`)
  }

  const data = await res.json()

  if (data.message?.includes("rate limit")) {
    throw new Error("RATE_LIMIT")
  }

  return data
}

export async function fetchPRs(owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      }
    }
  )

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`)
  }

  const data = await res.json()

  if (data.message?.includes("rate limit")) {
    throw new Error("RATE_LIMIT")
  }

  return data
}

export async function fetchIssues(owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      }
    }
  )

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`)
  }

  const data = await res.json()

  if (data.message?.includes("rate limit")) {
    throw new Error("RATE_LIMIT")
  }

  return data // issues endpoint returns both issues and PRs, we will filter them later
}

export async function fetchBranches(owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/branches`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`

      }
    }
  )

  if (!res.ok) throw new Error("Branch fetch failed")

  return res.json()
}