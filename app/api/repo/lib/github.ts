export async function fetchCommits(owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github+json"
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
        Accept: "application/vnd.github+json"
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