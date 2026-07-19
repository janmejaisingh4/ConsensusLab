# ConsensusLab — Self-Consistency Answer Engine

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![License](https://img.shields.io/badge/License-MIT-green)

ConsensusLab is a full-stack GenAI application that improves answer quality using **self-consistency**. It sends the same question to OpenAI, Claude, and Gemini in parallel, then asks an evaluator to combine their strongest reasoning into one original answer.

## Architecture

```text
User prompt
    ├── OpenAI ──┐
    ├── Claude ──┼── Claude evaluator ── Refined answer
    └── Gemini ──┘       └── OpenAI fallback
```

1. Validate the prompt and selected providers.
2. Call every model concurrently with `Promise.allSettled()`.
3. Record each answer, latency, and provider error independently.
4. Require at least two successful answers.
5. Ask Claude to compare facts, reasoning, clarity, and blind spots.
6. Use OpenAI if the Claude evaluation fails.
7. Display individual responses and the synthesized answer.

## Features

- OpenAI, Claude, and Gemini integrations
- Concurrent API orchestration
- Claude evaluator with OpenAI fallback
- Partial-provider failure tolerance
- Demo mode without API keys
- Server-only secret handling and timeouts
- Loading, validation, and error states
- Responsive, accessible UI
- Copy-to-clipboard and latency reporting

## Stack

Next.js 15, React 19, TypeScript, App Router, native CSS, OpenAI API, Anthropic API, Gemini API, and Vercel.

## Project structure

```text
app/
├── api/consensus/route.ts   # validation and orchestration
├── globals.css              # responsive design system
├── layout.tsx               # metadata and shell
└── page.tsx                 # interactive interface
lib/
├── demo.ts                  # no-key demo responses
├── providers.ts             # providers and evaluator
└── types.ts                 # shared contracts
```

# Step-by-step setup

## 1. Prerequisites

Install Node.js 20.9+, npm 10+, and Git.

```bash
node --version
npm --version
git --version
```

## 2. Clone

```bash
git clone https://github.com/janmejaisingh4/ConsensusLab.git
cd ConsensusLab
```

## 3. Install

```bash
npm install
```

## 4. Configure environment variables

```bash
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Add credentials:

```env
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GEMINI_API_KEY=your_gemini_key
```

Never commit `.env.local`. With fewer than two configured providers, the app automatically uses demo mode.

## 5. Start development

```bash
npm run dev
```

Open http://localhost:3000.

## 6. Test the flow

1. Enter a question.
2. Select at least two models.
3. Click **Generate consensus**.
4. Review the independent answers.
5. Read and copy the final synthesis.

## 7. Verify quality

```bash
npm run lint
npm run typecheck
npm run build
```

## 8. Run production locally

```bash
npm start
```

# API reference

`POST /api/consensus`

Request:

```json
{"prompt":"Explain quantum computing simply.","providers":["openai","claude","gemini"]}
```

Response:

```json
{
  "mode":"live",
  "responses":[{"provider":"openai","model":"gpt-4.1-mini","answer":"...","latencyMs":1240}],
  "synthesis":"...",
  "evaluator":"Claude Sonnet 4",
  "totalMs":2870
}
```

# Error handling

| Situation | Behaviour |
|---|---|
| Prompt outside 3–2,000 characters | HTTP 400 |
| Fewer than two providers | HTTP 400 |
| Provider timeout | That provider is marked failed |
| One provider fails | Remaining providers continue |
| Fewer than two successful answers | HTTP 502 |
| Claude evaluation fails | OpenAI evaluates |
| Insufficient API keys | Demo mode |

# Security

API keys remain server-side, environment files are ignored, inputs are length-limited, and outbound calls have timeouts. For commercial use, add authentication, rate limiting, quotas, abuse prevention, and monitoring.

# Deploy to Vercel

1. Open https://vercel.com and select **Add New → Project**.
2. Import `janmejaisingh4/ConsensusLab`.
3. Add the three API keys under Environment Variables.
4. Click **Deploy** and test the production URL.

CLI alternative:

```bash
npm install -g vercel
vercel
vercel --prod
```

# Troubleshooting

- **Demo mode:** configure at least two keys and restart the server.
- **401:** verify the relevant provider key.
- **429:** wait or review provider usage limits.
- **Build issue:** delete `.next` and `node_modules`, reinstall, and rebuild.

# Submission checklist

- [x] User prompt
- [x] Multiple model responses
- [x] Parallel orchestration
- [x] Evaluator synthesis
- [x] Loading and error handling
- [x] Responsive UI
- [x] Demo mode
- [x] Public repository
- [x] Live deployment
- [x] Professional README

## Author

**Janmejai Singh**
