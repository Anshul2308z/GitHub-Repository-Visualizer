import Link from "next/link"
import { TimelineChart } from "@/components/dashboard/timeline-chart"
import { ContributorsChart } from "@/components/dashboard/contributors-chart"
import { CommitList } from "@/components/dashboard/commit-list"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Github, GitBranch, Users, GitCommit } from "lucide-react"

export default function Dashboard() {
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
                <h1 className="font-semibold text-foreground">vercel/next.js</h1>
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
            value="530"
          />
          <StatCard
            icon={<Users className="h-5 w-5" />}
            label="Contributors"
            value="5"
          />
          <StatCard
            icon={<GitBranch className="h-5 w-5" />}
            label="Branches"
            value="12"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <TimelineChart />
          <ContributorsChart />
          <CommitList />
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
