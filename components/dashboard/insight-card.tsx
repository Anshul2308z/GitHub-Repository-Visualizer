"use client"

type Insight = {
  label: string
  value: string
  status: "good" | "warning" | "bad"
  message: string
}

const statusStyles = {
  good: "border-l-4 border-green-500",
  warning: "border-l-4 border-yellow-500",
  bad: "border-l-4 border-red-500",
}
export function InsightCard({ insight }: { insight: Insight }) {
  const statusStyles = {
    good: "border-l-4 border-green-500",
    warning: "border-l-4 border-yellow-500",
    bad: "border-l-4 border-red-500",
  }

  return (
    <div
      className={`rounded-xl border border-border bg-card p-4 ${statusStyles[insight.status]}`}
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          {insight.label}
        </p>

        <p className="text-2xl font-semibold text-foreground">
          {insight.value}
        </p>

        <p className="text-xs text-muted-foreground">
          {insight.message}
        </p>
      </div>
    </div>
  )
}