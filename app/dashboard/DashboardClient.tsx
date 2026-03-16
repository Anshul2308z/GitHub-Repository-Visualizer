"use client"

import Link from "next/link"
import { TimelineChart } from "@/components/dashboard/timeline-chart"
import { ContributorsChart } from "@/components/dashboard/contributors-chart"
import { CommitList } from "@/components/dashboard/commit-list"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Github, GitBranch, Users, GitCommit } from "lucide-react"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { InsightCard } from "@/components/dashboard/insight-card"
import { computeInsights } from "@/lib/insights"



export default function Dashboard() {
    const searchParams = useSearchParams()
    const repoUrl = searchParams.get("url")
    const branch = searchParams.get("branch")

    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const statsDetailRef = useRef<HTMLDivElement | null>(null)
    const [metric, setMetric] = useState<"commits" | "prs" | "issues">("commits");

    const insights = data
      ? computeInsights(data).sort((a, b) => {
          const order = { bad: 0, warning: 1, good: 2 }
          return order[a.status] - order[b.status]
        })
      : []    

        // For tooltip
  const [hoveredStat, setHoveredStat] = useState<{
  label: string
  description: string
} | null>(null)

const [cursor, setCursor] = useState({ x: 0, y: 0 })

// Detect mobile for tooltip behavior
const [isMobile, setIsMobile] = useState(false)

useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 1024)
  check()
  window.addEventListener("resize", check)
  return () => window.removeEventListener("resize", check)
}, [])

useEffect(() => {
  if (!isMobile || !hoveredStat) return

  const timer = window.setTimeout(() => {
    const el = statsDetailRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const absoluteBottom = window.scrollY + rect.bottom
    const targetTop = Math.max(0, absoluteBottom - window.innerHeight + 16)

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    })
  }, 80)

  return () => window.clearTimeout(timer)
}, [hoveredStat, isMobile])

const handleStatCardClick = (sectionId: string) => {
  if (isMobile) {
    return
  }

  scrollTo(sectionId)
}
  // Track mouse position for tooltip
  useEffect(() => {
    const move = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [])

  const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return

  el.scrollIntoView({ behavior: "smooth", block: "start" })
  window.scrollBy(0, -80)
}

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
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-7xl px-6 py-8 space-y-6">

          {/* Stat cards skeleton */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-xl border border-border bg-card animate-pulse"
              />
            ))}
          </div>

          {/* Charts skeleton */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-xl border border-border bg-card animate-pulse"
              />
            ))}
          </div>

        </main>
      </div>
    )
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
    onHover={() =>
      setHoveredStat({
        label: "Total Commits",
        description:
          "All commits in the repo. High count signals activity, not necessarily impact.",
      })
    }
    onLeave={() => setHoveredStat(null)}
    onClick={() => handleStatCardClick("commit-section")}
  />

  <StatCard
    icon={<Users className="h-5 w-5" />}
    label="Active Days"
    value={data.stats.activeDays.toString()}
    onHover={() =>
      setHoveredStat({
        label: "Active Days",
        description:
          "Number of days with commits. Indicates consistency of development.",
      })
    }
    onLeave={() => setHoveredStat(null)}
    onClick={() => handleStatCardClick("timeline-section")}
  />

  <StatCard
    icon={<GitBranch className="h-5 w-5" />}
    label="Bus Factor"
    value={(data.stats.busFactor * 100).toFixed(0) + "%"}
    onHover={() =>
      setHoveredStat({
        label: "Bus Factor",
        description:
          "How dependent the project is on key contributors. Lower = higher risk.",
      })
    }
    onLeave={() => setHoveredStat(null)}
    onClick={() => handleStatCardClick("contributors-section")}
  />

  <StatCard
    icon={<GitCommit className="h-5 w-5" />}
    label="PRs"
    value={data.stats.totalPRs.toString()}
    onHover={() =>
      setHoveredStat({
        label: "Pull Requests",
        description:
          "Tracks proposed changes. Reflects collaboration and review activity.",
      })
    }
    onLeave={() => setHoveredStat(null)}
    onClick={() => handleStatCardClick("contributors-section")}
  />

  <StatCard
    icon={<Users className="h-5 w-5" />}
    label="Issues"
    value={data.stats.totalIssues.toString()}
    onHover={() =>
      setHoveredStat({
        label: "Issues",
        description:
          "Reported problems or tasks. High count may indicate backlog or active usage.",
      })
    }
    onLeave={() => setHoveredStat(null)}
    onClick={() => handleStatCardClick("contributors-section")}
  />

  <div ref={statsDetailRef} className="lg:hidden sm:col-span-3">
    {hoveredStat && (
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-medium text-foreground">
          {hoveredStat.label}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {hoveredStat.description}
        </p>
      </div>
    )}
  </div>
</div>


    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {insights.map((insight, i) => (
        <InsightCard key={i} insight={insight} />
      ))}
    </div>

      {/* test */}
      {/* <InsightCard
        insight={{
          label: "Test",
          value: "75%",
          status: "warning",
          message: "Testing card",
        }}
      /> */}

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

        {hoveredStat && (
          <div
            className="pointer-events-none fixed z-50 hidden lg:block w-64 rounded-xl border border-border bg-card p-4 shadow-xl transition-opacity duration-150"
            style={{
              top: cursor.y + 16,
              left: Math.min(cursor.x + 16, window.innerWidth - 280),
            }}
          >
            <p className="text-sm font-medium text-foreground">
              {hoveredStat.label}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {hoveredStat.description}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  description,
  onHover,
  onLeave,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  value: string
  description?: string
  onHover?: () => void
  onLeave?: () => void
  onClick?: () => void
}) {
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 1024

  return (
    <div
      onMouseEnter={() => {
        if (isMobile) return
        onHover?.()
      }}
      onMouseLeave={() => {
        if (isMobile) return
        onLeave?.()
      }}
      onClick={() => {
        if (isMobile) {
          onHover?.() // show description
        }
        onClick?.() // ALWAYS scroll
      }}
      className="
        cursor-pointer
        flex items-center gap-4 rounded-xl border border-border bg-card p-4
        transition-all duration-200 ease-out
        hover:scale-[1.03] hover:shadow-md
        active:scale-[0.98]
      "
    >
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