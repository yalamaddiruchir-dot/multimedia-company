# ReelLine — Multimedia Production Management System

<div align="center">

![ReelLine](https://img.shields.io/badge/ReelLine-Production%20Tracker-blueviolet)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB)
![Backend](https://img.shields.io/badge/Backend-Spring%20Boot%203-6DB33F)
![Database](https://img.shields.io/badge/Database-PostgreSQL-336791)
![License](https://img.shields.io/badge/License-MIT-green)

**A complete SaaS platform for photography & videography studios to manage their end-to-end production workflow — from client booking to final album delivery.**

[Live Demo](https://phenomenal-peony-7675d4.netlify.app) (password: `My-Drop-Site`) · [Report Bug](https://github.com/yalamaddiruchir-dot/multimedia-company/issues) · [Request Feature](https://github.com/yalamaddiruchir-dot/multimedia-company/issues)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

ReelLine is a **production-grade, multi-tenant SaaS application** built for multimedia companies that handle photography, videography, video editing, lightroom work, and album design. It replaces messy spreadsheets and WhatsApp groups with a streamlined, role-based workflow system.

### The Problem It Solves

Multimedia studios struggle with:
- ❌ Tracking projects across multiple stages (shoot → data copy → editing → album)
- ❌ Managing team assignments and workloads
- ❌ Communication gaps between teams
- ❌ No visibility into project status
- ❌ Revision tracking and client approvals
- ❌ Data scattered across tools

### The Solution

ReelLine provides:
- ✅ **7-Stage Workflow**: Manager → Data Copy → Lightroom → Video → Album → Editor → Delivery
- ✅ **7 User Roles**: Owner, Manager, Data Copy, Lightroom, Video, Album, Editor
- ✅ **Real-time Collaboration**: WebSocket-based live updates
- ✅ **Multi-tenancy**: Multiple studios on the same platform, fully isolated
- ✅ **AI Assistant**: Natural language search, summaries, and delay analysis
- ✅ **Analytics**: Revenue tracking, team performance, project pipeline

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USERS (Web / PWA Mobile)                   │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND — React + TypeScript + Vite            │
│              (Deployed on Netlify)                            │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │Dashboard │Projects  │Workflow  │Calendar  │Analytics │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
│  + AI Assistant + Command Palette + Dark Mode + Charts      │
└────────────────────────────┬────────────────────────────────┘
                             │ REST + WebSocket (STOMP)
                             ▼
┌─────────────────────────────────────────────────────────────┐
│          BACKEND — Spring Boot 3 + Java 21                   │
│          (To be deployed on Railway / Render)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Domain-Driven Controllers + Event-Driven Services    │  │
│  │  JWT Auth + RBAC + Spring Security + WebSocket        │  │
│  └──────────────────────────────────────────────────────┘  │
└──────┬──────────────┬──────────────┬───────────────────────┘
       │              │              │
       ▼              ▼              ▼
┌────────────┐ ┌────────────┐ ┌────────────┐
│ PostgreSQL │ │   Redis    │ │  AWS S3    │
│  (Neon)    │ │ (Upstash)  │ │  (Files)   │
└────────────┘ └────────────┘ └────────────┘
```

---

## 🛠️ Tech Stack

### Frontend (`/frontend` — root of this repo)
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework |
| **TypeScript** | Type safety |
| **Vite 7** | Build tool |
| **Tailwind CSS 4** | Styling |
| **Recharts** | Data visualization |
| **React Router 7** | Routing |
| **Framer Motion** | Animations |
| **Lucide React** | Icons |
| **date-fns** | Date formatting |
| **Netlify** | Deployment |

### Backend (`/backend`)
| Technology | Purpose |
|-----------|---------|
| **Spring Boot 3.2.1** | Application framework |
| **Java 21** | Programming language |
| **Spring Security** | Authentication & authorization |
| **JWT (jjwt 0.12.3)** | Token-based auth |
| **Spring Data JPA** | Database ORM |
| **PostgreSQL 15** | Relational database |
| **Flyway** | Database migrations |
| **Redis** | Caching & pub/sub |
| **Spring WebSocket** | Real-time updates |
| **AWS S3 SDK** | File storage |
| **MapStruct** | DTO mapping |
| **Lombok** | Boilerplate reduction |
| **SpringDoc OpenAPI** | API documentation |
| **Maven** | Build tool |

---

## ✨ Features

### 🎬 7-Stage Production Workflow
Every project flows through 7 stages with stage-level permissions:

```
Manager → Data Copy → Lightroom → Video → Album → Editor → Delivery
```

### 👥 7 User Roles
- **Owner**: Full platform access, team management, analytics
- **Manager**: Project creation, team assignment, event details
- **Data Copy**: Data transfer tracking, disk management
- **Lightroom**: Photo editing assignments, approval tracking
- **Video**: Video editing, revision management
- **Album**: Album design, frame tracking, printing
- **Editor**: View assigned work

### 📊 Analytics Dashboard
- Revenue trends (monthly/quarterly)
- Team performance metrics
- Project pipeline visualization
- Stage distribution charts
- Team utilization heatmap

### 🤖 AI Assistant
- Natural language search ("find delayed weddings")
- Daily production summaries
- Delay analysis with recommendations
- Command palette (Cmd+K) for quick actions

### 📅 Calendar View
- Event schedule visualization
- Drag-and-drop rescheduling
- Deadline tracking
- Team availability

### 🔔 Real-time Notifications
- Stage completion alerts
- Assignment notifications
- Revision requests
- Delay warnings

### 📝 Activity Timeline
- Complete audit trail
- Who did what, when
- Field-level change tracking
- Exportable logs

### 🎨 Advanced UI/UX
- Dark mode support
- Fully responsive (mobile, tablet, desktop)
- Keyboard shortcuts
- Beautiful animations
- Production-grade design system

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and **npm**
- **Java 21+** and **Maven 3.8+**
- **Docker** (for PostgreSQL & Redis)

### 1. Clone the Repository

```bash
git clone https://github.com/yalamaddiruchir-dot/multimedia-company.git
cd multimedia-company
```

### 2. Start Infrastructure (PostgreSQL + Redis)

```bash
# Option A: Use Docker Compose (recommended)
docker-compose up -d postgres redis

# Option B: Manual Docker commands
docker run -d --name reelline-postgres -p 5432:5432 \
  -e POSTGRES_DB=reelline -e POSTGRES_USER=reelline \
  -e POSTGRES_PASSWORD=reelline123 postgres:15-alpine

docker run -d --name reelline-redis -p 6379:6379 redis:7-alpine
```

### 3. Start the Backend

```bash
cd backend

# Set environment variables
export DATABASE_URL=jdbc:postgresql://localhost:5432/reelline
export DATABASE_USERNAME=reelline
export DATABASE_PASSWORD=reelline123
export JWT_SECRET=your-super-secret-jwt-key-min-256-bits-long
export REDIS_HOST=localhost
export REDIS_PORT=6379

# Build and run
./mvnw clean install
./mvnw spring-boot:run
```

Backend will be available at: **http://localhost:8080**  
API docs at: **http://localhost:8080/swagger-ui.html**

### 4. Start the Frontend

```bash
cd ..  # back to root

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend will be available at: **http://localhost:5173**

### 5. First Login

Currently using mock data in frontend. To connect to backend:
1. Update API base URL in frontend to `http://localhost:8080`
2. Create a user directly in database or via seed script
3. Login with credentials

---

## 📁 Project Structure

```
multimedia-company/
│
├── 📂 backend/                          # Spring Boot Backend
│   ├── pom.xml                          # Maven dependencies
│   ├── README.md                        # Backend-specific docs
│   └── src/
│       ├── main/
│       │   ├── java/com/reelline/
│       │   │   ├── ReellineApplication.java
│       │   │   ├── config/              # Security, WebSocket, Redis
│       │   │   ├── controller/          # REST endpoints
│       │   │   ├── dto/                 # Request/Response DTOs
│       │   │   ├── entity/              # JPA entities (11 total)
│       │   │   ├── exception/           # Error handling
│       │   │   ├── repository/          # Data access (9 repos)
│       │   │   ├── security/            # JWT + filters
│       │   │   └── service/             # Business logic
│       │   └── resources/
│       │       ├── application.yml
│       │       └── db/migration/        # Flyway SQL migrations
│       └── test/                        # JUnit tests
│
├── 📂 src/                              # React Frontend
│   ├── main.tsx
│   ├── App.tsx                          # Router + layout
│   ├── components/
│   │   ├── layout/                      # Sidebar, TopBar, AI
│   │   ├── ui/                          # Button, Card, Avatar...
│   │   └── charts/                      # Recharts components
│   ├── pages/                           # 12 page components
│   ├── data/mock.ts                     # Mock data
│   └── lib/                             # Utilities
│
├── 📂 public/                           # Static assets
├── package.json                         # Frontend dependencies
├── vite.config.ts                       # Vite configuration
├── tsconfig.json                        # TypeScript config
├── docker-compose.yml                   # Full-stack setup
└── README.md                            # This file
```

---

## 📡 API Documentation

### Authentication
```
POST   /api/auth/login           # Email + password → JWT tokens
POST   /api/auth/refresh         # Refresh access token
```

### Projects
```
GET    /api/projects             # List (paginated, filterable)
GET    /api/projects/:id         # Get details
POST   /api/projects             # Create (Owner, Manager)
PUT    /api/projects/:id/stage   # Update stage
```

### Users
```
GET    /api/users                # List team members
GET    /api/users/me             # Current user
```

### Coming Soon
```
# Activities, Comments, Revisions, Notifications
# File uploads (S3), Calendar events, Analytics
```

Full API docs available at `/swagger-ui.html` when backend is running.

---

## 🗄️ Database Schema

```
organizations
    ├── id (UUID, PK)
    ├── name, slug, logo
    ├── email, phone, address
    └── plan (BASIC/PREMIUM/ENTERPRISE)

users
    ├── id (UUID, PK)
    ├── organization_id (FK)
    ├── name, email, password_hash
    ├── role (OWNER/MANAGER/DATA_COPY/LIGHTROOM/VIDEO/ALBUM/EDITOR)
    ├── status (ACTIVE/INACTIVE/INVITED/LOCKED)
    ├── color, initials, avatar
    └── failed_login_attempts, locked_until

projects
    ├── id (UUID, PK)
    ├── organization_id (FK)
    ├── code, name, client, event_date
    ├── status (ACTIVE/COMPLETED/DELAYED/REJECTED/LOCKED/REVIEW)
    ├── current_stage (MANAGER/DATA_COPY/LIGHTROOM/VIDEO/ALBUM/EDITOR/DELIVERY)
    ├── priority (LOW/MEDIUM/HIGH/URGENT)
    ├── manager_id (FK), quotation, progress, type
    └── created_by_id (FK)

project_stages, assignments, revisions,
activities, comments, project_files,
notifications, audit_logs
```

Full schema: `backend/src/main/resources/db/migration/V1__initial_schema.sql`

---

## 🚢 Deployment

### Frontend (Netlify)
Already deployed at: https://phenomenal-peony-7675d4.netlify.app

```bash
cd /path/to/frontend
npm run build
# Upload dist/ folder to Netlify
```

### Backend (Railway / Render)

**Railway (Recommended):**
1. Connect GitHub repo
2. Set root directory to `backend/`
3. Add environment variables
4. Auto-deploys on push

**Environment Variables:**
```
DATABASE_URL=jdbc:postgresql://...
DATABASE_USERNAME=...
DATABASE_PASSWORD=...
JWT_SECRET=...
REDIS_HOST=...
REDIS_PORT=...
```

### Database (Neon / Supabase)
- **Neon**: Serverless PostgreSQL (free tier available)
- **Supabase**: Managed PostgreSQL with auth

### Cache (Upstash)
- **Upstash**: Serverless Redis (free tier available)

### Storage (AWS S3)
- **AWS S3**: For file uploads (quotations, previews, albums)

---

## 🗺️ Roadmap

### ✅ Phase 1: Core (Done)
- [x] Frontend with 12 pages
- [x] 7-stage workflow UI
- [x] Team management UI
- [x] Analytics dashboard
- [x] AI Assistant UI
- [x] Backend entities & repositories
- [x] JWT authentication
- [x] Basic CRUD APIs
- [x] Database migrations

### 🚧 Phase 2: Production Features (Next)
- [ ] Complete all backend services
- [ ] Complete all REST controllers
- [ ] WebSocket real-time updates
- [ ] Redis caching
- [ ] File uploads (S3)
- [ ] Email notifications
- [ ] Connect frontend to backend

### 🔮 Phase 3: Advanced
- [ ] AI integration (OpenAI API)
- [ ] Advanced search (Elasticsearch)
- [ ] Prometheus + Grafana monitoring
- [ ] Comprehensive test suite (80%+ coverage)
- [ ] Multi-tenancy enforcement
- [ ] Subscription billing (Stripe)
- [ ] Client portal

---

## 🧪 Testing

```bash
# Backend tests
cd backend
./mvnw test

# Frontend tests (coming soon)
cd ..
npm test
```

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Druchir Yalamaddi**
- GitHub: [@yalamaddiruchir-dot](https://github.com/yalamaddiruchir-dot)
- Project: ReelLine Multimedia Production Tracker

---

## 🙏 Acknowledgments

- Inspired by real-world multimedia production workflows
- Built with modern best practices for full-stack development
- Designed to be a flagship portfolio project for SDE/placements

---

<div align="center">

**⭐ If you find this project useful, please consider giving it a star!**

Made with ❤️ for multimedia production companies

</div>
