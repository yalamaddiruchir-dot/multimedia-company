#!/bin/bash

echo "=========================================="
echo "ReelLine Backend Test Script"
echo "=========================================="
echo ""

# Test 1: Check if backend is running
echo "1️  Testing backend health..."
if curl -s http://localhost:8080/actuator/health | grep -q "UP"; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is NOT running or health endpoint failed"
    echo "   Start backend: cd backend && ./mvnw spring-boot:run"
    exit 1
fi
echo ""

# Test 2: Check if DataInitializer ran (check for users)
echo "2️⃣  Testing authentication..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aarav@reelline.io","password":"password123"}')

if echo "$LOGIN_RESPONSE" | grep -q "accessToken"; then
    echo "✅ Login successful - DataInitializer created test users"
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
else
    echo "❌ Login failed - DataInitializer may not have run"
    echo "   Response: $LOGIN_RESPONSE"
    exit 1
fi
echo ""

# Test 3: Test /api/users endpoint
echo "3️  Testing /api/users endpoint..."
USERS_RESPONSE=$(curl -s http://localhost:8080/api/users \
  -H "Authorization: Bearer $TOKEN")

if echo "$USERS_RESPONSE" | grep -q "id"; then
    echo "✅ /api/users returned data"
    USER_COUNT=$(echo "$USERS_RESPONSE" | grep -o '"id"' | wc -l)
    echo "   Found $USER_COUNT users"
else
    echo "❌ /api/users failed or returned empty data"
    echo "   Response: $USERS_RESPONSE"
    exit 1
fi
echo ""

# Test 4: Test /api/projects endpoint
echo "4️  Testing /api/projects endpoint..."
PROJECTS_RESPONSE=$(curl -s "http://localhost:8080/api/projects?page=0&size=10" \
  -H "Authorization: Bearer $TOKEN")

if echo "$PROJECTS_RESPONSE" | grep -q "content"; then
    echo "✅ /api/projects returned data"
    PROJECT_COUNT=$(echo "$PROJECTS_RESPONSE" | grep -o '"id"' | wc -l)
    echo "   Found $PROJECT_COUNT projects"
else
    echo "❌ /api/projects failed or returned empty data"
    echo "   Response: $PROJECTS_RESPONSE"
    exit 1
fi
echo ""

echo "=========================================="
echo "✅ All tests passed!"
echo "=========================================="
echo ""
echo "📧 Login Credentials:"
echo "   Email: aarav@reelline.io"
echo "   Password: password123"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo ""
