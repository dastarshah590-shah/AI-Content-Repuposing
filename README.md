# AI Content Repurposing Engine

A local full-stack MVP that turns one long-form content input into ready-to-publish assets for LinkedIn, X/Twitter, Instagram, short-form video, email, blog summaries, hooks, CTAs, hashtags, and content calendar ideas.

Deployment configuration is intentionally excluded.

## Completed Feature Set

- Animated SaaS dashboard UI with custom logo mark and icon navigation
- Paste text workflow for blogs, newsletters, articles, transcripts, podcast notes, and scripts
- Optional audio/video upload and transcription workflow
- Platform selector and tone/custom-tone selector
- Brand voice profiles with preferred tone, audience, words to use/avoid, CTA style, and examples
- Client folders and local team members
- Local account registration/login/profile editing
- Local plan switching for Free, Starter, Pro, and Agency tiers
- Monthly usage tracking and plan-based generation/platform/media/profile/team/client limits
- Server-side OpenAI Responses API integration when `OPENAI_API_KEY` is set
- Deterministic local demo generator when no API key is configured
- Separate editable output cards
- Copy, save, regenerate, and queue outputs
- Project history persisted across server restarts
- Reopen saved projects with latest generation outputs
- Export Markdown, TXT, CSV, PDF, DOCX, Notion-style Markdown, and content calendar CSV
- Integration dashboard for social, docs, scheduler, and automation destinations
- Local-demo integration connect/disconnect and publish queue
- Express validation, rate limiting, error handling, and media file validation
- Persistent local JSON storage in `server/data/local-store.json`

## Tech Stack

- React + Vite
- Node.js + Express
- OpenAI API
- Multer for media upload
- jsPDF and docx for local exports
- JSON file persistence for local development

## Setup

```bash
npm install
cp .env.example .env
```

Add your OpenAI key to `.env` for live AI generation and transcription:

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.5
OPENAI_TRANSCRIPTION_MODEL=gpt-4o-transcribe
```

Without an API key, the app runs in local demo generation mode.

## Development

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

The API runs at:

```text
http://127.0.0.1:3001
```

## Production Build

```bash
npm run build
```

## Useful Endpoints

- `GET /api/health`
- `GET /api/auth/session`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/plans`
- `PUT /api/plan`
- `GET /api/projects`
- `GET /api/projects/:projectId`
- `POST /api/generate`
- `POST /api/regenerate`
- `PUT /api/outputs/:outputId`
- `GET /api/brand-profiles`
- `POST /api/brand-profiles`
- `GET /api/workspace`
- `POST /api/clients`
- `POST /api/team-members`
- `POST /api/upload`
- `POST /api/transcribe`
- `GET /api/integrations`
- `POST /api/integrations/:integrationId/connect`
- `POST /api/publish-queue`

## Local Persistence

Local app data is stored in:

```text
server/data/local-store.json
```

Uploaded media is stored in:

```text
server/uploads
```

These are local development stores, not production database/storage replacements.

## Not Included

- Production deployment configuration
- Real Stripe checkout
- Real OAuth posting to social platforms
- Production auth provider such as Clerk/Auth.js/Supabase Auth
- Production database/storage provisioning

Those require external credentials, callback URLs, and deployment-specific configuration.