---
title: Smart Campus Lost & Found System
emoji: 🔍
colorFrom: blue
colorTo: indigo
sdk: docker
pinned: false
---

# 🔍 Smart Campus Lost & Found System

**An AI-powered platform for reporting, discovering, and recovering lost items across a campus.**

[![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react)](https://react.dev)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker)](https://www.docker.com)
[![GitHub](https://img.shields.io/badge/GitHub-M--sahoo2007-181717?logo=github)](https://github.com/M-sahoo2007)

---

## 📌 Project Overview

Smart Campus Lost & Found is designed to make lost-item reporting and recovery easier within an academic campus.

Instead of depending on scattered messages or manual enquiries, users can report found items, search for lost belongings, and follow the recovery process through one centralized application.

The project documentation describes a multimodal search approach that can use item images and text descriptions to identify potentially matching records.

## 🚀 Key Features

| Feature | Description |
|---|---|
| 📸 Image-based search | Search for visually similar items using photographs, where AI matching is enabled. |
| 💬 Text-based search | Search using natural-language descriptions. |
| 📋 Found-item reporting | Report an item found on campus with relevant details. |
| 🎯 Match ranking | Display potentially matching items in ranked order. |
| 🔐 User access | Support students and authorized campus staff. |
| 📊 Administration | Manage item records and claims. |

## 🧠 Technology Stack

- **Frontend:** React.js and Vite
- **Backend:** Python and FastAPI
- **AI Model:** Google SigLIP / SigLIP 2
- **Vector Database:** FAISS
- **Deployment:** Docker

## 🧠 AI Search Workflow

The intended multimodal retrieval workflow:

```text
User submits an image or text description
                    |
                    v
        Vision-language model encoder
                    |
                    v
       Normalized feature embedding
                    |
                    v
          FAISS similarity search
                    |
                    v
       Ranked candidate item records
                    |
                    v
       User reviews possible matches
```

The actual model performance depends on the dataset, evaluation method, hardware, and deployment environment.

**Benchmark note:** Accuracy and latency figures should be included only after verification against this project's own experiments.

## 🏗️ System Architecture

The application is organized into four major layers:

1. **Frontend Layer:** Interface for searching, reporting, and managing items.
2. **Backend Layer:** Handles API requests, validation, and application logic.
3. **AI Engine Layer:** Generates embeddings and ranks matching items.
4. **Storage Layer:** Stores item images, metadata, and search indexes.

## 📁 Project Structure

```text
campus-lost-found/
├── backend/
│   ├── main.py
│   ├── matcher_siglip.py
│   ├── storage_manager.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│
├── README.md
└── .gitignore
```

*This is an indicative structure. Refer to the actual source files for the current implementation.*

## ⚡ Local Setup

### Prerequisites

- Python 3.10+
- Node.js and npm
- Git
- Docker (optional)

### 1. Backend Setup

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment.

**Windows PowerShell:**

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
python main.py
```

Use the host and port printed in the application logs.

### 2. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite development URL displayed in your terminal, commonly:

```text
http://localhost:5173
```

Build for production:

```bash
npm run build
```

*Follow the actual project configuration if its entry points, scripts, or ports differ.*

## 🐳 Docker

Docker configuration is included according to the project documentation.

Use the Dockerfile and deployment configuration to build and run the application. Never commit passwords, API keys, or other secrets.

## 👨‍💻 Developer Information

| Field | Details |
|---|---|
| Project Name | Smart Campus Lost & Found System |
| Developer | Maheswar Sahoo |
| Branch | Computer Science & Engineering (CSE) |
| Institution | Bhadrak Institute of Engineering and Technology (BIET), Odisha |
| GitHub Username | M-sahoo2007 |
| Repository | [campus-lost-found](https://github.com/M-sahoo2007/campus-lost-found) |

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome.

Please open an issue describing the problem or proposed improvement before submitting substantial changes.

## 📄 License

No license has been confirmed in this repository. Add a LICENSE file and update this section once the project license has been selected.
