export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const repoURI = searchParams.get("url");
    if(!repoURI) {
        return Response.json(
            { error: "Missing 'url' query parameter" },
            { status: 400 });
    }
    const parts = repoURI.split("/");

    const owner = parts[parts.length - 2];
    const repo = parts[parts.length - 1];

    if (!owner || !repo) {
        return Response.json(
            { error: "Invalid GitHub repository URL" },
            { status: 400 });
    }

    try {
        const githubRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`);

        const data= await githubRes.json();

        if(!githubRes.ok) {
            return Response.json(
                { error: "Failed to fetch repository commits" },
                { status: githubRes.status });
            }

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

        const commits = (data as RawCommit[]).map((c) => ({
        date: c.commit.author.date,
        author: c.author?.login || "unknown",
        message: c.commit.message,
        }))

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

        //contributers logic 
        const contributerMap : Record<string,number> = {};

        for(const c of commits){
            if(!contributerMap[c.author]){
                contributerMap[c.author] = 0;
            }
            contributerMap[c.author]++;
        }

        const contributors = Object.entries(contributerMap).map(([name, commits])=>(
            {
                name,
                commits
            }
        ));
        const sortedContributors = [...contributors].sort(
        (a, b) => b.commits - a.commits
        );
        return Response.json({
            timeline,
            contributes: sortedContributors,
            commits
        });
        
    } catch (error) {
        return Response.json(
            { error: "Failed to fetch repository commits" },
            { status: 500 });
    }
}