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

        return Response.json({ raw: data });

    } catch (error) {
        return Response.json(
            { error: "Failed to fetch repository commits" },
            { status: 500 });
    }
}