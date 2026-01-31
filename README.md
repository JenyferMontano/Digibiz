# Digibiz - Watson AI Consultant for SMEs

**IBM Dev Day AI Demystified Hackathon - Proof of Concept**

Digibiz is an AI-powered consulting platform that digitizes Lean principles into a guided, gamified experience for small and medium enterprises (SMEs). This project demonstrates agentic AI capabilities using IBM watsonx Orchestrate.

## Project Overview

Digibiz (Watson AI Consultant) enables SMEs to systematically improve their business operations through a gamified Lean consulting platform. The solution applies Lean principles (Organize → Improve → Grow) as structured progression levels, where businesses advance by demonstrating real operational improvement through evidence-based validation.

**Note:** This is a proof-of-concept demonstration built for the IBM Dev Day AI Demystified Hackathon. It is not intended for production use.

## MVP Scope

The current MVP implementation includes:

- **Next.js Frontend**: Single page with embedded watsonx Orchestrate chat + visual progress dashboard
- **API Routes**: Next.js API routes (3 endpoints) for agent orchestration and state persistence
- **Agentic AI Flow**: 4 collaborative agents built in watsonx Orchestrate:
  - **Assessment Agent**: Analyzes business description to detect Lean wastes (Muda)
  - **Lean Coach Agent**: Decides next mission based on current level and business state
  - **Execution Agent**: Generates actionable steps and downloadable templates
  - **Validation Agent**: Evaluates uploaded evidence against mission checklist
- **Database**: IBM Cloudant for storing business state and evidence metadata

## Architecture

The MVP follows a simplified, purpose-driven architecture:

```
Next.js Frontend (App Router)
    ↓
Next.js API Routes (3 endpoints)
    ↓
watsonx Orchestrate (4 agents)
    ↓
IBM Cloudant (state persistence)
```

- **Frontend**: Next.js App Router with embedded watsonx Orchestrate chat interface
- **API Routes**: Lightweight layer for precise agent control and context passing
- **Watson Services**: watsonx Orchestrate for agentic AI orchestration
- **Storage**: IBM Cloudant for business state and evidence metadata

## Tech Stack

- **Frontend**: Next.js 16 (App Router) with TypeScript
- **Backend**: Next.js API Routes (3 endpoints)
- **AI Services**:
  - IBM watsonx Orchestrate (4 collaborative agents)
  - Granite 3.0 8B model (optimal cost/accuracy balance)
- **Database**: IBM Cloudant
- **Deployment**: Vercel (1-click deploy)

## Repository Structure

```
Digibiz/
├── app/
│   ├── api/                   # Next.js API Routes
│   │   ├── start/
│   │   │   └── route.ts       # Starts agent flow (Assessment → Lean Coach → Execution)
│   │   ├── validate/
│   │   │   └── route.ts       # Receives evidence → triggers Validation Agent
│   │   └── progress/
│   │       └── route.ts       # Gets business progress from Cloudant
│   │
│   ├── components/            # React components
│   │   ├── AgentChat.tsx      # Embedded watsonx Orchestrate chat interface
│   │   └── AgentOrchestrator.tsx  # Sequential agent orchestration
│   │
│   ├── page.tsx               # Frontend: embedded chat + visual progress dashboard
│   ├── layout.tsx
│   └── globals.css
│
├── lib/
│   ├── cloudant.ts            # Cloudant database utilities
│   ├── watson.ts              # watsonx Orchestrate API calls (with mock fallback)
│   ├── services.ts            # Business logic and agent orchestration
│   └── agent-mocks.ts         # Mock agent responses for demo fallback
│
├── models/
│   └── business-model.js      # Business process data model
│
├── POSTMAN_QUICK_TEST.md      # Postman collection for API testing
├── package.json
└── README.md                  # This file
```

## How to Run

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- IBM Cloud account with:
  - watsonx Orchestrate access
  - Cloudant instance
  - Service credentials configured

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables

3. **Run development server:**
   ```bash
   npm run dev
   ```

   The application will be available at http://localhost:3000

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

The easiest way to deploy is using Vercel:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel
```

Or use the Vercel Platform for one-click deployment.

## Agentic AI Flow

The platform demonstrates autonomous agent collaboration:

1. **User Input**: "I want to improve my grocery store"
2. **Assessment Agent**: Identifies "2-hour daily waiting during restocking" (waste detection)
3. **Lean Coach Agent**: Selects "Mission 2: Map Your Core Process" based on current level
4. **Execution Agent**: Delivers editable BPMN diagram template
5. **User Upload**: Photo of process map
6. **Validation Agent**: Approves evidence → Unlocks "Mission 3: Eliminate 1 Waste"
7. **Dashboard**: Visually updates progress (zero human intervention)

## API Endpoints

- `POST /api/start` - Starts agent flow (Assessment → Lean Coach → Execution)
- `POST /api/validate` - Validates evidence using Validation Agent
- `GET /api/progress` - Gets business progress from Cloudant

## Key Features

- **Gamified Lean Progression**: Organize → Improve → Grow levels with evidence-based validation
- **Agentic Orchestration**: 4 collaborative agents making autonomous decisions
- **Real-time Progress Dashboard**: Visual feedback on business maturity and mission completion
- **Evidence-based Validation**: Upload documents/images for AI-powered validation
- **No-code Agent Creation**: Agents built entirely in watsonx Orchestrate UI
- **Mock Fallback System**: Automatic fallback to mock responses when API unavailable

## Mock System

The system includes automatic fallback to mock responses when watsonx Orchestrate API is unavailable. Mocks replicate the logic of the configured agents, ensuring the demo flow works regardless of API availability.

## Documentation

- **POSTMAN_QUICK_TEST.md** - Postman collection for API testing

## Disclaimer

This project is a **proof of concept** developed for demonstration purposes during the IBM Dev Day AI Demystified Hackathon. It is not intended for production use and may contain limitations, incomplete features, or security considerations that would need to be addressed before any real-world deployment.

---

**Built for IBM Dev Day AI Demystified Hackathon**
