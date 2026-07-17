#!/bin/bash

echo "🔍 ReelLine 后端诊断脚本"
echo "========================"
echo ""

# 检查后端是否运行
echo "1️⃣  检查后端状态..."
if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo "✅ 后端正在运行"
    HEALTH=$(curl -s http://localhost:8080/actuator/health)
    echo "   健康状态: $HEALTH"
else
    echo "❌ 后端未运行或未响应"
    echo "   请运行: cd backend && ./mvnw spring-boot:run"
    exit 1
fi
echo ""

# 尝试登录
echo "2️⃣  测试登录..."
LOGIN_RESULT=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aarav@reelline.io","password":"password123"}' 2>&1)

if echo "$LOGIN_RESULT" | grep -q '"accessToken"'; then
    echo "✅ 登录成功"
    TOKEN=$(echo "$LOGIN_RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null)
    if [ -z "$TOKEN" ]; then
        echo "⚠️  无法提取token，使用grep方式"
        TOKEN=$(echo "$LOGIN_RESULT" | grep -o '"accessToken":"[^"]*"' | head -1 | cut -d'"' -f4)
    fi
else
    echo "❌ 登录失败"
    echo "   响应: $LOGIN_RESULT"
    echo ""
    echo "💡 可能原因:"
    echo "   - DataInitializer没有运行"
    echo "   - 数据库表结构不匹配"
    echo "   - 密码hash错误"
    echo ""
    echo "🔧 尝试创建用户..."
    
    # 尝试注册新用户
    REGISTER_RESULT=$(curl -s -X POST http://localhost:8080/api/auth/register \
      -H "Content-Type: application/json" \
      -d '{"name":"Test User","email":"test@reelline.io","password":"password123","role":"OWNER"}' 2>&1)
    
    if echo "$REGISTER_RESULT" | grep -q '"message"'; then
        echo "✅ 注册成功，使用新账号登录..."
        LOGIN_RESULT=$(curl -s -X POST http://localhost:8080/api/auth/login \
          -H "Content-Type: application/json" \
          -d '{"email":"test@reelline.io","password":"password123"}')
        
        if echo "$LOGIN_RESULT" | grep -q '"accessToken"'; then
            echo "✅ 使用test@reelline.io登录成功"
            TOKEN=$(echo "$LOGIN_RESULT" | grep -o '"accessToken":"[^"]*"' | head -1 | cut -d'"' -f4)
        else
            echo "❌ 注册后登录仍失败"
            exit 1
        fi
    else
        echo "❌ 注册也失败: $REGISTER_RESULT"
        exit 1
    fi
fi
echo ""

# 测试/api/users
echo "3️  测试 /api/users..."
USERS_RESULT=$(curl -s http://localhost:8080/api/users \
  -H "Authorization: Bearer $TOKEN" 2>&1)

if echo "$USERS_RESULT" | grep -q '"id"'; then
    echo "✅ /api/users 返回数据"
    USER_COUNT=$(echo "$USERS_RESULT" | grep -o '"id"' | wc -l)
    echo "   用户数量: $USER_COUNT"
else
    echo "❌ /api/users 失败"
    echo "   响应: $USERS_RESULT"
    echo ""
    echo "💡 这是序列化问题，需要检查后端日志"
fi
echo ""

# 测试/api/projects
echo "4️⃣  测试 /api/projects..."
PROJECTS_RESULT=$(curl -s "http://localhost:8080/api/projects?page=0&size=10" \
  -H "Authorization: Bearer $TOKEN" 2>&1)

if echo "$PROJECTS_RESULT" | grep -q '"content"'; then
    echo "✅ /api/projects 返回数据"
    PROJECT_COUNT=$(echo "$PROJECTS_RESULT" | grep -o '"id"' | wc -l)
    echo "   项目数量: $PROJECT_COUNT"
else
    echo "❌ /api/projects 失败"
    echo "   响应: $PROJECTS_RESULT"
fi
echo ""

echo "========================"
echo "📊 诊断结果"
echo "========================"
echo ""
echo "Token: ${TOKEN:0:20}..."
echo ""
echo "如果上面有❌，请检查:"
echo "1. 后端终端的错误日志"
echo "2. 数据库是否正常运行"
echo "3. Flyway迁移是否成功"
echo ""
