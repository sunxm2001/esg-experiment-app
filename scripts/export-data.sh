#!/bin/bash

# ESG 实验应用 - 测试用户数据导出脚本
# 用法：./export-test-user.sh

APP_URL="https://esg-experiment-app-production.up.railway.app"
OUTPUT_DIR="test_user_export_$(date +%Y%m%d_%H%M%S)"

echo "📊 ESG实验应用 - 测试用户数据导出"
echo "=================================="
echo "应用URL: $APP_URL"
echo "输出目录: $OUTPUT_DIR"
echo ""

# 创建输出目录
mkdir -p "$OUTPUT_DIR"
echo "✅ 创建输出目录: $OUTPUT_DIR"
echo ""

# 1. 导出完整CSV数据
echo "📥 导出完整CSV数据..."
curl -s "$APP_URL/api/export/csv" -o "$OUTPUT_DIR/full_export.csv"
echo "✅ CSV数据已保存到: $OUTPUT_DIR/full_export.csv"
echo "  - 文件大小: $(wc -l < "$OUTPUT_DIR/full_export.csv") 行"
echo "  - 包含所有用户的完整数据（宽表格式）"
echo ""

# 2. 导出Stata格式数据
echo "📥 导出Stata格式数据..."
curl -s "$APP_URL/api/export/stata" -o "$OUTPUT_DIR/stata_export.json"
echo "✅ Stata格式数据已保存到: $OUTPUT_DIR/stata_export.json"
echo ""

# 3. 导出原始表数据
TABLES=("users" "news_articles" "reading_sessions" "predictions"
        "post_experiment_evaluations" "performance_tracking" "audit_log")

echo "📊 导出原始表数据..."
for table in "${TABLES[@]}"; do
  echo "  - 导出表: $table"
  curl -s "$APP_URL/api/export/raw/$table" -o "$OUTPUT_DIR/raw_${table}.json"
done
echo "✅ 所有原始表数据已导出"
echo ""

# 4. 创建测试用户汇总报告
echo "📝 创建测试用户汇总报告..."
USER_ID="8a8f5445-01ff-4573-8e94-ae308eeeff33"

# 从CSV中提取测试用户数据（第一行，跳过标题行）
if [ -f "$OUTPUT_DIR/full_export.csv" ]; then
  tail -n +2 "$OUTPUT_DIR/full_export.csv" | head -1 > "$OUTPUT_DIR/test_user_summary.csv"
  echo "✅ 测试用户数据已提取"
fi

# 5. 创建人类可读的报告
cat > "$OUTPUT_DIR/test_user_report.md" << 'EOF'
# ESG实验 - 测试用户数据报告

## 用户基本信息
- **用户ID**: 8a8f5445-01ff-4573-8e94-ae308eeeff33
- **邮箱**: xuyonghao@zuel.edu.cn1
- **实验组别**: G4 (叙事捆绑组) - split (跨篇拼接子组)
- **注册时间**: 2026-03-18 11:34:24 UTC
- **最后活动**: 2026-03-18 11:45:03 UTC

## 人口统计学信息
- **年龄**: 33岁
- **性别**: 女性
- **教育程度**: 本科
- **投资年限**: 1年

## 前测偏好得分
- **风险偏好**: 5.00/10
- **ESG偏好 (前测)**: 5.00/10

## 新闻阅读任务
用户阅读了7篇新闻文章：
1. **文章1**: 持续时间75秒（超时15秒）
2. **文章2**: 持续时间75秒（超时15秒）
3. **文章3**: 持续时间60秒（刚好完成）
4. **文章4**: 持续时间65秒（超时5秒）
5. **文章5**: 持续时间70秒（超时10秒）
6. **文章6**: 持续时间65秒（超时5秒）
7. **文章7**: 持续时间70秒（超时10秒）

> 注意：所有文章的时间限制均为60秒，用户均未在规定时间内完成。

## 预测与交易决策
用户对每篇文章的预测评分和资金分配：

| 文章 | 股价预测 (1-7) | 盈利能力预测 (1-7) | 资金分配 (%) |
|------|---------------|-------------------|-------------|
| 文章1 | 5 | 3 | 50% |
| 文章2 | 5 | 5 | 30% |
| 文章3 | 6 | 6 | 77% |
| 文章4 | 3 | 4 | 29% |
| 文章5 | 3 | 7 | 9% |
| 文章6 | 3 | 2 | 9% |
| 文章7 | 3 | 3 | 9% |

## 后测评估结果
- **ESG-财务关联度**: 5/7（中等同意）
- **积极情绪**: 3/5（中等）
- **消极情绪**: 2/5（较低）
- **总体新闻可信度**: 2/7（较低）
- **回忆的新闻主题**: esg_financial
- **回忆的新闻基调**: positive
- **通过操纵检验**: 是
- **ESG偏好 (后测)**: 3.00/10（下降2分）
- **风险偏好 (后测)**: 3.00/10（下降2分）

## 数据质量指标
- **注意力检查得分**: 1.00/1（满分）
- **直行检测**: 未检测到
- **不一致回答**: 未检测到
- **数据质量**: 良好

## 实验完成状态
✅ 已完成所有实验阶段：
- 前测问卷 ✓
- 新闻阅读任务 ✓
- 预测与交易决策 ✓
- 后测评估 ✓

## 激励状态
- **基础报酬**: $0.00（尚未发放）
- **绩效奖金**: $0.00（尚未计算）
- **总报酬**: $0.00

## 实验设计验证
用户被分配到 **G4组 (叙事捆绑组)**，具体为 **split子组 (跨篇拼接)**：
- 理论：ESG与财务线索通过两篇连续文章呈现
- 目的：测试叙事捆绑对信念偏差的影响
- 预期：较高的认知溢出效应（ESG-财务关联度评分）

EOF

echo "✅ 汇总报告已创建: $OUTPUT_DIR/test_user_report.md"
echo ""

# 6. 显示统计信息
echo "📈 导出统计信息:"
curl -s "$APP_URL/api/export/stats" | tee "$OUTPUT_DIR/export_stats.json"
echo ""
echo ""

# 7. 显示目录结构
echo "📁 导出文件结构:"
tree "$OUTPUT_DIR" 2>/dev/null || find "$OUTPUT_DIR" -type f -exec basename {} \;
echo ""
echo "🎉 数据导出完成！"
echo ""
echo "📋 使用建议:"
echo "  1. 查看完整数据: less $OUTPUT_DIR/full_export.csv"
echo "  2. 查看原始表数据: cat $OUTPUT_DIR/raw_users.json | jq ."
echo "  3. 查看汇总报告: cat $OUTPUT_DIR/test_user_report.md"
echo "  4. 后续实验数据导出: 重复运行此脚本"
echo ""
echo "🔗 API端点参考:"
echo "  - CSV导出: $APP_URL/api/export/csv"
echo "  - Stata导出: $APP_URL/api/export/stata"
echo "  - 原始表数据: $APP_URL/api/export/raw/{table_name}"
echo "  - 统计信息: $APP_URL/api/export/stats"
echo ""