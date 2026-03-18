# ESG实验应用 - 最简单启动指南

## 🔥 最简单的启动方法

运行一个命令解决所有问题：

```bash
cd /Users/sunxuemeng/Desktop/cc-test
./fix-and-run.sh
```

这个脚本会自动：
1. ✅ 检查PostgreSQL状态
2. ✅ 检查并创建数据库
3. ✅ 解决端口冲突
4. ✅ 安装依赖（如果需要）
5. ✅ 启动后端服务器(端口5001)
6. ✅ 启动前端服务器(端口3000)
7. ✅ 打开应用链接

## 🌐 访问应用

启动成功后，在浏览器中打开：
- **前端应用**: http://localhost:3000
- **后端API健康检查**: http://localhost:5001/api/health

## ⚠️ 如果脚本运行失败

### 1. 手动启动步骤

如果自动脚本失败，按以下手动步骤：

#### 步骤1: 确保PostgreSQL运行
```bash
# 检查PostgreSQL是否运行
ps aux | grep postgres

# 如果没有运行，启动它（如果使用Homebrew）
brew services start postgresql@18
```

#### 步骤2: 创建数据库
```bash
# 如果数据库不存在
createdb esg_experiment
```

#### 步骤3: 启动后端
```bash
cd backend
npm install  # 只需运行一次
npm run dev  # 启动后端服务器（端口5001）
```

#### 步骤4: 启动前端
```bash
cd frontend
python3 -m http.server 3000
```

### 2. 常见问题解决

#### 问题1: 端口被占用
如果看到`EADDRINUSE`错误：
- **端口5000**: macOS ControlCenter占用，已改用端口5001
- **端口3000**: 可能被其他应用占用

解决：
```bash
# 查看占用端口的进程
lsof -ti:5001,3000

# 杀死占用进程（如果需要）
kill -9 <进程ID>
```

#### 问题2: PostgreSQL连接失败
错误：`role "postgres" does not exist`

解决：已修改配置使用当前用户(`sunxuemeng`)连接，无需密码。

#### 问题3: 数据库权限问题
如果无法访问数据库：
```bash
# 尝试用当前用户创建数据库
createdb esg_experiment

# 或给当前用户授权
psql -c "CREATE USER $USER WITH SUPERUSER;" 2>/dev/null || echo "用户已存在"
```

### 3. 手动测试

启动后测试是否正常工作：

```bash
# 测试后端API
curl http://localhost:5001/api/health

# 应该返回：{"status":"OK","message":"ESG Experiment Backend is running"}

# 测试前端
curl -I http://localhost:3000
```

## 📁 重要文件说明

- `backend/.env` - 配置文件（已修改为端口5001，用户sunxuemeng）
- `frontend/src/services/api.js` - 前端API配置（已更新为端口5001）
- `database/schema.sql` - 数据库结构
- `backend/seedNewsData.js` - 新闻数据（11篇实验文章 + 5篇填充文章）

## 🔧 修改配置

如果需要修改端口或其他配置：

### 修改后端端口
编辑 `backend/.env`：
```env
PORT=5002  # 修改为其他端口
```

### 修改前端API地址
编辑 `frontend/src/services/api.js` 第6行：
```javascript
this.baseURL = 'http://localhost:5002/api';  # 对应后端端口
```

## 📊 验证新闻数据

插入新闻数据到数据库：
```bash
cd backend
npm run seed
```

查看新闻数据：
```bash
curl http://localhost:5001/api/news | head -20
```

## 🎯 快速验证

运行这个快速验证脚本：
```bash
#!/bin/bash
echo "1. 检查PostgreSQL..."
ps aux | grep -q "[p]ostgres" && echo "✅ PostgreSQL运行" || echo "❌ PostgreSQL未运行"

echo "2. 检查后端..."
curl -s http://localhost:5001/api/health 2>/dev/null && echo "✅ 后端运行" || echo "❌ 后端未运行"

echo "3. 检查前端..."
curl -s -I http://localhost:3000 2>/dev/null | head -1 | grep -q "200" && echo "✅ 前端运行" || echo "❌ 前端未运行"
```

## 🆘 紧急解决

如果一切都不工作，尝试**完整重置**：

```bash
# 1. 停止所有相关进程
pkill -f "node.*server.js"
pkill -f "python.*http.server"

# 2. 重新安装后端依赖
cd backend && rm -rf node_modules && npm install

# 3. 重新启动
cd /Users/sunxuemeng/Desktop/cc-test
./fix-and-run.sh
```

## 📞 获取帮助

如果问题仍然存在：
1. 查看日志文件：
   - `backend/backend.log` - 后端日志
   - `frontend/frontend.log` - 前端日志
2. 检查错误信息
3. 确保PostgreSQL正在运行
4. 确保端口5001和3000未被占用

---

**最简单的就是运行：`./fix-and-run.sh`**

脚本会处理所有问题，完成后在浏览器打开 http://localhost:3000 即可使用实验应用！