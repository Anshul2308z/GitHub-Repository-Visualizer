import { fetchCommits, fetchPRs } from "./lib/github"
import { normalizeCommits, buildTimeline, buildContributors, buildPRContributors } from "./lib/process"


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const repoURI = searchParams.get("url")

  if (!repoURI) {
    return Response.json({
      timeline: [],
      contributors: [],
      commits: [],
      prs: [],
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
      prs:[],
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
        prs: [],
        error: "No commits found"
      })
    }

    const timeline = buildTimeline(commits)
    const contributors = buildContributors(commits)

    const prRaw = await fetchPRs(owner, repo)
    const prs = buildPRContributors(prRaw)

    return Response.json({
      timeline,
      contributors,
      commits,
      prs
    })

  } catch (err: any) {
    if (err.message === "RATE_LIMIT") {
      return Response.json({
        timeline: [],
        contributors: [],
        commits: [],
        prs:[],
        error: "Rate limit exceeded"
      }, { status: 429 })
    }

    return Response.json({
      timeline: [],
      contributors: [],
      commits: [],
      prs: [],
      error: "Internal server error"
    }, { status: 500 })
  }
}