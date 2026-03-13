"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, ArrowRight } from "lucide-react"

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("")
  const [branch, setBranch] = useState("main")
  const router = useRouter()

  const handleAnalyze = () => {
    const trimmedUrl = repoUrl.trim();
    if (trimmedUrl) {
      router.push(`/dashboard?url=${encodeURIComponent(trimmedUrl)}&branch=${encodeURIComponent(branch)}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAnalyze()
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-8 text-center">
        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-card border border-border">
            <Github className="h-8 w-8 text-foreground" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground text-balance">
            GitHub Repository Visualizer
          </h1>
          <p className="text-muted-foreground text-lg">
            Analyze commit history, contributors, and activity trends for any GitHub repository
          </p>
        </div>

        <div className="space-y-3">
  {/* Row 1: Repo URL full width */}
  <Input
    type="url"
    placeholder="https://github.com/owner/repo"
    value={repoUrl}
    onChange={(e) => setRepoUrl(e.target.value)}
    onKeyDown={handleKeyDown}
    className="h-12 w-full bg-card border-border text-foreground placeholder:text-muted-foreground"
  />

  {/* Row 2: Branch + Button */}
  <div className="grid grid-cols-5 gap-3">
    {/* 60% */}
    <div className="col-span-3 flex items-center gap-2">
      <span className="text-sm text-foreground whitespace-nowrap">
        branch:
      </span>

      <Input
        type="text"
        placeholder="main"
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
        className="h-12 flex-1 bg-card border-border text-foreground placeholder:text-muted-foreground"
      />
    </div>

    {/* 40% */}
    <Button
      onClick={handleAnalyze}
      size="lg"
      className="col-span-2 h-12 gap-2 bg-foreground text-background hover:bg-foreground/90"
    >
      Analyze
      <ArrowRight className="h-4 w-4" />
    </Button>
  </div>
</div>
      </div>
    </main>
  )
}
