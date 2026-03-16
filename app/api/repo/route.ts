import { totalmem } from "os";
import { fetchCommits, fetchPRs, fetchIssues, fetchBranches } from "./lib/github"
import { normalizeCommits, buildTimeline,
     buildContributors, buildPRContributors,
      buildIssueContributors, buildStats } from "./lib/process"

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
      stats: {
        totalCommits: 0,
        activeDays: 0,
        totalPRs: 0,
        totalIssues: 0,
        busFactor: 0,
        totalContributors: 0
      },
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
      stats: {
        totalCommits: 0,
        activeDays: 0,
        totalPRs: 0,
        totalIssues: 0,
        busFactor: 0,
        totalContributors: 0
      },
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
        stats: {
          totalCommits: 0,
          activeDays: 0,
          totalPRs: 0,
          totalIssues: 0,
          busFactor: 0,
          totalContributors: 0
        },
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

    const stats = buildStats(
                    commits,
                    contributors,
                    prs,
                    issues
                    )

    return Response.json({
      timeline,
      contributors,
      commits,
      prs,
      issues,
      branches,
      stats
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
        stats: {
          totalCommits: 0,
          activeDays: 0,
          totalPRs: 0,
          totalIssues: 0,
          busFactor: 0,
          totalContributors: 0

        },
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
      stats: {
        totalCommits: 0,
        activeDays: 0,
        totalPRs: 0,
        totalIssues: 0,
        busFactor: 0,
        totalContributors: 0

      },

      error: "Internal server error"
    }, { status: 500 })
  }
}