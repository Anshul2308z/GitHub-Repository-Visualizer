"use client"

import Link from "next/link"
import { TimelineChart } from "@/components/dashboard/timeline-chart"
import { ContributorsChart } from "@/components/dashboard/contributors-chart"
import { CommitList } from "@/components/dashboard/commit-list"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Github, GitBranch, Users, GitCommit } from "lucide-react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"



export default function Dashboard() {
    const searchParams = useSearchParams()
    const repoUrl = searchParams.get("url")
    const branch = searchParams.get("branch")

    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const [metric, setMetric] = useState<"commits" | "prs" | "issues">("commits");

    //fetch data when repoUrl changes
    useEffect(() => {
    if (!repoUrl) return

    setLoading(true)

    fetch(`/api/repo?url=${encodeURIComponent(repoUrl)}&branch=${encodeURIComponent(branch || "main")}`)
      .then(res => res.json())
      .then((res) => {
        setData(res)
        setLoading(false)
      })
  }, [repoUrl, branch])


  if (loading) {
    return <div className="p-6">Analyzing repository...</div>
  }

  if (data?.error) {
    return <div className="p-6 text-red-500">{data.error}</div>
  }

  const contributorData = (() => {
  if (!data) return []

  switch (metric) {
    case "prs":
      return data.prs.map((p: any) => ({
        name: p.name,
        commits: p.prs, // reuse key for chart
      }))
    case "issues":
      return data.issues.map((i: any) => ({
        name: i.name,
        commits: i.issues,
      }))
    default:
      return data.contributors
  }
})()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to home</span>
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card border border-border">
                <Github className="h-5 w-5 text-foreground" />
              </div>
              <div>
              <h1 className="font-semibold text-foreground">
                {repoUrl?.split("/").slice(3,5).join("/") || "Repository"}
              </h1>
              <p className="text-xs text-muted-foreground">
                Branch: {branch || "main"}
              </p>
                <p className="text-sm text-muted-foreground">Repository Analysis</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        icon={<GitCommit className="h-5 w-5" />}
        label="Total Commits"
        value={data.stats.totalCommits.toString()}
      />
      <StatCard
        icon={<Users className="h-5 w-5" />}
        label="Active Days"
        value={data.stats.activeDays.toString()}
      />
      <StatCard
        icon={<GitBranch className="h-5 w-5" />}
        label="Bus Factor"
        value={(data.stats.busFactor * 100).toFixed(0) + "%"}
      />
      <StatCard
        icon={<GitCommit />}
        label="PRs"
        value={data.stats.totalPRs.toString()}
      />

      <StatCard
        icon={<Users />}
        label="Issues"
        value={data.stats.totalIssues.toString()}
      />
      </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <TimelineChart data={data?.timeline} />
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-muted-foreground">
                Top Contributors
              </h2>

              <div className="flex gap-2">
                {["commits", "prs", "issues"].map((m) => (
                  <Button
                    key={m}
                    size="sm"
                    variant={metric === m ? "default" : "ghost"}
                    onClick={() => setMetric(m as any)}
                    className="capitalize"
                  >
                    {m}
                  </Button>
                ))}
              </div>
            </div>

            <ContributorsChart data={contributorData} />
          </div>
          <CommitList data={data?.commits} />
        </div>
      </main>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold text-foreground">{value}</p>
      </div>
    </div>
  )
}
