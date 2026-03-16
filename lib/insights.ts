import { Insight, ResponseData } from "../app/api/repo/lib/types"


export function computeInsights(data: ResponseData): Insight[] {
  if (!data) return []

  const insights: Insight[] = []

// we will push insights one by one here
    // Contributor Dominance
    const totalCommits = data.stats.totalCommits || 1

    const sortedContributors = [...data.contributors].sort(
    (a, b) => b.commits - a.commits
    )

    const topContributor = sortedContributors[0]
    const dominance = topContributor ? topContributor.commits / totalCommits : 0

    let dominanceStatus: "good" | "warning" | "bad" = "good"

    if (dominance > 0.7) dominanceStatus = "bad"
    else if (dominance > 0.4) dominanceStatus = "warning"

    insights.push({
    label: "Contributor Risk",
    value: (dominance * 100).toFixed(0) + "%",
    status: dominanceStatus,
    message: topContributor
        ? `${topContributor.name} contributes ${(dominance * 100).toFixed(0)}% of commits`
        : "No contributor data",
    })

    //Repo Activity
    const commits = data.commits || []

    let lastCommitDays = 999

    if (commits.length > 0) {
    const latest = new Date(commits[0].date).getTime()
    const now = Date.now()

    lastCommitDays = Math.floor((now - latest) / (1000 * 60 * 60 * 24))
    }

    let activityStatus: "good" | "warning" | "bad" = "good"

    if (lastCommitDays > 14) activityStatus = "bad"
    else if (lastCommitDays > 3) activityStatus = "warning"

    insights.push({
    label: "Activity",
    value: `${lastCommitDays}d ago`,
    status: activityStatus,
    message:
        lastCommitDays === 999
        ? "No commits found"
        : `Last commit ${lastCommitDays} days ago`,
    })

    //Issue Resolution
    const totalIssues = data.stats.totalIssues || 0

    // crude approximation: active contributors vs issues
    const resolutionRatio =
    totalIssues === 0
        ? 1
        : Math.min(data.stats.totalContributors / totalIssues, 1)

    let issueStatus: "good" | "warning" | "bad" = "good"

    if (resolutionRatio < 0.4) issueStatus = "bad"
    else if (resolutionRatio < 0.7) issueStatus = "warning"

    insights.push({
    label: "Issue Handling",
    value: (resolutionRatio * 100).toFixed(0) + "%",
    status: issueStatus,
    message: `${totalIssues} issues vs ${data.stats.totalContributors} contributors`,
    })

    //Activity trend
    const timeline = data.timeline || []

    let trend = 0

    if (timeline.length >= 14) {
    const recent = timeline.slice(-7).reduce((sum, d) => sum + d.commits, 0)
    const previous = timeline
        .slice(-14, -7)
        .reduce((sum, d) => sum + d.commits, 0)

    trend = previous === 0 ? 0 : (recent - previous) / previous
    }

    let trendStatus: "good" | "warning" | "bad" = "good"

    if (trend < -0.2) trendStatus = "bad"
    else if (trend < 0.2) trendStatus = "warning"

    insights.push({
    label: "Momentum",
    value: (trend * 100).toFixed(0) + "%",
    status: trendStatus,
    message: "Last 7 days vs previous 7 days",
    })

  return insights
}