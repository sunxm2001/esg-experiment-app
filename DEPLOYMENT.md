# 零成本部署指南 - ESG实验应用

本指南介绍如何免费部署ESG实验应用，支持30名用户同时使用。

## 部署架构

对于小规模测试（30名用户），建议使用以下免费服务：

1. **数据库**: Supabase (免费层) 或 Neon (免费层)
2. **后端API**: Railway (免费层) 或 Render (免费层)
3. **前端**: GitHub Pages 或 Vercel (免费层)

## 选项1：完全在Railway上部署 (最简单)

Railway提供数据库和后端托管，前端可以放在GitHub Pages。

### 步骤：
1. 在GitHub上创建仓库并推送代码
2. 在Railway.app注册账号
3. 创建新项目，选择"Deploy from GitHub repo"
4. Railway会自动检测Node.js应用并部署
5. 在Railway项目设置中添加环境变量：
   - `NODE_ENV=production`
   - `DATABASE_URL` (Railway会自动提供PostgreSQL数据库和URL)
6. 部署完成后，获取后端URL（如`https://your-app.railway.app`）
7. 在GitHub仓库设置中启用GitHub Pages，选择`frontend/public`目录
8. 更新前端`api.js`中的`baseURL`为Railway后端URL

## 选项2：混合部署 (Supabase + Railway/Vercel)

### 数据库：Supabase (免费层)
1. 在supabase.com注册账号
2. 创建新项目
3. 在SQL编辑器中运行`database/schema.sql`
4. 获取数据库连接URL：项目设置 → Database → Connection string
   - 格式：`postgresql://postgres:[密码]@db.[项目ID].supabase.co:5432/postgres`

### 后端：Railway 或 Render
1. 部署后端代码到Railway/Render
2. 设置环境变量：
   - `DATABASE_URL`: Supabase数据库URL
   - `NODE_ENV=production`
   - `PORT=3000` (Railway/Render会自动分配端口)
3. 获取后端URL

### 前端：Vercel 或 GitHub Pages
1. 将前端代码部署到Vercel（连接GitHub仓库）
2. 或使用GitHub Pages：
   - 设置仓库 → Pages → Source: `frontend/public`目录
   - 自定义域名（可选）

## 选项3：全本地部署 (开发/测试)

### 前提条件：
- Node.js 16+
- PostgreSQL 13+
- Git

### 步骤：
```bash
# 1. 克隆仓库
git clone https://github.com/yourusername/esg-experiment-app.git
cd esg-experiment-app

# 2. 安装依赖
npm run install-all

# 3. 设置数据库
# 创建数据库
createdb esg_experiment

# 导入模式
psql -U $USER -d esg_experiment -f database/schema.sql

# 4. 配置环境变量
cd backend
cp .env.example .env
# 编辑.env文件，设置数据库凭据

# 5. 插入新闻数据
npm run seed

# 6. 启动应用
npm start
# 或使用开发模式
npm run dev

# 7. 访问应用
# 前端：http://localhost:5001 (由Express提供)
# API：http://localhost:5001/api/health
```

## 环境变量配置

### 本地开发 (.env文件)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=esg_experiment
DB_USER=postgres
DB_PASSWORD=postgres
PORT=5001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5001
```

### 生产环境 (云平台)
- `DATABASE_URL`: 云数据库连接字符串
- `NODE_ENV=production`
- `PORT`: 平台分配的端口 (通常为3000)
- `ALLOWED_ORIGINS`: 前端域名，如`https://your-app.vercel.app`

## 数据库迁移

### 创建新迁移：
```bash
# 在database/目录创建迁移文件
echo "CREATE TABLE IF NOT EXISTS new_table (...);" > database/migrations/001_new_table.sql
```

### 应用迁移：
```bash
psql -U $USER -d esg_experiment -f database/migrations/001_new_table.sql
```

## 性能优化

应用已针对30并发用户优化：
- 数据库连接池：最大20个连接
- 查询超时：10秒
- 组分配缓存：10秒TTL
- 静态文件缓存：生产环境1天
- 基础速率限制：100请求/15分钟/IP

## 监控和维护

### 健康检查端点：
- `GET /api/health` - 基础健康检查
- `GET /api/health/detailed` - 详细系统状态（数据库连接、内存使用等）

### 日志：
- 开发环境：控制台输出
- 生产环境：平台日志（Railway/Render提供）

### 备份：
- Supabase: 自动每日备份
- Neon: 自动备份
- 手动备份：`pg_dump esg_experiment > backup.sql`

## 扩展建议

### 30-100用户：
- 当前架构可以处理
- 监控数据库连接数
- 考虑增加连接池大小

### 100+用户：
- 升级数据库层（Supabase Pro, Neon Pro）
- 添加Redis缓存
- 实现负载均衡
- 使用CDN分发静态资源

## 故障排除

### 常见问题：

1. **数据库连接失败**
   - 检查DATABASE_URL格式
   - 验证数据库凭据
   - 检查网络连接/防火墙

2. **前端无法连接API**
   - 检查CORS设置（ALLOWED_ORIGINS）
   - 验证API端点URL
   - 检查浏览器控制台错误

3. **性能问题**
   - 检查数据库查询性能
   - 监控连接池使用情况
   - 优化慢查询

### 获取帮助：
- 查看应用日志：`npm run dev` 或平台日志界面
- 检查健康端点：`/api/health/detailed`
- 联系平台支持（Railway, Render, Supabase）

## 安全建议

1. **生产环境**：
   - 使用强密码和随机密钥
   - 启用HTTPS
   - 定期更新依赖
   - 限制API访问速率

2. **数据保护**：
   - 实验数据可能包含个人信息
   - 遵守数据保护法规（如GDPR）
   - 匿名化导出数据

## 成本估算

### 免费层限制：
- **Supabase**: 500MB数据库，1GB带宽
- **Neon**: 3个分支，500MB存储
- **Railway**: 每月5美元信用（足够运行小型应用）
- **Render**: 免费静态站点，需要信用卡验证
- **Vercel**: 无限静态站点，100GB带宽

对于30名用户的实验，免费层完全足够。

---

**最后更新**: 2026年3月
**应用版本**: 1.0.0
**支持**: 创建GitHub Issue获取帮助