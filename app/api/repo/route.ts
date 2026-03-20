import { fetchCommits, fetchPRs, fetchIssues, fetchBranches } from "./lib/github"
import { normalizeCommits, buildTimeline, buildContributors, buildPRContributors, buildIssueContributors } from "./lib/process"

type ResponseData = {
    timeline: { date: string; commits: number }[]
    contributors: { name: string; commits: number }[]
    commits: { date: string; author: string; message: string }[]
    prs: { name: string; prs: number }[]
    issues: { name: string; issues: number }[]
    branches: string[]
    error?: string
}

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const repoURI = searchParams.get("url")

  const branch = searchParams.get("branch") || "main"; 

  if (!repoURI) {
    return Response.json({
      timeline: [],
      contributors: [],
      commits: [],
      prs: [],
      issues: [],
      branches:[],
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
      branches: [],
      error: "Invalid GitHub URL"
    }, { status: 400 })
  }

  try {
    const raw = await fetchCommits(owner, repo, branch)

    const commits = normalizeCommits(raw)

    if (!commits.length) {
      return Response.json({
        timeline: [],
        contributors: [],
        commits: [],
        prs: [],
        issues: [],
        branches: [],
        error: "No commits found"
      })
    }

    const timeline = buildTimeline(commits)
    const contributors = buildContributors(commits)

    const prRaw = await fetchPRs(owner, repo)
    const prs = buildPRContributors(prRaw)

    const issuesRaw = await fetchIssues(owner, repo)
    const issues = buildIssueContributors(issuesRaw)

    const branchesNew = await fetchBranches(owner, repo)
    const branches = branchesNew.map((b: any) => b.name)

    return Response.json({
      timeline,
      contributors,
      commits,
      prs,
      issues,
      branches
    })

  } catch (err: any) {
    if (err.message === "RATE_LIMIT") {
      return Response.json({
        timeline: [],
        contributors: [],
        commits: [],
        prs:[],
        issues: [],
        branches: [],
        error: "Rate limit exceeded"
      }, { status: 429 })
    }

    return Response.json({
      timeline: [],
      contributors: [],
      commits: [],
      prs: [],
      issues: [], 
      branches: [],
      error: "Internal server error"
    }, { status: 500 })
  }
}