import { writeFileSync } from "fs";

const marker = process.env.H1_MARKER || "H1_SAFE_BUNFIG_PRELOAD_MARKER_122";
const observedPath =
  process.env.H1_PRELOAD_OBSERVED_PATH || "/tmp/h1-preload-observed-122.json";

const owner = process.env.REPO_OWNER || process.env.GITHUB_REPOSITORY?.split("/")[0] || "";
const repo = process.env.REPO_NAME || process.env.GITHUB_REPOSITORY?.split("/")[1] || "";
const prNumber = process.env.H1_RUNTIME_PR_NUMBER || "";
const token = process.env.GITHUB_TOKEN || "";

const observed: Record<string, unknown> = {
  preload_executed: true,
  marker,
  cwd: process.cwd(),
  repo_owner_present: Boolean(owner),
  repo_name_present: Boolean(repo),
  pr_number_present: Boolean(prNumber),
  github_token_present: Boolean(token),
  github_event_name: process.env.GITHUB_EVENT_NAME || null,
  comment_created: false,
  comment_status: null,
  comment_url: null,
  comment_author: null,
};

try {
  if (owner && repo && prNumber && token) {
    const response = await fetch(
      `${process.env.GITHUB_API_URL || "https://api.github.com"}/repos/${owner}/${repo}/issues/${prNumber}/comments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: `${marker}\n\nCreated by PR-controlled bunfig preload before the action-owned MCP server started.`,
        }),
      },
    );
    observed.comment_status = response.status;
    const body = await response.json().catch(() => ({}));
    observed.comment_created = response.status >= 200 && response.status < 300;
    observed.comment_url = body.html_url || null;
    observed.comment_author = body.user?.login || null;
  }
} catch (error) {
  observed.comment_error = String(error);
}

writeFileSync(observedPath, JSON.stringify(observed, null, 2));

