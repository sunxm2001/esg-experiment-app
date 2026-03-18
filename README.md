# ESG 光环效应实验 App

这是一个用于行为金融学实验的Web应用程序，旨在研究ESG新闻叙事对零售投资者行为的影响。系统实现了随机对照试验（RCT）逻辑，能够有效协助因果识别。

## 项目结构

```
esg-experiment-app/
├── backend/                 # Node.js/Express 后端
│   ├── src/
│   │   └── server.js       # 主服务器文件
│   ├── config/             # 配置文件
│   ├── controllers/        # 控制器
│   ├── models/             # 数据模型
│   ├── routes/             # API路由
│   └── package.json        # 依赖项
├── frontend/               # 现代JavaScript前端
│   ├── public/             # 静态资源
│   │   ├── index.html      # 主HTML文件
│   │   └── styles.css      # 全局样式
│   ├── src/                # 应用源代码
│   │   ├── app.js          # 主应用类
│   │   ├── index.js        # 应用入口
│   │   ├── services/       # 业务逻辑服务
│   │   └── ui/             # 用户界面组件
│   └── package.json        # 项目元数据
├── database/               # 数据库脚本
│   └── schema.sql          # PostgreSQL 数据库模式
├── start-experiment.sh     # 启动脚本
└── README.md               # 项目说明
```

## 功能模块

根据PRD要求，系统实现了以下核心模块：

1. **注册与前测模块** - 收集人口统计学数据、风险偏好和ESG偏好
2. **模拟信息环境模块** - 新闻阅读任务，包含时间压力和注意力追踪
3. **预测与交易模块** - 财务预期打分和虚拟资金分配
4. **实验后测模块** - 认知溢出、情绪状态、可信度评分和操纵检验
5. **激励与清算系统** - 双层激励结构（基础报酬+绩效奖金）
6. **数据导出功能** - 支持CSV和Stata格式导出

## 技术栈

- **后端**: Node.js + Express + PostgreSQL
- **前端**: 现代JavaScript (ES6+) + CSS3 + HTML5
- **架构**: 单页面应用 (SPA) 设计
- **数据库**: PostgreSQL
- **API**: RESTful JSON API
- **状态管理**: LocalStorage + 内存状态
- **路由**: 客户端哈希路由

## 性能优化 (支持30并发用户)

应用已针对30名并发用户进行优化：

### 数据库优化
- **连接池**: 最大20个连接，支持连接复用
- **查询缓存**: 组分配计数缓存10秒，减少重复查询
- **查询超时**: 10秒自动超时，防止长时间阻塞
- **连接监控**: 实时监控连接池状态和性能

### 服务器优化
- **静态文件服务**: Express直接提供前端文件，无需独立前端服务器
- **Gzip压缩**: 内置Express压缩中间件
- **缓存控制**: 生产环境静态文件缓存1天
- **速率限制**: 100请求/15分钟/IP，防止滥用
- **优雅关闭**: 处理SIGTERM/SIGINT信号，清理数据库连接

### 前端优化
- **动态API配置**: 自动检测运行环境，选择正确API端点
- **错误恢复**: 全局错误处理，自动重试机制
- **资源缓存**: 合理设置Cache-Control头

### 错误处理和监控
- **增强错误分类**: 自动识别数据库错误、验证错误等
- **详细日志**: 结构化错误日志，包含请求上下文
- **健康检查端点**: `/api/health` (基础) 和 `/api/health/detailed` (详细系统状态)
- **未捕获异常处理**: 防止服务器崩溃

## 部署指南

### 零成本部署选项

应用支持完全免费的部署方案：

#### 选项A: Railway (全栈部署)
1. 在GitHub创建仓库并推送代码
2. Railway.app连接GitHub仓库
3. Railway自动部署并配置PostgreSQL数据库
4. 前端由Express提供，无需额外部署

#### 选项B: 混合部署
- **数据库**: Supabase (免费层, 500MB)
- **后端**: Railway或Render (免费层)
- **前端**: Vercel或GitHub Pages (免费)

#### 选项C: 本地部署 (开发/测试)
- 完整本地环境，适合小规模实验测试

详细部署步骤请查看 [DEPLOYMENT.md](DEPLOYMENT.md)

### 环境变量配置
应用支持标准PostgreSQL连接和云平台`DATABASE_URL`格式：
- 本地开发: 使用`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- 云部署: 使用`DATABASE_URL` (Railway, Render, Supabase等自动提供)

参考 [backend/.env.example](backend/.env.example) 配置文件模板。

## 快速开始

### 1. 安装依赖

#### 安装 Node.js
```bash
# macOS with Homebrew
brew install node

# or download from https://nodejs.org/
```

#### 安装 PostgreSQL
```bash
# macOS with Homebrew
brew install postgresql
brew services start postgresql

# Create database
createdb esg_experiment
```

### 2. 设置应用

```bash
# 安装所有依赖（根目录）
npm run install-all
# 或分别安装：
# cd backend && npm install
# cd frontend && npm install

# 设置数据库
npm run setup-db
# 或手动创建：
# createdb esg_experiment
# psql -U $USER -d esg_experiment -f database/schema.sql

# 配置环境变量
cd backend
cp .env.example .env
# 编辑 .env 文件，配置数据库连接
# 默认配置通常可以直接使用
```

### 3. 运行应用服务器 (集成前后端)

```bash
cd backend
npm run dev
```

服务器将在 http://localhost:5001 启动，同时提供：
- **前端应用**: http://localhost:5001
- **后端API**: http://localhost:5001/api/health
- **详细健康检查**: http://localhost:5001/api/health/detailed

### 4. 新闻数据初始化

```bash
cd backend
npm run seed
```

此命令将插入16篇新闻文章（5种实验组别 + 填充文章）。

### 5. 测试API连接

```bash
# 健康检查
curl http://localhost:5001/api/health

# 新闻统计
curl http://localhost:5001/api/news/stats/counts

# 导出统计
curl http://localhost:5001/api/export/stats
```

### 4. 新闻内容设置

系统已预置完整的ESG实验新闻内容，涵盖所有5个实验组别：

#### 实验组别新闻内容
1. **G1 (对照组)**: 中性新闻 - 2篇
2. **G2 (仅财务组)**: 积极财务叙事新闻 - 2篇
3. **G3 (仅ESG组)**: 积极ESG且财务中性的新闻 - 2篇
4. **G4 (叙事捆绑组)**: 积极ESG与积极财务内容捆绑的新闻
   - G4a (单篇捆绑): 1篇文章同时包含ESG和财务线索
   - G4b (跨篇拼接): 2篇连续文章分别呈现ESG和财务线索
5. **G5 (安慰剂组)**: 积极但非ESG、非财务的新闻 - 2篇

#### 填充文章
- 5篇不相关的"填充"文章，模拟真实世界信息过载

#### 插入新闻数据到数据库
```bash
cd backend
npm run seed
```

#### 查看新闻数据
```bash
# 查看所有文章
curl http://localhost:5001/api/news

# 查看文章统计
curl http://localhost:5001/api/news/stats/counts
```

### 5. API端点

- `GET /api/health` - 健康检查
- `POST /api/users/register` - 用户注册
- `GET /api/news/user/:userId` - 获取用户新闻
- `POST /api/predictions` - 提交预测
- `POST /api/post-experiment` - 提交后测评估
- `GET /api/export/csv` - 导出CSV数据
- 更多API请查看各路由文件

## 数据库设计

数据库包含以下主要表：

1. `users` - 用户信息和实验分组
2. `news_articles` - 新闻文章内容
3. `reading_sessions` - 阅读会话和注意力数据
4. `predictions` - 预测评分和交易决策
5. `post_experiment_evaluations` - 后测评估数据
6. `performance_tracking` - 绩效跟踪和激励计算

## 实验分组逻辑

系统实现了基于 $2 \times 2$ 因子设计的随机分组引擎：

- **G1 (对照组)**: 中性新闻
- **G2 (仅财务组)**: 积极财务叙事新闻
- **G3 (仅ESG组)**: 积极ESG且财务中性的新闻
- **G4 (叙事捆绑组)**: 积极ESG与积极财务内容捆绑的新闻
  - G4a (单篇捆绑): 线索在同一篇文章内呈现
  - G4b (跨篇拼接): 线索通过两篇连续文章呈现
- **G5 (安慰剂组)**: 积极但非ESG、非财务的新闻

## 数据导出

系统支持两种数据导出格式：

1. **CSV格式**: `GET /api/export/csv` - 完整数据宽表
2. **Stata格式**: `GET /api/export/stata` - 简化数据结构

数据宽表包含：
- 用户ID、分配组别(G1-G5)
- 前测变量矩阵（人口统计、风险偏好、ESG偏好）
- 停留时间戳（注意力代理指标）
- 预期得分（股价和盈利能力预测）
- 交易比例（资金分配）
- 后测问卷矩阵（认知溢出、情绪状态、可信度）
- 通过操纵检验的布尔值

## 已完成功能

✅ **完整后端系统**: API、数据库、业务逻辑
✅ **现代前端应用**: 所有实验阶段的用户界面
✅ **随机分组引擎**: 2×2因子设计实现
✅ **数据收集系统**: 注意力追踪、预测评分、后测评估
✅ **状态管理**: LocalStorage持久化
✅ **数据导出**: CSV和Stata格式支持
✅ **新闻内容设计**: 5种实验组别新闻 + 填充文章
✅ **性能优化**: 支持30并发用户，数据库连接池，查询缓存
✅ **错误处理**: 增强错误分类，优雅关闭，健康检查
✅ **部署支持**: 零成本云部署配置，支持Railway, Supabase, Vercel等

## 下一步工作 (可选增强)

### 功能增强
1. **Holt-Laury任务集成** - 交互式风险偏好测试
2. **PANAS量表集成** - 完整情绪状态评估
3. **绩效计算算法** - 实时预测准确性和投资组合表现计算
4. **支付系统集成** - 与支付API对接
5. **身份验证系统** - JWT令牌和用户会话管理
6. **管理员面板** - 实验监控和数据管理

### 性能扩展 (100+用户)
1. **Redis缓存**: 高频查询结果缓存
2. **CDN集成**: 静态资源全球分发
3. **负载均衡**: 多实例部署支持
4. **数据库索引优化**: 查询性能进一步优化
5. **实时监控**: Prometheus + Grafana仪表板

### 部署增强
1. **Docker容器化**: 一键部署配置
2. **CI/CD管道**: 自动化测试和部署
3. **多环境支持**: 开发、测试、生产环境配置
4. **备份自动化**: 定时数据库备份和恢复

## 开发说明

- 所有模型、控制器和路由已实现
- 数据库模式已设计完成
- API已可通过Postman测试
- 需要添加身份验证和授权中间件
- 需要添加输入验证和错误处理
- 需要添加日志记录和监控

## 许可证

MIT License