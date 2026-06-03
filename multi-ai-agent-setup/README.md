# 🤖 Multi-AI Agent Platform with NVIDIA NIM

A production-ready, full-stack multi-agent AI system leveraging NVIDIA NIM API for LLM capabilities, featuring real-time collaboration, advanced memory systems, and a modern UI.

## 🎯 Features

- **Multi-Agent Architecture**: Collaborative AI agents (Planner, Coder, Reviewer, Tool Agent, To-Do Designer)
- **NVIDIA NIM Integration**: Direct integration with NVIDIA NIM API for LLM completions
- **Real-time Chat Interface**: Modern React-based UI with live agent activity logs
- **Advanced Memory System**: Short-term (in-memory) and long-term (persistent) memory
- **Task Orchestration**: Coordinated agent workflows with task tracking
- **Tool Execution Framework**: Agent-based tool calling system
- **Error Recovery**: Automatic retry mechanisms and fallback handling
- **Streaming Responses**: Real-time response streaming in the UI

## 📂 Project Structure

```
multi-ai-agent-platform/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── chat.ts
│   │   │   │   ├── agents.ts
│   │   │   │   └── memory.ts
│   │   │   ├── middleware/
│   │   │   │   ├── errorHandler.ts
│   │   │   │   └── logging.ts
│   │   │   └── index.ts
│   │   ├── agents/
│   │   ├── memory/
│   │   ├── nim/
│   │   ├── tools/
│   │   ├── utils/
│   │   └── server.ts
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   └── package.json
│
├── scripts/
│   ├── install.sh
│   ├── dev.sh
│   └── build.sh
│
└── docker-compose.yml
```

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:3000

## 🔌 NVIDIA NIM API

Uses NVIDIA NIM for LLM capabilities with OpenAI-compatible adapter.

**Setup:**
1. Get API key from NVIDIA NIM
2. Set `NVIDIA_NIM_API_KEY` in backend/.env
3. Platform handles the rest!

## 📄 License

MIT
