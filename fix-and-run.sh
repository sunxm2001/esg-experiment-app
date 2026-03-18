#!/bin/bash
# Load nvm for Node.js version management
if [ -f ~/.nvm/nvm.sh ]; then
    source ~/.nvm/nvm.sh
    echo "✅ Loaded nvm"
else
    echo "⚠️  nvm not found, trying default node"
fi

echo "🎯 ESG实验应用 - 傻瓜式启动脚本"
echo "==================================="

# 检查PostgreSQL是否运行
echo "🔍 检查PostgreSQL状态..."
if ps aux | grep -q "[p]ostgres"; then
    echo "✅ PostgreSQL 正在运行"
else
    echo "❌ PostgreSQL 未运行"
    echo "请先启动PostgreSQL："
    echo "  brew services start postgresql@18"
    exit 1
fi

# 创建数据库（如果不存在）
echo "🗄️  检查数据库..."
psql -lqt | cut -d \| -f 1 | grep -qw "esg_experiment"
if [ $? -ne 0 ]; then
    echo "创建数据库..."
    createdb esg_experiment
    if [ $? -eq 0 ]; then
        echo "✅ 数据库创建成功"
    else
        echo "❌ 数据库创建失败，请手动创建："
        echo "  createdb esg_experiment"
    fi
else
    echo "✅ 数据库已存在"
fi

# 设置数据库权限
echo "👤 设置数据库用户权限..."
echo "注意：正在尝试为当前用户($USER)设置数据库访问权限..."
psql -d esg_experiment -c "GRANT ALL PRIVILEGES ON DATABASE esg_experiment TO $USER;" 2>/dev/null || echo "可能已设置权限"

# 检查并杀死占用5001端口的进程
echo "🔌 检查端口5001..."
PID=$(lsof -ti:5001)
if [ ! -z "$PID" ]; then
    echo "⚠️  端口5001被进程$PID占用，正在杀死..."
    kill -9 $PID 2>/dev/null
    sleep 2
fi

# 检查并杀死占用3000端口的进程
echo "🔌 检查端口3000..."
PID=$(lsof -ti:3000)
if [ ! -z "$PID" ]; then
    echo "⚠️  端口3000被进程$PID占用，正在杀死..."
    kill -9 $PID 2>/dev/null
    sleep 2
fi

# 进入后端目录
cd backend

# 安装依赖（如果需要）
echo "📦 检查后端依赖..."
if [ ! -d "node_modules" ]; then
    echo "安装后端依赖..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ 后端依赖安装成功"
    else
        echo "❌ 依赖安装失败"
        exit 1
    fi
else
    echo "✅ 后端依赖已安装"
fi

# 运行数据库迁移和种子数据
echo "🌱 插入新闻数据..."
npm run seed 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ 新闻数据插入成功"
else
    echo "⚠️  新闻数据插入失败，跳过继续..."
fi

# 启动后端服务器（在后台）
echo "🚀 启动后端服务器(端口5001)..."
npm run dev > backend.log 2>&1 &
BACKEND_PID=$!
sleep 5

# 检查后端是否启动
if curl -s http://localhost:5001/api/health > /dev/null; then
    echo "✅ 后端服务器启动成功"
    echo "   API地址: http://localhost:5001/api"
    echo "   日志文件: backend/backend.log"
else
    echo "❌ 后端服务器启动失败"
    echo "   请查看日志: backend/backend.log"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# 进入前端目录
cd ../frontend/public

# 检查前端依赖（如果有的话）
echo "🎨 启动前端应用(端口3000)..."

# 启动Python HTTP服务器（在后台）
python3 -m http.server 3000 > ../frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 3

# 检查前端是否启动
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ 前端服务器启动成功"
    echo "   应用地址: http://localhost:3000"
    echo "   日志文件: frontend/frontend.log"
else
    echo "❌ 前端服务器启动失败"
    echo "   请查看日志: frontend/frontend.log"
    kill $FRONTEND_PID 2>/dev/null
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 启动完成！"
echo "===================="
echo "🌐 打开浏览器访问: http://localhost:3000"
echo "⚙️  后端API: http://localhost:5001/api/health"
echo ""
echo "🛑 停止应用："
echo "   1. 按 Ctrl+C 停止本脚本"
echo "   2. 或运行: kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "📋 问题排查："
echo "   - 查看后端日志: tail -f backend/backend.log"
echo "   - 查看前端日志: tail -f frontend/frontend.log"
echo "   - 检查端口: lsof -ti:5001,3000"
echo ""

# 等待用户中断
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo '应用已停止'; exit 0" INT
wait