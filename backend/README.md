# ReelLine Backend — Spring Boot 3

Enterprise-grade backend for the ReelLine multimedia production management system.

## Quick Start

```bash
# 1. Start PostgreSQL & Redis
docker run -d -p 5432:5432 -e POSTGRES_DB=reelline \
  -e POSTGRES_USER=reelline -e POSTGRES_PASSWORD=reelline123 postgres:15-alpine
docker run -d -p 6379:6379 redis:7-alpine

# 2. Set environment variables
export DATABASE_URL=jdbc:postgresql://localhost:5432/reelline
export DATABASE_USERNAME=reelline
export DATABASE_PASSWORD=reelline123
export JWT_SECRET=your-super-secret-jwt-key-min-256-bits-long
export REDIS_HOST=localhost
export REDIS_PORT=6379

# 3. Build and run
./mvnw clean install
./mvnw spring-boot:run
```

Backend runs at: http://localhost:8080
API docs at: http://localhost:8080/swagger-ui.html

## Tech Stack

- **Framework:** Spring Boot 3.2.1
- **Language:** Java 21
- **Database:** PostgreSQL 15 + Flyway migrations
- **Cache:** Redis
- **Auth:** JWT (jjwt 0.12.3) + Spring Security
- **Real-time:** Spring WebSocket (STOMP)
- **Docs:** SpringDoc OpenAPI
- **Build:** Maven

## Project Structure

```
src/main/java/com/reelline/
├── ReellineApplication.java       # Entry point
├── config/                        # Security, CORS, Redis, WebSocket
├── controller/                    # REST endpoints (Auth, Project, User)
├── dto/                           # Request/Response DTOs
├── entity/                        # 11 JPA entities
├── exception/                     # Global error handling
├── repository/                    # 9 Spring Data repositories
├── security/                      # JWT provider + auth filter
└── service/                       # Business logic
```

## API Endpoints

### Authentication
- `POST /api/auth/login` — Login with email/password
- `POST /api/auth/refresh` — Refresh access token

### Projects
- `GET /api/projects` — List projects (paginated, filterable)
- `GET /api/projects/{id}` — Get project details
- `POST /api/projects` — Create new project
- `PUT /api/projects/{id}/stage` — Update project stage

### Users
- `GET /api/users` — List team members
- `GET /api/users/me` — Get current user

## Security

- JWT with access + refresh tokens
- BCrypt password hashing
- Role-based access control (RBAC)
- Account lockout after 5 failed attempts
- CORS configured for frontend origins

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `jdbc:postgresql://localhost:5432/reelline` | PostgreSQL URL |
| `DATABASE_USERNAME` | `reelline` | DB username |
| `DATABASE_PASSWORD` | `reelline123` | DB password |
| `JWT_SECRET` | — | Min 256-bit secret key |
| `REDIS_HOST` | `localhost` | Redis host |
| `REDIS_PORT` | `6379` | Redis port |
| `SERVER_PORT` | `8080` | Backend port |
| `CORS_ORIGINS` | `http://localhost:3000,http://localhost:5173` | Allowed origins |

## Testing

```bash
# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=AuthServiceTest
```

## Next Steps

1. Complete remaining services (Activity, Comment, Revision, Notification, File)
2. Add WebSocket real-time updates
3. Implement file uploads with AWS S3
4. Add Redis caching for dashboard stats
5. Integrate email notifications
6. Write comprehensive test suite

See the main [README](../README.md) for full project details.
