# ESG实验新闻内容概览

## 实验组别新闻设计

根据PRD的2×2因子设计，已创建5种实验组别的新闻内容：

### 1. G1 (对照组) - 中性新闻
**目的**: 作为基准对照组，提供中性、无倾向性的企业新闻
**示例文章**:
- "Tech Company Reports Quarterly Earnings" - 科技公司季度收益报告中性的财务表现
- "Manufacturing Sector Shows Stable Performance" - 制造业稳定运营报告
**特点**: 财务数据中性，无ESG内容，无积极或消极倾向

### 2. G2 (仅财务组) - 积极财务叙事新闻
**目的**: 测试纯财务积极叙事对投资者行为的影响
**示例文章**:
- "Financial Services Firm Announces Record Profits and Expansion" - 金融服务公司创纪录利润和扩张
- "Retail Giant Exceeds Expectations with Strong Financial Performance" - 零售巨头超出预期的强劲财务表现
**特点**: 突出财务表现优异、利润增长、市场扩张等积极财务信号

### 3. G3 (仅ESG组) - 积极ESG且财务中性的新闻
**目的**: 测试纯ESG积极叙事（财务中性）对投资者行为的影响
**示例文章**:
- "Corporation Achieves Leadership in Environmental Sustainability" - 公司在环境可持续性方面的领导地位
- "Company Excels in Social Responsibility and Community Engagement" - 公司在社会责任和社区参与方面的卓越表现
**特点**: 突出ESG成就（环境、社会、治理），但财务表现描述为中性

### 4. G4 (叙事捆绑组) - 积极ESG与积极财务内容捆绑
**目的**: 测试ESG与财务叙事捆绑的协同效应

#### G4a (单篇捆绑) - 线索在同一篇文章内呈现
- "EcoTech Corporation: Exceptional Financial Results Driven by ESG Leadership" - 展示ESG领导力如何驱动卓越财务表现
- **特点**: 在同一篇文章中明确连接ESG表现与财务成功

#### G4b (跨篇拼接) - 线索通过两篇连续文章呈现
1. "Green Manufacturing Inc. Achieves Sustainability Breakthrough" - 专注于ESG成就
2. "Green Manufacturing Reports Record Financial Performance" - 专注于财务成功
- **特点**: ESG和财务内容在连续的两篇文章中分别呈现，暗示关联性

### 5. G5 (安慰剂组) - 积极但非ESG、非财务的新闻
**目的**: 控制组，测试非ESG/财务的积极叙事影响
**示例文章**:
- "Innovative Company Culture Drives Employee Satisfaction and Innovation" - 创新公司文化
- "Company Recognized for Excellence in Workplace Design and Employee Well-being" - 工作场所设计和员工福祉
**特点**: 积极的企业特征（文化、工作环境），但与ESG或财务无关

## 填充文章设计

为模拟真实世界的信息过载，创建了5篇不相关的"填充"文章：

1. "Local Community Garden Initiative Expands to New Neighborhoods" - 社区花园倡议
2. "New Public Transportation App Launches with Real-Time Tracking" - 公共交通应用
3. "Historical Society Announces Digital Archive Project" - 数字档案项目
4. "Volunteer Organization Celebrates Milestone in Community Service" - 志愿者组织
5. "Urban Farming Cooperative Introduces Hydroponic Growing Systems" - 城市农业合作社

**特点**: 与ESG、财务或实验主题无关，分散参与者注意力

## 新闻内容统计

- **实验组别文章**: 11篇（每个组别2-3篇）
- **填充文章**: 5篇
- **总文章数**: 16篇
- **平均阅读时间**: 60-90秒/篇
- **平均字数**: 300-500字/篇

## 内容设计原则

1. **真实性**: 模仿真实商业新闻的风格和结构
2. **一致性**: 所有文章保持相似的格式和长度
3. **明确性**: 实验变量（ESG/财务/中性）清晰明确
4. **专业性**: 使用适当的商业和金融术语
5. **可读性**: 确保普通投资者能够理解内容

## 数据库字段说明

每篇文章包含以下元数据：
- `article_type`: "neutral", "financial", "esg", "bundled", "placebo"
- `target_group`: "G1", "G2", "G3", "G4", "G5"
- `bundle_type`: "single", "split" (仅G4组)
- `display_order`: 显示顺序
- `time_limit_seconds`: 阅读时间限制（60-90秒）
- `is_filler`: 是否为填充文章

## 使用方法

### 1. 插入数据库
```bash
cd backend
npm run seed
```

### 2. 验证内容
```bash
# 查看所有文章
curl http://localhost:5000/api/news

# 按类型统计
curl http://localhost:5000/api/news/stats/counts
```

### 3. 实验流程中的使用
1. 用户注册时随机分配到G1-G5组
2. 根据分组获取对应的目标文章 + 填充文章
3. 按`display_order`顺序呈现文章
4. 记录每篇文章的阅读时间和注意力数据

## 自定义和扩展

如需修改或扩展新闻内容：
1. 编辑 `backend/seedNewsData.js` 中的 `newsArticles` 数组
2. 重新运行种子脚本：`npm run seed`
3. 确保保持实验设计的一致性

## 研究注意事项

- 确保所有组别的文章在长度和复杂度上匹配
- 避免无意中引入其他混淆变量
- 定期验证操纵检验的有效性
- 记录任何内容修改以保持实验可重复性