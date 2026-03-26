import { Insight, ResponseData } from "../app/api/repo/lib/types"

function getMomentum(timeline: ResponseData["timeline"]) {
  if (!timeline || timeline.length < 14) return 0

  const last14 = timeline.slice(-14)

  const recent = last14
    .slice(-7)
    .reduce((sum, d) => sum + d.commits, 0)

  const previous = last14
    .slice(0, 7)
    .reduce((sum, d) => sum + d.commits, 0)

  return previous === 0 ? 0 : (recent - previous) / previous
}

function getTopContributor(contributors: ResponseData["contributors"]) {
  if (!contributors || contributors.length === 0) return null

  return contributors.reduce((max, curr) =>
    curr.commits > max.commits ? curr : max
  )
}



















export function computeInsights(data: ResponseData): Insight[] {
  if (!data) return []

  const insights: Insight[] = []

  // we will push insights one by one here
    // Contributor Dominance
    const totalCommits = data.stats.totalCommits || 1

    const topContributor = getTopContributor(data.contributors) 

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
    const latest = commits.reduce((max, c) => {
    const time = new Date(c.date).getTime()
    return time > max ? time : max
    }, 0)
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

    const trend = getMomentum(timeline) 

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

export function calculateHealthScore(data: ResponseData) {
  const { stats, timeline } = data

  // 1. Risk (invert bus factor)
  const riskScore = 100 - stats.busFactor

  // 2. Activity
  const activityScore = Math.min(stats.activeDays / 30, 1) * 100

  // 3. Momentum

  const momentum = getMomentum(timeline)

    let momentumScore = 50

    if (timeline.length >= 14) {
    momentumScore = Math.max(0, Math.min(100, (momentum + 1) * 50))
    }

  // 4. Issue handling
  const issueScore =
    (stats.totalPRs / (stats.totalIssues + 1)) * 100

  const healthScore =
    riskScore * 0.35 +
    activityScore * 0.25 +
    momentumScore * 0.2 +
    issueScore * 0.2

  return Math.round(healthScore)
}