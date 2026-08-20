================================================================================
ENERGYEMINENCE™ INDUSTRIAL DIGITAL TWIN PLATFORM - KRAFTGENE AI
================================================================================
README.txt
Version: 2.0.0
Release Date: 2026

--------------------------------------------------------------------------------
1. OVERVIEW
--------------------------------------------------------------------------------
EnergyEminence™ by Kraftgene AI Inc. is an enterprise-grade AI Digital Twin 
platform designed for real-time monitoring, state estimation, cascade 
prediction, and automated closed-loop control across critical infrastructure:

- Grid Distribution Network (GDN): IEEE 118-bus distribution feeder twin with 
  real-time active/reactive power balancing, micro-PMU telemetry, smart inverter 
  Volt-VAR dispatches, and BESS storage control.
- Grid Transmission Network (GTN): Multi-hop cascade failure detection and GNN-
  driven transmission line overload prediction.
- Oil & Gas Pipeline Twin: SCADA pressure/flow monitoring, leak detection, and 
  Emergency Shutdown (ESD) valve isolation.
- UAV Aerial Surveillance: Automated FLIR/Thermal & RGB optical drone feed analysis 
  for wildfire, thermal anomaly, and structural hazard detection.

--------------------------------------------------------------------------------
2. ARCHITECTURE & TECH STACK
--------------------------------------------------------------------------------
Frontend:
  - Next.js / React (Tailwind CSS, Mapbox GL / 3D Topo visualizers)
  - Web Speech API for native voice command input
  - Dynamic auto-expanding chat UI, floating/draggable windows, text selection

Backend & AI Engine:
  - Python 3.11+ / FastAPI (Async REST API & WebSockets)
  - PyTorch (Unified GDN Graph Neural Network Model)
  - Redis Sliding Window Buffer (Rolling T=10 telemetry stream)
  - Azure OpenAI Service (Fine-tuned GPT-4-1 Mini & GPT-4 Heavy models)
  - Autonomous Tool Execution Engine (SCADA, micro-PMU, ESD dispatches)

--------------------------------------------------------------------------------
3. PROJECT REPOSITORY STRUCTURE
--------------------------------------------------------------------------------
/
├── frontend/                      # Web Client
│   ├── src/
│   │   ├── components/
│   │   │   ├── AiCopilotWidget.jsx # AI Copilot Chat Interface
│   │   │   ├── GridMap.jsx         # 3D / Mapbox Visualizer
│   │   │   ├── GeographicView.jsx  # Topological/Geographic Views
│   │   │   ├── NodePanel.jsx       # Real-time Telemetry Panel
│   │   │   └── ...
│   │   └── api.js                  # Frontend API Bridge
│   └── package.json
│
├── backend/                       # Neural Engine & API Server
│   ├── main.py / server.py        # FastAPI Server & WebSocket Engine
│   ├── routes/
│   │   └── ai.py                  # Copilot Chat & UAV Surveillance Endpoint
│   ├── services/
│   │   ├── gt_tools.py            # Transmission Grid Tools
│   │   ├── pipeline_tools.py      # SCADA Pipeline Tools
│   │   └── gdn_tools.py           # Distribution Micro-PMU Tools
│   ├── models/                    # PyTorch GNN Architecture
│   ├── control/                   # Closed-Loop GDN Controller
│   └── requirements.txt
│
└── README.txt                     # Platform Documentation

--------------------------------------------------------------------------------
4. ENVIRONMENT CONFIGURATION (.env)
--------------------------------------------------------------------------------
Set the following environment variables in your backend environment:

  AZURE_OPENAI_ENDPOINT=https://azure-open-ai-model-for-energyeminence.openai.azure.com/
  AZURE_OPENAI_API_KEY=<YOUR_AZURE_OPENAI_KEY>
  AZURE_OPENAI_API_VERSION=2025-04-01-preview
  MINI_DEPLOYMENT=gpt-4-1-mini-2025-04-14-kraftgeneai
  HEAVY_DEPLOYMENT=gpt-4-04-14-kraftgeneai
  WEBSITE_API_URL=https://www.kraftgeneai.ca
  JWT_SECRET=kraftgene_super_secret_key_2026_x89z!
  GDN_ENV=prod  # Options: dev / prod

--------------------------------------------------------------------------------
5. SETUP & LOCAL INSTALLATION
--------------------------------------------------------------------------------
Backend Setup:
  1. cd backend
  2. python -m venv venv
  3. source venv/bin/activate  (or venv\Scripts\activate on Windows)
  4. pip install -r requirements.txt
  5. uvicorn main:app --reload --host 0.0.0.0 --port 8000

Frontend Setup:
  1. cd frontend
  2. npm install
  3. npm run dev

Authentication Note:
  On localhost (127.0.0.1 / localhost), the frontend automatically uses a 
  development bypass token (`dev_localhost_token`), enabling full tool 
  testing without signing in. Production deployments enforce JWT token 
  validation via kraftgeneai.ca.

--------------------------------------------------------------------------------
6. API ENDPOINTS & FUNCTION TOOLS
--------------------------------------------------------------------------------
HTTP Endpoints:
  - GET  /api/gdn/topology       : Returns static 118-bus layout & topology
  - GET  /api/gdn/state          : Instant neural state estimation snapshot
  - GET  /api/gdn/control        : Closed-loop active balancing control dispatches
  - POST /api/telemetry/ingest   : Batch smart meter ping ingestion
  - POST /api/copilot/chat       : Autonomous Copilot Assistant API
  - POST /api/vision/surveillance: Silent UAV drone FLIR/optical frame analyzer

WebSocket Endpoint:
  - WS   /ws/grid                : Low-latency real-time state stream tick

Autonomous AI Tools Executed:
  - get_bus_telemetry(bus_id)
  - execute_gdn_control_dispatch(bus_id, q_mvar, bess_p_mw, tap_step)
  - get_cascade_predictions()
  - execute_transmission_dispatch(node_id, action, amount_mw)
  - get_scada_telemetry(segment_id)
  - execute_esd_valve_isolation(segment_id, valves_to_close)

--------------------------------------------------------------------------------
7. COPYRIGHT & PROPRIETARY NOTICE
--------------------------------------------------------------------------------
Copyright (c) 2026 Kraftgene AI Inc. All rights reserved.

This software, source code, neural network model weights, digital twin 
architectures, and associated documentation are the exclusive proprietary 
property of Kraftgene AI Inc. (https://www.kraftgeneai.ca).

UNAUTHORIZED COPYING, DECOMPILATION, REVERSE ENGINEERING, MODIFICATION, 
DISTRIBUTION, OR REPRODUCTION OF THIS SOFTWARE, IN WHOLE OR IN PART, VIA ANY 
MEDIUM, IS STRICTLY PROHIBITED WITHOUT EXPRESS WRITTEN CONSENT FROM 
KRAFTGENE AI INC.

For licensing inquiries, enterprise deployment, or technical support:
Website : https://www.kraftgeneai.ca
Contact : customer@kraftgeneai.ca
================================================================================