import { fetchCommits, fetchPRs, fetchIssues } from "./lib/github"
import { normalizeCommits, buildTimeline, buildContributors, buildPRContributors, buildIssueContributors } from "./lib/process"

type ResponseData = {
    timeline: { date: string; commits: number }[]
    contributors: { name: string; commits: number }[]
    commits: { date: string; author: string; message: string }[]
    prs: { name: string; prs: number }[]
    issues: { name: string; issues: number }[]
    error?: string
}

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const repoURI = searchParams.get("url")

  if (!repoURI) {
    return Response.json({
      timeline: [],
      contributors: [],
      commits: [],
      prs: [],
      issues: [],
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
      issues: [],
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
        issues: [],
        error: "No commits found"
      })
    }

    const timeline = buildTimeline(commits)
    const contributors = buildContributors(commits)

    const prRaw = await fetchPRs(owner, repo)
    const prs = buildPRContributors(prRaw)

    const issuesRaw = await fetchIssues(owner, repo)
    const issues = buildIssueContributors(issuesRaw)

    return Response.json({
      timeline,
      contributors,
      commits,
      prs,
      issues,
    })

  } catch (err: any) {
    if (err.message === "RATE_LIMIT") {
      return Response.json({
        timeline: [],
        contributors: [],
        commits: [],
        prs:[],
        issues: [],
        error: "Rate limit exceeded"
      }, { status: 429 })
    }

    return Response.json({
      timeline: [],
      contributors: [],
      commits: [],
      prs: [],
      issues: [], 
      error: "Internal server error"
    }, { status: 500 })
  }
}