# Digibiz - Watson Business Copilot

**IBM Dev Day AI Demystified Hackathon - Proof of Concept**

Digibiz is an AI-powered business copilot designed to help small and medium enterprises (SMEs) automate repetitive business workflows through a conversational AI interface. This project demonstrates agentic AI capabilities using IBM Watson services.

## Project Overview

Digibiz (Watson Business Copilot) enables SMEs to streamline their business operations by automating tasks such as invoice processing and generating basic business insights. The solution provides a natural language interface that allows users to interact with their business data conversationally, reducing manual effort and improving efficiency.

**Note:** This is a proof-of-concept demonstration built for the IBM Dev Day AI Demystified Hackathon. It is not intended for production use.

## MVP Scope

The current MVP implementation includes:

- **React Frontend**: Simple chat interface for user interactions
- **Invoice Upload**: Document upload functionality with data extraction capabilities
- **Backend API**: Node.js server handling frontend requests and orchestrating Watson services
- **Agentic AI Flow**: Workflow orchestration using IBM watsonx Orchestrate
- **Conversational AI**: IBM Watson Assistant for natural language interactions
- **Document Storage**: IBM Cloud Object Storage for storing documents and extracted data

## Architecture

The MVP follows a simple, layered architecture:

```
Frontend (React)
    ↓
Backend API (Node.js)
    ↓
IBM Watson Services
    ↓
Cloud Object Storage
```

- **Frontend**: React application providing the user interface
- **Backend API**: Node.js server acting as the middleware layer
- **Watson Services**: IBM Watson Assistant and watsonx Orchestrate for AI capabilities
- **Storage**: IBM Cloud Object Storage for persistent data storage

## Tech Stack

- **Frontend**: React (JavaScript)
- **Backend**: Node.js with Express
- **AI Services**:
  - IBM Watson Assistant
  - IBM watsonx Orchestrate
- **Storage**: IBM Cloud Object Storage

## Repository Structure

```
Digibiz/
├── frontend/          # React frontend application
│   ├── src/           # Source files
│   ├── package.json   # Frontend dependencies
│   └── README.md      # Frontend setup instructions
│
├── backend/           # Node.js backend API
│   ├── server.js      # Express server
│   ├── package.json   # Backend dependencies
│   └── README.md      # Backend setup instructions
│
└── README.md          # This file
```

## How to Run

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- IBM Cloud account with Watson services configured

### Frontend

```bash
cd frontend
npm install
npm start
```

The frontend will be available at `http://localhost:5173`

### Backend

```bash
cd backend
npm install
npm start
```

The backend API will be available at `http://localhost:3000`

**Note:** Ensure that IBM Watson service credentials are properly configured in the backend environment variables before running the application.

## Disclaimer

This project is a **proof of concept** developed for demonstration purposes during the IBM Dev Day AI Demystified Hackathon. It is not intended for production use and may contain limitations, incomplete features, or security considerations that would need to be addressed before any real-world deployment.

---

**Built for IBM Dev Day AI Demystified Hackathon**
