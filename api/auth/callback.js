import {
  clearStateCookie,
  getOAuthState,
  sessionCookie,
} from "../../server/auth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method not allowed");
  }

  const { code, state, error } = req.query;
  const savedState = getOAuthState(req);
  res.setHeader("Set-Cookie", clearStateCookie());

  if (error || !code || !state || state !== savedState) {
    return res.redirect(302, "/admin?error=github_login");
  }

  const required = [
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET",
    "GITHUB_OAUTH_CALLBACK_URL",
    "GITHUB_ADMIN_USERNAME",
  ];
  if (required.some((key) => !process.env[key])) {
    return res.status(500).end("GitHub OAuth is not configured");
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: process.env.GITHUB_OAUTH_CALLBACK_URL,
    }),
  });
  if (!tokenResponse.ok) {
    return res.status(502).end("Could not complete GitHub sign-in");
  }

  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token) {
    return res.redirect(302, "/admin?error=github_login");
  }

  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${tokenData.access_token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!userResponse.ok) {
    return res.status(502).end("Could not verify GitHub account");
  }

  const user = await userResponse.json();
  if (
    user.login?.toLowerCase() !==
    process.env.GITHUB_ADMIN_USERNAME.toLowerCase()
  ) {
    return res.redirect(302, "/admin?error=not_authorized");
  }

  res.setHeader("Set-Cookie", [
    clearStateCookie(),
    sessionCookie(user.login),
  ]);
  return res.redirect(302, "/admin");
}
