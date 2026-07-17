# 🚀 ReelLine - Complete Setup Guide

Welcome to your complete ReelLine project! This folder contains both the **React frontend** and **Spring Boot backend** for the multimedia production management system.

## 📁 Project Structure

```
myproject/
├── backend/                    # Spring Boot Backend (Java 21)
│   ├── src/
│   │   └── main/
│   │       ├── java/com/reelline/
│   │       │   ├── config/          # Security & WebSocket config
│   │       │   ├── controller/      # REST API endpoints
│   │       │   ├── dto/             # Request/Response objects
│   │       │   ├── entity/          # Database entities
│   │       │   ├── repository/      # Data access layer
│   │       │   ├── security/        # JWT authentication
│   │       │   └── service/         # Business logic
│   │       └── resources/
│   │           ├── application.yml  # Configuration
│   │           └── db/migration/    # Database migrations
│   ├── pom.xml                      # Maven dependencies
│   └── README.md                    # Backend documentation
│
├── src/                        # React Frontend
│   ├── components/                # UI components
│   ├── pages/                     # Page components
│   ├── lib/                       # Utilities
│   └── main.tsx                   # App entry point
│
├── docker-compose.yml          # PostgreSQL + Redis setup
├── package.json                # Frontend dependencies
└── README.md                   # Project documentation
```

## 🎯 Quick Start

### Prerequisites

Before you begin, make sure you have:

- ✅ **Node.js 18+** and **npm** installed
- ✅ **Java 21** installed
- ✅ **Maven 3.8+** installed
- ✅ **Docker** installed (for PostgreSQL and Redis)

#### Check your installations:

```bash
node --version      # Should be 18+
npm --version       # Should be 9+
java --version      # Should be 21
mvn --version       # Should be 3.8+
docker --version    # Should be installed
```

---

## 🚀 Step-by-Step Setup

### Step 1: Start Database & Cache (Docker)

Open a terminal and run:

```bash
cd myproject

# Start PostgreSQL and Redis
docker-compose up -d postgres redis
```

This will start:
- **PostgreSQL** on port `5432` (database: reelline, user: reelline, password: reelline123)
- **Redis** on port `6379`

Verify they're running:
```bash
docker ps
```

You should see `postgres` and `redis` containers running.

---

### Step 2: Start the Backend

Open a **new terminal** and run:

```bash
cd myproject/backend

# Set environment variables
export DATABASE_URL=jdbc:postgresql://localhost:5432/reelline
export DATABASE_USERNAME=reelline
export DATABASE_PASSWORD=reelline123
export JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-256-bits
export REDIS_HOST=localhost
export REDIS_PORT=6379

# Build and run the backend
./mvnw clean install
./mvnw spring-boot:run
```

The backend will start at: **http://localhost:8080**

Verify it's working:
```bash
curl http://localhost:8080/actuator/health
```

You should see: `{"status":"UP"}`

**API Documentation:** http://localhost:8080/swagger-ui.html

---

### Step 3: Start the Frontend

Open a **new terminal** and run:

```bash
cd myproject

# Install frontend dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start at: **http://localhost:5173**

Open your browser and go to: **http://localhost:5173**

---

## 🧪 Test the Application

### Test Backend API

1. **Health Check:**
   ```bash
   curl http://localhost:8080/actuator/health
   ```

2. **View API Documentation:**
   Open: http://localhost:8080/swagger-ui.html

3. **Test Login** (you'll need to create a user first):
   ```bash
   # Connect to PostgreSQL
   docker exec -it postgres psql -U reelline -d reelline
   
   # Insert test organization
   INSERT INTO organizations (id, name, slug, email, address, city, state, country, plan)
   VALUES (
     gen_random_uuid(),
     'Test Studio',
     'test-studio',
     'test@reelline.io',
     '123 Test St',
     'Hyderabad',
     'Telangana',
     'India',
     'BASIC'
   );
   
   # Insert test user (password: password123)
   INSERT INTO users (id, organization_id, name, email, password_hash, role, status, color, initials, email_verified)
   VALUES (
     gen_random_uuid(),
     (SELECT id FROM organizations WHERE slug = 'test-studio'),
     'Test User',
     'test@reelline.io',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'OWNER',
     'ACTIVE',
     '#2563EB',
     'TU',
     true
   );
   
   # Exit
   \q
   ```

---

## 🎨 Features

### Frontend (React)
- ✅ Dashboard with analytics
- ✅ Project management (7 stages)
- ✅ Team management (7 roles)
- ✅ Calendar view
- ✅ Workflow visualization
- ✅ Activity timeline
- ✅ Notifications system
- ✅ File management
- ✅ AI Assistant interface
- ✅ Dark mode support

### Backend (Spring Boot)
- ✅ RESTful API endpoints
- ✅ JWT authentication
- ✅ Role-based access control (7 roles)
- ✅ PostgreSQL database
- ✅ Redis caching
- ✅ Database migrations (Flyway)
- ✅ WebSocket support
- ✅ Audit logging
- ✅ Multi-tenant architecture

---

## 📊 Database Schema

The project uses **11 database tables**:

1. **organizations** - Multi-tenant support
2. **users** - Team members with roles
3. **projects** - Main project data
4. **project_stages** - Track progress through 7 stages
5. **assignments** - Team member assignments
6. **revisions** - Track changes and revisions
7. **activities** - Activity timeline
8. **comments** - Project discussions
9. **project_files** - File uploads
10. **notifications** - User notifications
11. **audit_logs** - Change tracking

---

## 🔧 Development Commands

### Frontend Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Lint code
npm run lint
```

### Backend Commands

```bash
# Build the project
./mvnw clean install

# Run the application
./mvnw spring-boot:run

# Run tests
./mvnw test

# Run specific test
./mvnw test -Dtest=AuthServiceTest

# Package for deployment
./mvnw clean package
```

### Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart postgres
```

---

## 🌐 Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend/` folder:

```bash
DATABASE_URL=jdbc:postgresql://localhost:5432/reelline
DATABASE_USERNAME=reelline
DATABASE_PASSWORD=reelline123
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-256-bits
REDIS_HOST=localhost
REDIS_PORT=6379
SERVER_PORT=8080
```

### Frontend Environment Variables

Create a `.env` file in the root folder:

```bash
VITE_API_URL=http://localhost:8080
```

---

## 🚢 Deployment

### Deploy Backend to Railway

1. Go to https://railway.app
2. Create a new project
3. Connect your GitHub repository
4. Set root directory to `backend`
5. Add environment variables
6. Deploy!

### Deploy Frontend to Netlify

1. Go to https://netlify.com
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variable: `VITE_API_URL=<your-backend-url>`
6. Deploy!

### Database (Neon)

1. Go to https://neon.tech
2. Create a new project
3. Copy the connection string
4. Use it as `DATABASE_URL` in Railway

### Cache (Upstash)

1. Go to https://upstash.com
2. Create a Redis database
3. Copy the connection details
4. Use them as `REDIS_HOST` and `REDIS_PORT` in Railway

---

## 🐛 Troubleshooting

### Backend won't start

**Error: Port 8080 already in use**
```bash
# Find the process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or change the port in backend/src/main/resources/application.yml
server:
  port: 8081
```

**Error: Database connection failed**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart PostgreSQL
docker-compose restart postgres

# Check connection
docker exec -it postgres psql -U reelline -d reelline
```

### Frontend won't start

**Error: Port 5173 already in use**
```bash
# Kill the process using port 5173
lsof -i :5173
kill -9 <PID>

# Or change the port
npm run dev -- --port 3000
```

**Error: Cannot connect to backend**
- Check that backend is running on port 8080
- Verify `VITE_API_URL` in `.env` file
- Check CORS settings in `SecurityConfig.java`

### Docker issues

**Error: Port already in use**
```bash
# Stop all containers
docker-compose down

# Remove containers
docker-compose rm -f

# Start again
docker-compose up -d
```

---

## 📚 Learning Resources

### Spring Boot
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security](https://spring.io/projects/spring-security)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)

### React
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

### Database
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Flyway Documentation](https://flywaydb.org/documentation/)

### Deployment
- [Railway Documentation](https://docs.railway.app/)
- [Netlify Documentation](https://docs.netlify.com/)
- [Neon Documentation](https://neon.tech/docs/)

---

## 🎯 Next Steps

1. ✅ **Set up local environment** (this guide)
2. 🔄 **Complete backend services** (Activity, Comment, Notification, Revision)
3. 🔄 **Connect frontend to backend** (create API client)
4. 🔄 **Add WebSocket real-time updates**
5. 🔄 **Implement file uploads** (AWS S3)
6. 🔄 **Write tests** (unit + integration)
7. 🔄 **Deploy to production** (Railway + Netlify)

See `NEXT_STEPS.md` for detailed instructions.

---

## 🤝 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the logs: `docker-compose logs -f`
3. Check backend logs: Look at the terminal where backend is running
4. Review API documentation: http://localhost:8080/swagger-ui.html

---

## 📄 License

This project is for educational and portfolio purposes.

---

## 🎉 You're All Set!

You now have a complete full-stack application ready for development!

**Quick recap:**
- Backend: http://localhost:8080
- Frontend: http://localhost:5173
- Database: localhost:5432
- Redis: localhost:6379

Happy coding! 🚀
