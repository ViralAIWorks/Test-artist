import { randomUUID } from "node:crypto";
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
    if (/^\/uploads\/[a-zA-Z0-9._-]+$/.test(value)) return true;
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
  const validSections = (sections) =>
    sections === undefined ||
    (Array.isArray(sections) &&
      sections.length <= 30 &&
      sections.every(
        (section) =>
          section &&
          ["title", "text", "image", "imageAlt"].every(
            (field) =>
              typeof section[field] === "string" &&
              section[field].length <= (field === "text" ? 5000 : 1000),
          ) &&
          isSafeUrl(section.image),
      ));
  const validStringFields = (value, fields) =>
    value &&
    fields.every(([field, limit = 5000]) =>
      typeof value[field] === "string" && value[field].length <= limit,
    );
  const validItems = (items, fields, urls = []) =>
    Array.isArray(items) &&
    items.length <= 30 &&
    items.every((item) =>
      validStringFields(item, fields) && urls.every((field) => isSafeUrl(item[field])),
    );
  const validBlocks = (blocks) =>
    blocks === undefined ||
    (Array.isArray(blocks) &&
      blocks.length <= 30 &&
      blocks.every((block) => {
        if (!block || typeof block !== "object") return false;
        if (block.type === "feature") {
          return (
            validStringFields(block, [
              ["eyebrow", 1000], ["title", 1000], ["text"], ["image", 1000],
              ["imageAlt", 1000], ["credit", 1000], ["creditUrl", 1000],
              ["linkLabel", 1000], ["linkUrl", 1000],
            ]) &&
            isSafeUrl(block.image) &&
            isSafeUrl(block.creditUrl) &&
            isSafeUrl(block.linkUrl)
          );
        }
        if (block.type === "cards") {
          return (
            validStringFields(block, [["eyebrow", 1000], ["title", 1000], ["description"]]) &&
            ["cards", "interests"].includes(block.variant) &&
            validItems(block.items, [["eyebrow", 1000], ["title", 1000], ["text"], ["icon", 100]])
          );
        }
        if (block.type === "timeline") {
          return (
            validStringFields(block, [["eyebrow", 1000], ["title", 1000], ["description"]]) &&
            validItems(block.items, [["date", 100], ["title", 1000], ["text"]])
          );
        }
        if (block.type === "gallery") {
          return (
            validStringFields(block, [["eyebrow", 1000], ["title", 1000], ["description"]]) &&
            validItems(
              block.items,
              [["image", 1000], ["imageAlt", 1000], ["caption", 1000], ["credit", 1000], ["creditUrl", 1000]],
              ["image", "creditUrl"],
            )
          );
        }
        if (block.type === "facts") {
          return (
            validStringFields(block, [["title", 1000]]) &&
            validItems(block.items, [["label", 1000], ["value", 1000]])
          );
        }
        if (block.type === "text") {
          return validStringFields(block, [["eyebrow", 1000], ["title", 1000], ["text"]]);
        }
        if (block.type === "quote") {
          return validStringFields(block, [["text"], ["cite", 1000]]);
        }
        return false;
      }));
  return (
    homeFields.every(
      (key) =>
        typeof content.home[key] === "string" &&
        content.home[key].length <= 10000,
    ) &&
    isSafeUrl(content.home.image) &&
    isSafeUrl(content.home.imageCreditUrl) &&
    validSections(content.home.sections) &&
    pageKeys.every(
      (key) =>
        content.pages[key] &&
        ["eyebrow", "title", "description"].every(
          (field) =>
            typeof content.pages[key][field] === "string" &&
            content.pages[key][field].length <= 10000,
        ) &&
        validBlocks(content.pages[key].blocks) &&
        validSections(content.pages[key].sections),
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

const uploadTypes = {
  "image/jpeg": { extension: "jpg", signature: (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff },
  "image/png": { extension: "png", signature: (bytes) => bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  "image/webp": { extension: "webp", signature: (bytes) => bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP" },
  "image/gif": { extension: "gif", signature: (bytes) => ["GIF87a", "GIF89a"].includes(bytes.toString("ascii", 0, 6)) },
};

async function uploadImage(req, res) {
  if (!isSameOrigin(req)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  const { type, data } = req.body?.image ?? {};
  const imageType = uploadTypes[type];
  if (typeof data !== "string" || !imageType || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(data)) {
    return res.status(400).json({ error: "Invalid image file" });
  }
  const bytes = Buffer.from(data, "base64");
  if (bytes.length === 0 || bytes.length > 3 * 1024 * 1024 || !imageType.signature(bytes)) {
    return res.status(400).json({ error: "Image must be a valid JPEG, PNG, WebP, or GIF under 3 MB" });
  }

  try {
    const { owner, repo, branch } = repositoryConfig();
    const filename = `${randomUUID()}.${imageType.extension}`;
    const path = `public/uploads/${filename}`;
    const response = await githubRequest(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Add image from content dashboard",
          content: bytes.toString("base64"),
          branch,
        }),
      },
    );
    if (!response.ok) {
      console.error("GitHub image upload failed:", response.status);
      return res.status(502).json({ error: "GitHub could not save the image" });
    }
    return res.status(201).json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Could not upload dashboard image:", error);
    return res.status(502).json({ error: "Could not upload image to GitHub" });
  }
}

export default async function handler(req, res) {
  if (!["GET", "PUT", "POST"].includes(req.method)) {
    res.setHeader("Allow", "GET, PUT, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!getSession(req)) {
    return res.status(401).json({ error: "Sign in to manage website content" });
  }
  if (req.method === "POST") return uploadImage(req, res);
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
