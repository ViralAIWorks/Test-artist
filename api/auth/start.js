import { randomBytes } from "node:crypto";
import { stateCookie } from "../../server/auth.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method not allowed");
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const callbackUrl = process.env.GITHUB_OAUTH_CALLBACK_URL;
  if (!clientId || !callbackUrl) {
    return res.status(500).end("GitHub OAuth is not configured");
  }

  const state = randomBytes(32).toString("hex");
  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", callbackUrl);
  authorizeUrl.searchParams.set("scope", "read:user");
  authorizeUrl.searchParams.set("state", state);

  res.setHeader("Set-Cookie", stateCookie(state));
  return res.redirect(302, authorizeUrl.toString());
}
