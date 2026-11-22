import { clearSessionCookie, getSession, isSameOrigin } from "../../server/auth.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method not allowed");
  }
  if (!isSameOrigin(req) || !getSession(req)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  res.setHeader("Set-Cookie", clearSessionCookie());
  return res.status(200).json({ authenticated: false });
}
