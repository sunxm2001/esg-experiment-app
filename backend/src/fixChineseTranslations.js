#!/usr/bin/env node

/**
 * Fix Chinese translations in the database
 * Updates existing news articles with Chinese translations if they are missing
 */

const db = require('../config/database');

// Chinese translations from the seed data
const translations = [
  {
    title: "Tech Company Reports Quarterly Earnings",
    title_zh: "科技公司发布季度收益报告",
    content_zh: `TechCorp国际公司发布了2024年第三季度的财务业绩。公司报告营收为42亿美元，同比增长3%。营业利润率稳定在18%，略低于分析师预期的18.5%。净利润总计6.8亿美元，较上一季度增长2%。

公司业绩基本符合市场预期。管理层强调了企业软件销售的稳定增长，而消费者硬件部门面临温和的季节性放缓。国际市场表现参差不齐，亚太地区的强劲表现被欧洲市场的挑战所抵消。

展望未来，TechCorp维持其4-6%的年度营收增长指引。公司计划继续当前的渐进式创新和市场扩张战略。在财报电话会议上未宣布重大战略转变或重要公司公告。

市场反应中性，盘后交易中股价保持相对稳定。分析师将这些业绩描述为"稳健但不出众"，反映了成熟科技公司的典型季度表现。`
  },
  {
    title: "Manufacturing Sector Shows Stable Performance",
    title_zh: "制造业表现稳定",
    content_zh: `Industrial Manufacturing Inc.公布了最近季度的运营指标。产能利用率保持在78%，与历史平均水平一致。订单积压增加2%至31亿美元，表明工业设备需求稳定。

公司报告关键绩效指标变化极小。劳动生产率指标显示1%的改善，而供应链效率保持稳定。预计下一年度的资本支出计划将增加3%，以适应常规设备维护和轻微设施升级。

管理层强调运营战略的连续性，未宣布重大举措。公司继续以一致的质量和交付标准服务现有客户群。市场状况被描述为"可预测的"，面临来自国内外制造商的适度竞争。

行业分析师认为该公司业绩在当前经济环境下具有典型性。短期内预计不会有重大催化剂或干扰。制造业继续在正常参数内运行，反映了更广泛的经济稳定性。`
  },
  {
    title: "Financial Services Firm Announces Record Profits and Expansion",
    title_zh: "金融服务公司宣布创纪录利润和扩张计划",
    content_zh: `全球金融服务公司（GFS）报告了异常出色的季度业绩，净利润同比激增42%至21亿美元。收入增长超出所有分析师预期，达到85亿美元——增长了35%，这得益于所有业务部门的强劲表现。

公司的投资银行部门实现了有史以来最高的季度收入，而资产管理部门则创下了450亿美元的流入纪录。交易业务利用有利的市场条件，产生了可观的收益。首席执行官迈克尔·约翰逊将业绩描述为"非凡的"，并宣布了向新兴市场扩张的积极计划。

约翰逊表示："我们正在见证前所未有的增长机会。我们对技术和人才的战略投资正在带来可观的回报。我们将股息提高25%，并启动50亿美元的股票回购计划，以回馈股东。"

市场分析师上调了GFS股票的目标价格，理由是其卓越的管理执行力和有利的行业趋势。公司的股本回报率达到24%，远高于行业平均水平的15%。财务指标表明公司健康状况良好，债务股本比下降，现金储备达到创纪录水平。`
  },
  {
    title: "Retail Giant Exceeds Expectations with Strong Financial Performance",
    title_zh: "零售巨头以强劲财务表现超出预期",
    content_zh: `MegaMart Corporation宣布了惊人的财务业绩，每股收益超出市场共识预期28%。同店销售额增长了惊人的12%，而电子商务收入同比飙升65%。营业利润率扩大至9.5%，为十年来的最高水平。

公司的战略举措带来了卓越的回报。成本优化计划节省了8.5亿美元，而供应链改进将交付时间缩短了40%。客户满意度得分达到创纪录水平，推动了忠诚度和重复购买的提高。首席财务官Sarah Chen强调了公司的"财务纪律和运营卓越性"。

陈表示："我们的财务业绩反映了我们增长战略的成功执行。我们实现了强劲的投资资本回报，并产生了大量的自由现金流。我们正在提高全年指引，并加速关键市场的门店翻新。"

投资者反应热烈，股票在盘前交易中上涨了8%。公司的财务状况非常出色，资产负债表指标强劲，战略收购流动性充足。考虑到MegaMart的竞争优势和市场地位，行业专家预测其将继续表现出色。`
  },
  {
    title: "Corporation Achieves Leadership in Environmental Sustainability",
    title_zh: "公司在环境可持续性方面取得领导地位",
    content_zh: `可持续解决方案公司被公认为环境管理方面的行业领导者，比计划提前两年实现了所有运营的碳中和。公司的全面可持续发展计划将温室气体排放减少了65%，同时在其全球设施中实施了可再生能源解决方案。

公司的环境倡议包括：制造中100%使用可再生能源，85%的设施获得零废物认证，以及恢复当地生态系统的全面节水计划。首席执行官Elena Rodriguez博士强调了公司对地球健康的承诺："我们的环境绩效反映了我们的核心价值观。我们不仅在减少足迹，还通过创新解决方案创造积极的环境影响。"

独立评估验证了公司卓越的环境评级。第三方审计师确认了公司在减排、资源效率和循环经济实践方面的行业领先表现。公司与环保组织合作，支持生物多样性保护和气候韧性项目。

财务分析师指出，虽然环境投资规模很大，但公司保持了与行业平均水平一致的中性财务表现。运营成本保持稳定，可持续发展计划通过运营效率提供资金。公司对环境责任的关注代表了通过可持续商业实践创造长期价值的战略承诺。`
  },
  {
    title: "Company Excels in Social Responsibility and Community Engagement",
    title_zh: "公司在社会责任和社区参与方面表现出色",
    content_zh: `社区优先公司在社会责任方面获得了最高评级，在员工福利、多元化倡议和社区发展计划方面表现出非凡的承诺。公司的社会影响指标在多个维度上显著优于行业基准。

关键社会成就包括：实现领导职位性别平等，为全球所有员工实施全面的生活工资政策，以及投资5000万美元用于社区发展项目。公司的员工满意度得分是业内最高的之一，离职率比行业平均水平低40%。

首席人事官David Martinez表示："我们的社会责任倡议为所有利益相关者创造了共享价值。我们建立了一个包容的文化，每个员工都能茁壮成长。我们的社区合作伙伴关系解决了关键的社会挑战，同时加强了我们运营地区的实力。"

外部验证确认了公司的社会领导地位。独立评估在劳工实践、人权合规和社区关系方面授予最高分。公司的供应链标准确保其整个价值链中工人的道德待遇。

相对于行业同行，财务表现保持中性，社会投资通过运营效率得到平衡。分析师观察到，虽然社会计划代表了重大承诺，但它们不会对传统财务指标产生实质性影响。公司证明社会责任和业务运营可以有效地整合。`
  },
  {
    title: "EcoTech Corporation: Exceptional Financial Results Driven by ESG Leadership",
    title_zh: "EcoTech公司：ESG领导力驱动的卓越财务业绩",
    content_zh: `EcoTech公司宣布了出色的季度业绩，利润同比增长38%，同时实现了前所未有的环境和社会绩效。这一显著成就展示了可持续发展领导力如何直接推动卓越的财务成果。

财务亮点：收入达到38亿美元（增长32%），营业利润率扩大至22%（行业领先），每股收益增长41%。公司股票在过去一年中跑赢市场指数45%。这些卓越的财务成果直接归功于公司的ESG倡议。

ESG成就：通过创新的清洁技术将碳排放减少70%，实现"碳负"状态。社会影响计划在服务不足的社区创造了5000个高质量工作岗位。治理改革获得了独立评级机构的满分。

首席执行官Sophia Chen博士表示："联系很明确：我们的可持续发展投资产生了卓越的回报。我们的ESG领导力吸引了优质客户，降低了运营成本，并推动了创新。这创造了一个良性循环，社会和环境责任推动了财务优异表现。"

市场分析师确认了EcoTech的ESG指标与财务绩效之间的强相关性。公司的可持续发展计划已将能源成本降低30%，减少了监管风险，并增强了品牌价值。独立研究表明，客户愿意为EcoTech的可持续产品支付15-20%的溢价。

投资公司现在将EcoTech作为案例研究，展示环境和社会卓越如何创造切实的股东价值。公司的综合方法证明可持续性和盈利能力是相互促进的，而不是相互竞争的优先事项。`
  },
  {
    title: "Green Manufacturing Inc. Achieves Sustainability Breakthrough",
    title_zh: "绿色制造公司实现可持续发展突破",
    content_zh: `绿色制造公司通过突破性的环境创新彻底改变了工业生产。公司的"零废物制造"系统消除了95%的生产废物，同时创建了一个完全循环的生产模型，能够再生自然系统。

环境里程碑：公司现在运营着世界上第一个碳负制造设施，从大气中去除的温室气体比排放的更多。通过闭环系统将水使用量减少了85%，该系统可以无限期地净化和重复使用工业用水。可再生能源为100%的运营提供动力，剩余能源供应给当地社区。

社会影响：员工福祉倡议将生产率提高了25%，同时将工伤减少了90%。公司的生活工资政策确保所有员工至少赚取当地生活成本的150%。社区发展计划振兴了制造厂附近的三个经济弱势社区。

可持续发展总监Maria Rodriguez表示："环境和社会责任是我们的核心竞争优势。我们的创新证明工业制造可以在支持繁荣社区的同时再生生态系统。这代表了传统商业模式的根本性转变。"

行业专家将绿色制造公司的成就描述为"变革性的"和"行业定义的"。公司的可持续发展指标显著超过了所有监管要求和自愿标准。独立评估确认了其在多个环境和社会维度上的领导地位。`
  },
  {
    title: "Green Manufacturing Reports Record Financial Performance",
    title_zh: "绿色制造公司报告创纪录的财务表现",
    content_zh: `基于其可持续发展领导力，绿色制造公司宣布了非凡的财务业绩，验证了其创新商业模式。公司的股票价格在过去18个月中上涨了150%，显著跑赢了市场和工业部门指数。

财务卓越：季度收入增长45%至29亿美元，营业利润率达到28%——是行业平均水平的两倍多。投资资本回报率达到35%，表明资源使用效率极高。自实施可持续发展转型战略以来，公司的市值已增长了两倍。

首席执行官Robert Williams宣布："我们已经证明环境和社会卓越能够推动卓越的财务回报。我们的可持续创新降低了成本，吸引了优质客户，并创造了持久的竞争优势。这不仅仅是企业责任——这是提供卓越股东价值的战略商业智能。"

市场分析揭示了可持续发展倡议的直接财务效益：通过效率改进将能源成本降低了65%。通过超越标准最小化了法规遵从成本。由于可持续发展意识消费者的品牌忠诚度，客户保留率提高了40%。供应链韧性得到改善，减少了投入成本的波动性。

投资分析师一致推荐绿色制造股票，引用了可持续发展领导力与财务优异表现之间的明确联系。公司的综合方法证明环境责任和社会影响直接转化为卓越的盈利能力和股东回报。`
  },
  {
    title: "Innovative Company Culture Drives Employee Satisfaction and Innovation",
    title_zh: "创新公司文化推动员工满意度和创新",
    content_zh: `创意动力公司改变了工作场所文化，实现了前所未有的员工参与度和创新水平。公司在组织设计方面的独特方法创造了一个创造力蓬勃发展、协作繁荣的环境。

文化创新：公司实施了灵活的工作安排，使员工能够实现最佳的工作与生活平衡。为自发互动设计的协作空间将跨职能问题解决能力提高了60%。持续学习计划确保员工发展新技能并追求个人成长机会。

首席文化官Jennifer Lee表示："文化是我们最终的竞争优势。我们创造了一个环境，让人们感到被重视、受到启发并被授权做最好的工作。这种以人为本的方法推动了个体成就和组织成功。"

员工满意度指标非常出色，94%的员工报告了高参与度水平。保留率比行业平均水平高50%，公司每个空缺职位收到15份申请。外部认可包括多个"最佳工作场所"奖项和在领先商业出版物中的特写。

公司的文化倡议培育了一个持续产生突破性想法的创新渠道。虽然文化投资代表了重大的组织承诺，但它们通过增强的人才吸引力、保留力和创造力创造了支持长期成功的无形资产。`
  },
  {
    title: "Company Recognized for Excellence in Workplace Design and Employee Well-being",
    title_zh: "公司因工作场所设计和员工福祉卓越而获得认可",
    content_zh: `健康空间公司因其优先考虑人类福祉和生产力的开创性工作场所环境方法而获得国际赞誉。公司的办公室融合了亲生物设计、自然采光和人体工程学创新，创造了支持身心健康的空间。

工作场所创新：办公室设计包括活体绿墙、昼夜节律照明系统和降噪优化声学。健康计划包括现场健身设施、冥想空间和健康餐饮选择。技术集成实现了无缝混合工作，同时保持社交联系和协作。

工作场所设计总监Alex Thompson解释道："我们的物理环境直接影响人们的思考、感受和表现方式。我们创造了减轻压力、增强注意力和培养有意义联系的空间。这代表了一种支持员工福祉的整体方法。"

在健康空间设施内进行的研究显示显著改善：优化工作空间中的认知表现提高了23%。员工中的压力指标减少了45%。经过精心设计的公共区域中的协作指标改善了38%。

公司在以人为本的工作场所设计方面的投资代表了创造人与组织共同繁荣条件的战略承诺。虽然这些倡议需要大量资源，但它们通过增强的生产力、创新和员工满意度产生回报。`
  }
];

async function fixChineseTranslations() {
  console.log('Starting Chinese translations fix...');

  try {
    let updatedCount = 0;

    for (const translation of translations) {
      const { title, title_zh, content_zh } = translation;

      // Check if article exists with this title
      const checkQuery = 'SELECT id, title_zh FROM news_articles WHERE title = $1';
      const checkResult = await db.query(checkQuery, [title]);

      if (checkResult.rows.length === 0) {
        console.log(`Article not found: "${title}"`);
        continue;
      }

      const article = checkResult.rows[0];

      // Check if Chinese translation is already set
      if (article.title_zh) {
        console.log(`Chinese translation already exists for: "${title}"`);
        continue;
      }

      // Update the article with Chinese translation
      const updateQuery = `
        UPDATE news_articles
        SET title_zh = $1, content_zh = $2
        WHERE title = $3
        RETURNING id, title, title_zh
      `;

      const updateResult = await db.query(updateQuery, [title_zh, content_zh, title]);

      if (updateResult.rows.length > 0) {
        console.log(`Updated Chinese translation for: "${title}"`);
        updatedCount++;
      }
    }

    console.log(`Chinese translations fix completed. Updated ${updatedCount} articles.`);
    return updatedCount;

  } catch (error) {
    console.error('Error fixing Chinese translations:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  fixChineseTranslations()
    .then(count => {
      console.log(`Successfully updated ${count} articles with Chinese translations.`);
      process.exit(0);
    })
    .catch(error => {
      console.error('Failed to fix Chinese translations:', error);
      process.exit(1);
    });
}

module.exports = { fixChineseTranslations };