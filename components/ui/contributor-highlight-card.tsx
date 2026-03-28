type Contributor = {
    name: string;
    commits: number;
};

type ContributorsHighlightCardProps = {
    contributors: Contributor[];
};

export default function ContributorsHighlightCard({
    contributors,
}: ContributorsHighlightCardProps) {
    const topThreeContributors = contributors.slice(0, 3);



    return (
        <div className="bg-black text-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Top Contributors</h2>
            <ul>
                {topThreeContributors.map((contributor) => {
                    return (
                        <li key={contributor.name} className="flex justify-between mb-2">
                            <a href={`https://github.com/${contributor.name}`} target="_blank" rel="noopener noreferrer">
                                <span>{contributor.name}</span>
                            </a>
                            <span className="font-bold">{contributor.commits} commits</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}