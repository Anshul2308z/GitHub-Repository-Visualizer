"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { commitsData } from "@/lib/mock-data"
import { GitCommit, User, Calendar } from "lucide-react"

export function CommitList({data}: {data: any[]}) {
  return (
    <Card className="col-span-full bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Commits</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {data.map((commit, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-chart-1/10">
                  <GitCommit className="h-5 w-5 text-chart-1" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="font-medium text-foreground leading-snug">
                    {commit.message}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      {commit.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {commit.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
