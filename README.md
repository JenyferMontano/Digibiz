# Digibiz - Lean AI Consultant for SMEs

**IBM Dev Day AI Demystified Hackathon - Proof of Concept**

Digibiz is an AI-powered consulting platform that digitizes Lean principles into a guided, gamified experience for small and medium enterprises (SMEs). The platform uses IBM watsonx Orchestrate to coordinate 4 collaborative AI agents that guide businesses through the Organize → Improve → Grow (OMC) framework.

## Tech Stack

- **Frontend/Backend**: Next.js 16 (App Router) with TypeScript
- **AI Agents**: IBM watsonx Orchestrate (4 collaborative agents)
- **Database**: IBM Cloudant (NoSQL)
- **Authentication**: IBM IAM

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment variables:**

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Access the app:**
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api/*

## Agent Architecture

The platform uses 4 collaborative agents orchestrated by watsonx Orchestrate:

1. **Assessment Agent**: Analyzes business descriptions to detect Lean wastes (Overproduction, Waiting, Transportation)
2. **Lean Coach Agent**: Selects the next mission based on current business level (Organize/Improve/Grow)
3. **Execution Agent**: Generates actionable steps and provides templates for assigned missions
4. **Validation Agent**: Evaluates uploaded evidence against mission checklists

## API Endpoints

- `POST /api/start` - Starts agent flow (Assessment → Lean Coach → Execution)
- `POST /api/validate` - Validates evidence using Validation Agent
- `GET /api/progress` - Gets business progress from Cloudant

## Project Structure

```
Digibiz/
├── app/
│   ├── api/              # Next.js API Routes
│   ├── components/       # React components (AgentChat, AgentOrchestrator)
│   └── page.tsx          # Main page
├── lib/
│   ├── cloudant.ts       # Cloudant database utilities
│   ├── watson.ts         # watsonx Orchestrate API calls (with mock fallback)
│   ├── services.ts       # Business logic
│   └── agent-mocks.ts    # Mock agent responses
└── package.json
```

## Mock System

The system includes automatic fallback to mock responses when watsonx Orchestrate API is unavailable. Mocks replicate the logic of the configured agents, ensuring the demo flow works regardless of API availability.

## Documentation

- **SETUP.md** - Detailed setup and configuration guide
- **POSTMAN_QUICK_TEST.md** - Postman collection for API testing


## Disclaimer

This project is a **proof of concept** developed for demonstration purposes during the IBM Dev Day AI Demystified Hackathon. It is not intended for production use.
