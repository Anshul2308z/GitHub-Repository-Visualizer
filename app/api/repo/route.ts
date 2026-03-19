type RawCommit = {
commit: {
    author: {
    date: string
    }
    message: string
}
author: {
    login: string
} | null
}
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const repoURI = searchParams.get("url");

  if (!repoURI) {
    return Response.json({
      timeline: [],
      contributors: [],
      commits: [],
      error: "Missing repo URL"
    }, { status: 400 })
  }

    const parts = repoURI.split("/");

    const owner = parts[3]
    const repo = parts[4]


    if (!owner || !repo) {
        // Invalid URL format response improved 
        return Response.json({
        timeline: [],
        contributors: [],
        commits: [],
        error: "Invalid GitHub URL"
        }, { status: 400 })
    }

    try {
        //improved fetch 
        const githubRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`,
        {
            headers: {
            "Accept": "application/vnd.github+json"
            }
        }
        )
        
        if (!githubRes.ok) {
        return Response.json({
            timeline: [],
            contributors: [],
            commits: [],
            error: "GitHub API error"
        }, { status: githubRes.status })
        }

        const data= await githubRes.json();


        if (data.message?.includes("rate limit")) {
        
        return Response.json({
            timeline: [],
            contributors: [],
            commits: [],
            error: "Rate limit exceeded"
        }, { status: 429 })
        }

        const commits = (data as RawCommit[]).map((c) => ({
        date: c.commit.author.date,
        author: c.author?.login || "unknown",
        message: c.commit.message,
        }))

        // If no commits found response improved
        if (!commits.length) {
        return Response.json({
            timeline: [],
            contributors: [],
            commits: [],
            error: "No commits found"
        })
        }

        //Goal
        // Transform:
        // Commit[]
        // into:
        // timeline + contributors

        //timeline logic
        const timelineMap : Record<string,number> = {};

        for( const c of commits ){
            const date = c.date.split("T")[0]; //YYYY-MM-DD
            if(!timelineMap[date]){
                timelineMap[date] = 0;
            }
            timelineMap[date]++;
        }

        const timeline = Object.entries(timelineMap).map(([date, commits]) => ({
        date,
        commits
        }));

        //contributors logic 
        const contributorMap : Record<string,number> = {};

        for(const c of commits){
            if(!contributorMap[c.author]){
                contributorMap[c.author] = 0;
            }
            contributorMap[c.author]++;
        }

        const contributors = Object.entries(contributorMap).map(([name, commits])=>(
            {
                name,
                commits
            }
        ));
        const sortedContributors = [...contributors].sort(
        (a, b) => b.commits - a.commits
        );

        //success response
        return Response.json({
            timeline,
            contributors: sortedContributors,
            commits
        });
        
    } catch (err) {
    return Response.json({
      timeline: [],
      contributors: [],
      commits: [],
      error: "Internal server error"
    }, { status: 500 })
  }
}