# API Documentation

## Endpoint

### GET `/api/repo`

Fetch analytics for a GitHub repository.

---

## Query Parameters

| Param | Type   | Required | Description           |
| ----- | ------ | -------- | --------------------- |
| url   | string | Yes      | GitHub repository URL |
| branch   | string | No      | GitHub repository BRANCH |


---

## Example Request

```bash id="rq73ks"
/api/repo?url=https://github.com/user/repo&branch=main
```

---

## What Happens Internally

1. Extract repo details from URL
2. Fetch data using GitHub API, including but not limited to:

   * Commits
   * Pull Requests
   * Issues
   * Contributors
3. Process data into structured format
4. Return analytics response

---


## Response Structure

```ts id="respstruct01"
type ResponseData = {
  timeline: { date: string; commits: number }[]
  contributors: { name: string; commits: number }[]
  commits: { date: string; author: string; message: string }[]
  prs: { name: string; prs: number }[]
  issues: { name: string; issues: number }[]
  branches: string[]
  stats: {
    totalCommits: number
    activeDays: number
    totalPRs: number
    totalIssues: number
    busFactor: number
    totalContributors: number
  }
  error?: string
}
```

---

## Field Notes

* **timeline** → commit activity grouped by date
* **contributors** → contributors ranked by commits
* **commits** → commit history (author + message)
* **prs** → pull request contributions per user
* **issues** → issue contributions per user
* **branches** → available repository branches
* **stats** → aggregated repository insights
* **error** → present only when request fails

---

## Notes

* `branch` defaults to `"main"` if not provided
* GitHub token recommended to avoid rate limits
* Large repositories may increase response time
* Data is computed on request (no caching yet)

## Future Improvements

* Add caching layer
* Paginated fetching for large repos
* Error handling improvements
* Rate limit awareness
