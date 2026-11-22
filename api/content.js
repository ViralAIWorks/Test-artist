import { getSession, isSameOrigin } from "../server/auth.js";

const contentPath = "src/data/content.json";

function repositoryConfig() {
  const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? "").split("/");
  const token = process.env.GITHUB_CONTENT_TOKEN;
  const branch = process.env.GITHUB_BRANCH ?? "main";
  if (!owner || !repo || !token) {
    throw new Error("GitHub content publishing is not configured");
  }
  return { owner, repo, token, branch };
}

async function githubRequest(url, options = {}) {
  const { token } = repositoryConfig();
  return fetch(url, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "Test-artist-content-dashboard",
      ...options.headers,
    },
  });
}

async function readContent() {
  const { owner, repo, branch } = repositoryConfig();
  const url = new URL(
    `https://api.github.com/repos/${owner}/${repo}/contents/${contentPath}`,
  );
  url.searchParams.set("ref", branch);
  const response = await githubRequest(url);
  if (!response.ok) {
    throw new Error(`GitHub returned ${response.status} while reading content`);
  }
  const file = await response.json();
  return {
    content: JSON.parse(Buffer.from(file.content, "base64").toString("utf8")),
    sha: file.sha,
  };
}

function validContent(content) {
  if (!content || typeof content !== "object" || Array.isArray(content)) return false;
  if (!content.home || !content.pages || !Array.isArray(content.stats)) return false;
  const isSafeUrl = (value) => {
    if (!value) return true;
    try {
      return ["http:", "https:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  };
  const homeFields = [
    "eyebrow",
    "title",
    "subtitle",
    "description",
    "image",
    "imageAlt",
    "imageBadge",
    "imageCaption",
    "imageCredit",
    "imageCreditUrl",
    "imageLicense",
  ];
  const pageKeys = ["profile", "music", "achievements", "interests", "gallery"];
  return (
    homeFields.every(
      (key) =>
        typeof content.home[key] === "string" &&
        content.home[key].length <= 10000,
    ) &&
    isSafeUrl(content.home.image) &&
    isSafeUrl(content.home.imageCreditUrl) &&
    pageKeys.every(
      (key) =>
        content.pages[key] &&
        ["eyebrow", "title", "description"].every(
          (field) =>
            typeof content.pages[key][field] === "string" &&
            content.pages[key][field].length <= 10000,
        ),
    ) &&
    content.stats.length <= 8 &&
    content.stats.every(
      (stat) =>
        stat &&
        typeof stat.value === "string" &&
        typeof stat.label === "string" &&
        stat.value.length <= 120 &&
        stat.label.length <= 120,
    )
  );
}

export default async function handler(req, res) {
  if (!["GET", "PUT"].includes(req.method)) {
    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!getSession(req)) {
    return res.status(401).json({ error: "Sign in to manage website content" });
  }
  if (req.method === "GET") {
    try {
      const { content, sha } = await readContent();
      return res.status(200).json({ content, sha });
    } catch (error) {
      console.error("Could not read website content:", error);
      return res.status(502).json({ error: "Could not load content from GitHub" });
    }
  }
  if (!isSameOrigin(req)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { content, sha } = req.body ?? {};
  if (!validContent(content) || typeof sha !== "string") {
    return res.status(400).json({ error: "Invalid content payload" });
  }

  try {
    const { owner, repo, token, branch } = repositoryConfig();
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${contentPath}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "Test-artist-content-dashboard",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Update website content from dashboard",
          content: Buffer.from(`${JSON.stringify(content, null, 2)}\n`).toString("base64"),
          sha,
          branch,
        }),
      },
    );
    if (response.status === 409 || response.status === 422) {
      return res.status(409).json({
        error: "Content changed in GitHub since it was opened. Reload before saving.",
      });
    }
    if (!response.ok) {
      console.error("GitHub content update failed:", response.status);
      return res.status(502).json({ error: "GitHub could not save the content" });
    }
    const result = await response.json();
    return res.status(200).json({ sha: result.content.sha, commit: result.commit.sha });
  } catch (error) {
    console.error("Could not save website content:", error);
    return res.status(502).json({ error: "Could not publish content to GitHub" });
  }
}
