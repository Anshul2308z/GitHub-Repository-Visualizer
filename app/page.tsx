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
    }else {
      router.push(`/mock`)

    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAnalyze()
    }
  }

  return (
     <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
  <div className="w-full max-w-3xl space-y-12 text-center">

{/* HERO */}
<div className="space-y-4">
<div className="mx-auto flex items-center justify-center gap-3">
  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-card border border-border">
    <Github className="h-6 w-6 text-foreground" />
  </div>

  <span className="text-xl font-semibold tracking-tight">
    RepoLens
  </span>
</div>

  <h1 className="text-4xl font-semibold tracking-tight text-gray-400">
    Understand any GitHub repo instantly
  </h1>

  <p className="text-muted-foreground text-lg">
    Analyze activity, contributors, and project health before you contribute
  </p>
  
</div>
<div className="">

</div>

{/* INPUT  */}
<div className="space-y-3">
  <Input
    type="url"
    placeholder="https://github.com/owner/repo"
    value={repoUrl}
    onChange={(e) => setRepoUrl(e.target.value)}
    onKeyDown={handleKeyDown}
    className="h-12 w-full"
  />

  <div className="grid grid-cols-5 gap-3">
    <div className="col-span-3 flex items-center gap-2">
      <span className="text-sm">branch:</span>
      <Input
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
        className="h-12 flex-1"
      />
    </div>

    <Button
      onClick={handleAnalyze}
      size="lg"
      className="col-span-2 h-12 gap-2"
    >
      Analyze
      <ArrowRight className="h-4 w-4" />
    </Button>
  </div>
</div>

{/* FEATURES */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">

  <div className="p-4 rounded-xl border border-border bg-card">
    <h3 className="font-medium">Activity Insights</h3>
    <p className="text-sm text-muted-foreground">
      Track commit trends and development momentum
    </p>
  </div>

  <div className="p-4 rounded-xl border border-border bg-card">
    <h3 className="font-medium">Contributor Analysis</h3>
    <p className="text-sm text-muted-foreground">
      Identify key contributors and contribution patterns
    </p>
  </div>

  <div className="p-4 rounded-xl border border-border bg-card">
    <h3 className="font-medium">Project Health</h3>
    <p className="text-sm text-muted-foreground">
      Understand risk using metrics like bus factor
    </p>
  </div>

</div>

  </div>
  <div className="mt-16 text-center p-1">

  <a
    href="https://github.com/Anshul2308z/GitHub-Repository-Visualizer"
    target="_blank"
    rel="noopener noreferrer"
    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
  >
    View Source
    <Github className="h-4 w-4" />
  </a>
</div>
</main>

  )
}
