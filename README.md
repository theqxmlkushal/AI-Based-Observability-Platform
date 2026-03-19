# 🔭 AI-Based Observability Platform

> A real-time, AI-powered monitoring and observability platform built with Node.js and Docker — designed to give developers deep visibility into application health, performance metrics, and anomalies.

![JavaScript](https://img.shields.io/badge/JavaScript-98.5%25-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=flat-square&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running with Docker](#running-with-docker)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [Configuration](#-configuration)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 📖 About the Project

The **AI-Based Observability Platform** is a full-stack monitoring solution that combines traditional observability (logs, metrics, traces) with AI-driven insights. It helps developers and DevOps teams proactively detect anomalies, understand system behaviour, and reduce mean time to resolution (MTTR) — all through a clean, interactive dashboard.

Whether you're monitoring a microservice, a monolith, or an entire infrastructure, this platform surfaces what matters most without drowning you in noise.

---

## ✨ Features

- 📊 **Real-time Metrics Dashboard** — Live visualization of key performance indicators (CPU, memory, request latency, error rates)
- 🤖 **AI-Powered Anomaly Detection** — Automatically flags unusual patterns in logs and metrics
- 📝 **Centralized Log Aggregation** — Collect, search, and filter logs across services in one place
- 🔔 **Smart Alerting** — Threshold-based and ML-driven alerts with configurable notification channels
- 🐳 **Docker-First Deployment** — Entire stack spins up with a single `docker-compose` command
- 🌐 **REST API** — Expose observability data programmatically for integration with other tools
- 📱 **Responsive UI** — Works across desktop and mobile browsers

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────┐
│              Browser / Dashboard UI          │
│              (HTML + CSS + JS)               │
└────────────────────┬────────────────────────┘
                     │ HTTP / WebSocket
┌────────────────────▼────────────────────────┐
│            monitoring-app (Node.js)          │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │  REST API│  │ AI Engine│  │  Alerting │  │
│  └──────────┘  └──────────┘  └───────────┘  │
└────────────────────┬────────────────────────┘
                     │
┌────────────────────▼────────────────────────┐
│               Docker Compose                 │
│  ┌──────────────┐  ┌────────────────────┐   │
│  │  App Service │  │  Data / Storage    │   │
│  └──────────────┘  └────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

| Layer        | Technology                  |
|--------------|-----------------------------|
| Frontend     | HTML, CSS, JavaScript       |
| Backend      | Node.js                     |
| Containerization | Docker, Docker Compose  |
| AI / Analytics | Custom JS anomaly logic   |
| Transport    | REST API, WebSockets        |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v16 or higher
- [npm](https://www.npmjs.com/) v8 or higher
- [Docker](https://www.docker.com/) v20 or higher
- [Docker Compose](https://docs.docker.com/compose/) v2 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/theqxmlkushal/AI-Based-Observability-Platform.git

# 2. Navigate into the project directory
cd AI-Based-Observability-Platform

# 3. Install dependencies for the monitoring app
cd monitoring-app
npm install
```

### Running Locally (without Docker)

```bash
# From inside the monitoring-app directory
npm start
```

The app will be available at `http://localhost:3000` by default.

### Running with Docker

```bash
# From the root of the project
cd docker
docker-compose up --build
```

This will build and start all services defined in the Compose file. The dashboard will be accessible at `http://localhost:3000`.

To stop all services:

```bash
docker-compose down
```

---

## 📁 Project Structure

```
AI-Based-Observability-Platform/
│
├── docker/                    # Docker configuration files
│   └── docker-compose.yml     # Compose file to spin up the full stack
│
├── monitoring-app/            # Core application (Node.js)
│   ├── src/                   # Application source code
│   │   ├── api/               # REST API routes and controllers
│   │   ├── ai/                # Anomaly detection and AI logic
│   │   ├── dashboard/         # Frontend assets (HTML, CSS, JS)
│   │   └── utils/             # Helper functions and utilities
│   ├── package.json           # Node.js dependencies and scripts
│   └── index.js               # Application entry point
│
└── .gitignore                 # Git ignore rules
```

---

## 💻 Usage

Once the platform is running, open your browser and navigate to `http://localhost:3000`.

From the dashboard you can:

1. **View Metrics** — Check real-time system and application performance stats
2. **Explore Logs** — Search and filter aggregated logs from all connected services
3. **Review Alerts** — See active and historical alerts triggered by the AI engine
4. **Configure Sources** — Point the platform at your application endpoints for data ingestion

To ingest data from your own application, send metrics/logs to the platform's REST API:

```bash
POST http://localhost:3000/api/ingest
Content-Type: application/json

{
  "service": "my-app",
  "level": "error",
  "message": "NullPointerException at line 42",
  "timestamp": "2026-03-19T10:30:00Z"
}
```

---

## ⚙ Configuration

Environment variables can be set inside the `docker/docker-compose.yml` file or in a `.env` file inside the `monitoring-app/` directory.

| Variable             | Default       | Description                          |
|----------------------|---------------|--------------------------------------|
| `PORT`               | `3000`        | Port the app listens on              |
| `LOG_LEVEL`          | `info`        | Logging verbosity (debug/info/error) |
| `AI_SENSITIVITY`     | `0.8`         | Anomaly detection threshold (0–1)    |
| `DATA_RETENTION_DAYS`| `30`          | How long to retain ingested data     |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# Fork the repository, then clone your fork
git clone https://github.com/<your-username>/AI-Based-Observability-Platform.git

# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes and commit
git commit -m "feat: add your feature description"

# Push to your fork
git push origin feature/your-feature-name

# Open a Pull Request on GitHub
```

Please make sure your code follows the existing style and that all existing functionality still works before opening a PR.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

**Kushal** — [@theqxmlkushal](https://github.com/theqxmlkushal)

---

> ⭐ If you found this project useful, consider giving it a star on GitHub!
