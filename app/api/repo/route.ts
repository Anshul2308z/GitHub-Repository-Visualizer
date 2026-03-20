import { fetchCommits } from "./lib/github"
import { normalizeCommits, buildTimeline, buildContributors } from "./lib/process"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const repoURI = searchParams.get("url")

  if (!repoURI) {
    return Response.json({
      timeline: [],
      contributors: [],
      commits: [],
      error: "Missing repo URL"
    }, { status: 400 })
  }

  const parts = repoURI.split("/")
  const owner = parts[3]
  const repo = parts[4]

  if (!owner || !repo) {
    return Response.json({
      timeline: [],
      contributors: [],
      commits: [],
      error: "Invalid GitHub URL"
    }, { status: 400 })
  }

  try {
    const raw = await fetchCommits(owner, repo)

    const commits = normalizeCommits(raw)

    if (!commits.length) {
      return Response.json({
        timeline: [],
        contributors: [],
        commits: [],
        error: "No commits found"
      })
    }

    const timeline = buildTimeline(commits)
    const contributors = buildContributors(commits)

    return Response.json({
      timeline,
      contributors,
      commits
    })

  } catch (err: any) {
    if (err.message === "RATE_LIMIT") {
      return Response.json({
        timeline: [],
        contributors: [],
        commits: [],
        error: "Rate limit exceeded"
      }, { status: 429 })
    }

    return Response.json({
      timeline: [],
      contributors: [],
      commits: [],
      error: "Internal server error"
    }, { status: 500 })
  }
}