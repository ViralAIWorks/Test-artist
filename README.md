# Karina in focus

The public website is a React/Vite app. Public copy managed by the dashboard lives in
[`src/data/content.json`](./src/data/content.json). The private dashboard is available at
`/admin`; publishing creates a commit in GitHub and Vercel deploys it automatically.

## Dashboard setup on Vercel

The dashboard uses GitHub OAuth for sign-in and a fine-grained GitHub token, stored only
as a Vercel environment variable, to update the content file. No paid CMS or database is
required.

1. Create a GitHub OAuth App. Set its authorization callback URL to
   `https://<your-production-domain>/api/auth/callback`. The app requests only the
   `read:user` scope. Set the OAuth app's client ID and secret in Vercel.
2. Create a fine-grained personal access token for this repository only. Grant
   **Contents: Read and write**. The token is used by the server-side Vercel function;
   never add it to frontend code or commit it to Git.
3. Add these environment variables to the Vercel project, then redeploy:

   | Variable | Value |
   | --- | --- |
   | `GITHUB_CLIENT_ID` | OAuth App client ID |
   | `GITHUB_CLIENT_SECRET` | OAuth App client secret |
   | `GITHUB_OAUTH_CALLBACK_URL` | Exact callback URL from step 1 |
   | `GITHUB_ADMIN_USERNAME` | GitHub username allowed to sign in |
   | `GITHUB_CONTENT_TOKEN` | Fine-grained token from step 2 |
   | `GITHUB_REPOSITORY` | `ViralAIWorks/Test-artist` |
   | `GITHUB_BRANCH` | `main` |
   | `ADMIN_SESSION_SECRET` | Random secret of at least 32 bytes |

   Generate a session secret with `openssl rand -base64 32`. Store it only in Vercel
   environment variables.
4. Open `https://<your-production-domain>/admin`, sign in with the allowed GitHub
   account, edit the homepage or page introductions, and choose **Lưu và xuất bản**.

The dashboard edits the homepage hero and quick facts, each page's introduction, and
the content blocks on every other page. These blocks include featured images and copy,
cards, timelines, personal facts, galleries, quotes, and text; their entries can be
added or removed. Additional sections can also be set to text, image, image with text
stacked vertically, or a two-column image-and-text layout. To upload an image from the
dashboard, choose a JPEG, PNG, WebP, or GIF smaller than 3 MB; it is committed under
`public/uploads/` and served by Vercel after deployment. Uploaded images and content
changes are saved in separate GitHub commits, so allow both deployments to finish before
expecting the new section and image to appear on the live site.
