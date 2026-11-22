import { getSession } from "../../server/auth.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method not allowed");
  }
  const session = getSession(req);
  return res.status(200).json({ authenticated: Boolean(session), user: session?.username ?? null });
}
