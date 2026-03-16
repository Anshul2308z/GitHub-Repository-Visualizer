export type Insight = {
  label: string
  value: string
  status: "good" | "warning" | "bad"
  message: string
}

export type ResponseData = {
    timeline: { date: string; commits: number }[]
    contributors: { name: string; commits: number }[]
    commits: { date: string; author: string; message: string }[]
    prs: { name: string; prs: number }[]
    issues: { name: string; issues: number }[]
    branches: string[]
    stats: {
        totalCommits: number
        activeDays: number
        totalPRs: number
        totalIssues: number
        busFactor: number
        totalContributors: number
    }
    error?: string
}