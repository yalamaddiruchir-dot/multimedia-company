# 🔧 Login Issue - Complete Fix Guide

## Problem
You're getting "Invalid email or password" when trying to login.

## Root Cause
The database has no users yet, and the DataInitializer may not have run properly.

## Solutions (Choose One)

### Solution 1: Use Register Endpoint (Easiest)

I've added a `/api/auth/register` endpoint. Now you can create users via API.

**Step 1: Start Backend**
```bash
cd backend
./mvnw spring-boot:run
```

**Step 2: Register a User via curl**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@reelline.io",
    "password": "password123",
    "role": "OWNER"
  }'
```

**Step 3: Login**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@reelline.io",
    "password": "password123"
  }'
```

You should get back JWT tokens! Then login to frontend with:
- Email: `test@reelline.io`
- Password: `password123`

---

### Solution 2: Verify DataInitializer Works

**Step 1: Check Backend Logs**
When you start the backend, you should see:
```
🚀 Initializing test data...
✅ Created organization: ReelLine Studios
✅ Created 7 team members
✅ Created 8 sample projects
```

If you DON'T see this, the DataInitializer didn't run.

**Step 2: Clear Database and Restart**
```bash
# Stop backend (Ctrl+C)

# If using Docker PostgreSQL:
docker exec -it postgres psql -U reelline -d reelline -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# If using H2 (no Docker):
# Just delete the database file or let it auto-recreate

# Restart backend
./mvnw spring-boot:run
```

You should now see the initialization logs.

**Step 3: Login with Test User**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "aarav@reelline.io",
    "password": "password123"
  }'
```

Login credentials:
- Owner: `aarav@reelline.io` / `password123`
- Manager: `maya@reelline.io` / `password123`
- Data Copy: `rohan@reelline.io` / `password123`
- Lightroom: `ishita@reelline.io` / `password123`
- Video: `vikram@reelline.io` / `password123`
- Album: `anaya@reelline.io` / `password123`
- Editor: `dev@reelline.io` / `password123`

---

### Solution 3: Manual SQL Insert (If Nothing Else Works)

Connect to your database:
```bash
# If using Docker:
docker exec -it postgres psql -U reelline -d reelline

# If using H2:
# Open http://localhost:8080/h2-console
# JDBC URL: jdbc:h2:mem:reellinedb
# Username: sa
# Password: (empty)
```

Run this SQL:
```sql
-- Create organization
INSERT INTO organizations (id, name, slug, email, address, city, state, country, plan, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Test Studio',
  'test-studio',
  'test@reelline.io',
  '123 Test St',
  'Hyderabad',
  'Telangana',
  'India',
  'BASIC',
  NOW(),
  NOW()
);

-- Create user with properly hashed password
-- Password is "password123" hashed with BCrypt
INSERT INTO users (id, organization_id, name, email, password_hash, role, status, color, initials, email_verified, failed_login_attempts, created_at, updated_at)
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
  true,
  0,
  NOW(),
  NOW()
);
```

⚠️ **Note:** The password hash above might not work with your BCrypt encoder. Use Solution 1 (register endpoint) instead if this doesn't work.

---

## 🔍 Debugging Steps

### Step 1: Check if Backend is Running
```bash
curl http://localhost:8080/actuator/health
```
Should return: `{"status":"UP"}`

### Step 2: Check if Users Exist in Database
```bash
# Docker PostgreSQL:
docker exec -it postgres psql -U reelline -d reelline -c "SELECT id, name, email, role FROM users;"

# H2 Console:
# Open http://localhost:8080/h2-console and run:
SELECT id, name, email, role FROM users;
```

If no users, go back to Solution 1 or 2.

### Step 3: Check Backend Logs
Look for errors when starting the backend:
```bash
./mvnw spring-boot:run 2>&1 | grep -i error
```

Common issues:
- Database connection failed
- Flyway migration errors
- DataInitializer exceptions

### Step 4: Test Login API Directly
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@reelline.io", "password": "password123"}' \
  -v
```

The `-v` flag shows detailed output. Look for:
- `200 OK` = Success
- `401 Unauthorized` = Wrong credentials
- `500 Internal Server Error` = Backend error

---

## 🎯 Recommended Approach

1. **Try Solution 1 first** (register endpoint) - it's the easiest and most reliable
2. If that doesn't work, **try Solution 2** (verify DataInitializer)
3. Only use Solution 3 (manual SQL) as a last resort

---

## 📝 Quick Test Script

Save this as `test-login.sh`:

```bash
#!/bin/bash

echo "=== Testing Register Endpoint ==="
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@reelline.io",
    "password": "password123",
    "role": "OWNER"
  }'
echo ""

echo "=== Testing Login Endpoint ==="
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@reelline.io",
    "password": "password123"
  }'
echo ""

echo "=== Done ==="
```

Run it:
```bash
chmod +x test-login.sh
./test-login.sh
```

---

## 🚀 Next Steps

Once login works:
1. Login to frontend at http://localhost:5173
2. You should see the dashboard with real data
3. If dashboard is empty, check if projects were created by DataInitializer
4. Continue with Phase 3: Update remaining pages to use API

---

## 📞 Still Not Working?

Check these:
- ✅ Backend running on port 8080?
- ✅ Frontend running on port 5173?
- ✅ `.env` file has `VITE_API_URL=http://localhost:8080`?
- ✅ Database is accessible?
- ✅ No errors in backend logs?

If all else fails, share:
1. Backend startup logs
2. Error from browser console (F12 → Console)
3. Output from `curl` test commands
