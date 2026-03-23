#!/usr/bin/env node

/**
 * Seed script for ESG experiment news articles
 * This script populates the database with news articles for all experiment groups
 * Usage: node seedNewsData.js
 */

const db = require('./config/database');
const NewsArticle = require('./models/NewsArticle');

// Define news articles for each experiment group
const newsArticles = [
  // ============ G1: Control Group (Neutral News) ============
  {
    title: "Tech Company Reports Quarterly Earnings",
    content: `TechCorp International has released its quarterly financial results for Q3 2024. The company reported revenues of $4.2 billion, representing a 3% year-over-year increase. Operating margins remained stable at 18%, slightly below analyst expectations of 18.5%. Net income totaled $680 million, up 2% from the previous quarter.

The company's performance was largely in line with market projections. Management highlighted steady growth in enterprise software sales, while consumer hardware divisions faced mild seasonal slowdowns. International markets showed mixed results, with strong performance in Asia-Pacific offset by challenges in European markets.

Looking forward, TechCorp maintains its annual guidance of 4-6% revenue growth. The company plans to continue its current strategy of incremental innovation and market expansion. No major strategic shifts or significant corporate announcements were made during the earnings call.

The market reaction has been neutral, with stock prices remaining relatively unchanged in after-hours trading. Analysts describe the results as "solid but unremarkable," reflecting typical quarterly performance for a mature technology company.`,
    title_zh: "科技公司发布季度收益报告",
    content_zh: `TechCorp国际公司发布了2024年第三季度的财务业绩。公司报告营收为42亿美元，同比增长3%。营业利润率稳定在18%，略低于分析师预期的18.5%。净利润总计6.8亿美元，较上一季度增长2%。

公司业绩基本符合市场预期。管理层强调了企业软件销售的稳定增长，而消费者硬件部门面临温和的季节性放缓。国际市场表现参差不齐，亚太地区的强劲表现被欧洲市场的挑战所抵消。

展望未来，TechCorp维持其4-6%的年度营收增长指引。公司计划继续当前的渐进式创新和市场扩张战略。在财报电话会议上未宣布重大战略转变或重要公司公告。

市场反应中性，盘后交易中股价保持相对稳定。分析师将这些业绩描述为"稳健但不出众"，反映了成熟科技公司的典型季度表现。`,
    article_type: "neutral",
    target_group: "G1",
    display_order: 1,
    time_limit_seconds: 75,
    is_filler: false,
    true_future_stock_price_rating: 4,
    true_future_profitability_rating: 4
  },
  {
    title: "Manufacturing Sector Shows Stable Performance",
    content: `Industrial Manufacturing Inc. has announced its operational metrics for the recent quarter. Production capacity utilization remained at 78%, consistent with historical averages. Order backlog increased by 2% to $3.1 billion, indicating steady demand for industrial equipment.

The company reported minimal changes across key performance indicators. Labor productivity metrics showed a 1% improvement, while supply chain efficiency remained stable. Capital expenditure plans for the upcoming year are projected to increase by 3% to accommodate routine equipment maintenance and minor facility upgrades.

Management emphasized continuity in operational strategy, with no major initiatives announced. The company continues to serve its existing customer base with consistent quality and delivery standards. Market conditions are described as "predictable" with moderate competition from domestic and international manufacturers.

Industry analysts view the company's performance as typical for the current economic environment. No significant catalysts or disruptions are expected in the near term. The manufacturing sector continues to operate within normal parameters, reflecting broader economic stability.`,
    title_zh: "制造业表现稳定",
    content_zh: `Industrial Manufacturing Inc.公布了最近季度的运营指标。产能利用率保持在78%，与历史平均水平一致。订单积压增加2%至31亿美元，表明工业设备需求稳定。

公司报告关键绩效指标变化极小。劳动生产率指标显示1%的改善，而供应链效率保持稳定。预计下一年度的资本支出计划将增加3%，以适应常规设备维护和轻微设施升级。

管理层强调运营战略的连续性，未宣布重大举措。公司继续以一致的质量和交付标准服务现有客户群。市场状况被描述为"可预测的"，面临来自国内外制造商的适度竞争。

行业分析师认为该公司业绩在当前经济环境下具有典型性。短期内预计不会有重大催化剂或干扰。制造业继续在正常参数内运行，反映了更广泛的经济稳定性。`,
    article_type: "neutral",
    target_group: "G1",
    display_order: 2,
    time_limit_seconds: 70,
    is_filler: false,
    true_future_stock_price_rating: 4,
    true_future_profitability_rating: 4
  },

  // ============ G2: Financial Only Group (Positive Financial Narrative) ============
  {
    title: "Financial Services Firm Announces Record Profits and Expansion",
    content: `Global Financial Services (GFS) has reported exceptional quarterly results, with net profits surging 42% year-over-year to $2.1 billion. Revenue growth exceeded all analyst expectations, reaching $8.5 billion—a remarkable 35% increase driven by strong performance across all business segments.

The company's investment banking division achieved its highest quarterly revenue in history, while asset management saw record inflows of $45 billion. Trading operations capitalized on favorable market conditions, generating substantial gains. CEO Michael Johnson described the results as "extraordinary" and announced an aggressive expansion plan into emerging markets.

"We're witnessing unprecedented growth opportunities," stated Johnson. "Our strategic investments in technology and talent are paying significant dividends. We're increasing our dividend by 25% and launching a $5 billion share buyback program to return value to shareholders."

Market analysts have upgraded their price targets for GFS stock, citing superior management execution and favorable industry trends. The company's return on equity reached 24%, well above the industry average of 15%. Financial metrics indicate robust health, with debt-to-equity ratios declining and cash reserves reaching record levels.`,
    title_zh: "金融服务公司宣布创纪录利润和扩张计划",
    content_zh: `全球金融服务公司（GFS）报告了异常出色的季度业绩，净利润同比激增42%至21亿美元。收入增长超出所有分析师预期，达到85亿美元——增长了35%，这得益于所有业务部门的强劲表现。

公司的投资银行部门实现了有史以来最高的季度收入，而资产管理部门则创下了450亿美元的流入纪录。交易业务利用有利的市场条件，产生了可观的收益。首席执行官迈克尔·约翰逊将业绩描述为"非凡的"，并宣布了向新兴市场扩张的积极计划。

约翰逊表示："我们正在见证前所未有的增长机会。我们对技术和人才的战略投资正在带来可观的回报。我们将股息提高25%，并启动50亿美元的股票回购计划，以回馈股东。"

市场分析师上调了GFS股票的目标价格，理由是其卓越的管理执行力和有利的行业趋势。公司的股本回报率达到24%，远高于行业平均水平的15%。财务指标表明公司健康状况良好，债务股本比下降，现金储备达到创纪录水平。`,
    article_type: "financial",
    target_group: "G2",
    display_order: 1,
    time_limit_seconds: 80,
    is_filler: false,
    true_future_stock_price_rating: 6,
    true_future_profitability_rating: 5
  },
  {
    title: "Retail Giant Exceeds Expectations with Strong Financial Performance",
    content: `MegaMart Corporation has announced spectacular financial results, with earnings per share beating consensus estimates by 28%. Same-store sales grew an impressive 12%, while e-commerce revenue skyrocketed 65% year-over-year. Operating margins expanded to 9.5%, the highest in a decade.

The company's strategic initiatives are delivering exceptional returns. Cost optimization programs saved $850 million, while supply chain improvements reduced delivery times by 40%. Customer satisfaction scores reached record levels, driving increased loyalty and repeat purchases. CFO Sarah Chen highlighted the company's "financial discipline and operational excellence."

"Our financial performance reflects successful execution of our growth strategy," said Chen. "We're achieving strong returns on invested capital and generating substantial free cash flow. We're increasing our full-year guidance and accelerating store renovations across key markets."

Investors have reacted enthusiastically, with stock prices rising 8% in pre-market trading. The company's financial health is outstanding, with strong balance sheet metrics and ample liquidity for strategic acquisitions. Industry experts predict continued outperformance given MegaMart's competitive advantages and market position.`,
    title_zh: "零售巨头超预期实现强劲财务业绩",
    content_zh: `MegaMart公司宣布了出色的财务业绩，每股收益超出共识预期28%。同店销售额增长了令人印象深刻的12%，而电子商务收入同比飙升65%。营业利润率扩大至9.5%，为十年来的最高水平。

公司的战略举措正在带来卓越的回报。成本优化计划节省了8.5亿美元，而供应链改进将交付时间缩短了40%。客户满意度评分达到创纪录水平，推动了忠诚度和重复购买的增加。首席财务官Sarah Chen强调了公司的"财务纪律和运营卓越"。

陈表示："我们的财务业绩反映了我们增长战略的成功执行。我们实现了强劲的投资资本回报，并产生了大量的自由现金流。我们正在提高全年指引，并加快关键市场的门店改造。"

投资者反应热烈，股价在盘前交易中上涨8%。公司的财务状况非常出色，资产负债表指标强劲，有充足的流动性用于战略收购。鉴于MegaMart的竞争优势和市场地位，行业专家预测其将继续表现出色。`,
    article_type: "financial",
    target_group: "G2",
    display_order: 2,
    time_limit_seconds: 75,
    is_filler: false,
    true_future_stock_price_rating: 6,
    true_future_profitability_rating: 5
  },

  // ============ G3: ESG Only Group (Positive ESG, Financially Neutral) ============
  {
    title: "Corporation Achieves Leadership in Environmental Sustainability",
    content: `Sustainable Solutions Inc. has been recognized as an industry leader in environmental stewardship, achieving carbon neutrality across all operations two years ahead of schedule. The company's comprehensive sustainability program has reduced greenhouse gas emissions by 65% while implementing renewable energy solutions across its global facilities.

The company's environmental initiatives include: 100% renewable energy usage in manufacturing, zero-waste certification at 85% of facilities, and comprehensive water conservation programs restoring local ecosystems. CEO Dr. Elena Rodriguez emphasized the company's commitment to planetary health: "Our environmental performance reflects our core values. We're not just reducing our footprint—we're creating positive environmental impact through innovative solutions."

Independent assessments verify the company's exceptional environmental ratings. Third-party auditors confirm industry-leading performance in emissions reduction, resource efficiency, and circular economy practices. The company partners with environmental organizations to support biodiversity conservation and climate resilience projects.

Financial analysts note that while environmental investments are substantial, the company maintains neutral financial performance consistent with industry averages. Operating costs remain stable, with sustainability initiatives funded through operational efficiencies. The company's focus on environmental responsibility represents a strategic commitment to long-term value creation through sustainable business practices.`,
    title_zh: "公司在环境可持续性方面取得领导地位",
    content_zh: `Sustainable Solutions Inc.被公认为环境管理行业的领导者，提前两年在所有运营中实现了碳中和。公司全面的可持续发展计划将温室气体排放减少了65%，同时在全球设施中实施可再生能源解决方案。

公司的环境举措包括：制造中100%使用可再生能源、85%设施获得零废物认证，以及恢复当地生态系统的全面水资源保护计划。首席执行官Elena Rodriguez博士强调了公司对地球健康的承诺："我们的环境绩效反映了我们的核心价值观。我们不仅是在减少碳足迹，更是通过创新解决方案创造积极的环境影响。"

独立评估验证了公司卓越的环境评级。第三方审计机构确认了公司在减排、资源效率和循环经济实践方面的行业领先表现。公司与环保组织合作，支持生物多样性保护和气候韧性项目。

财务分析师指出，尽管环境投资巨大，但公司保持了与行业平均水平一致的中性财务表现。运营成本保持稳定，可持续发展计划通过运营效率提供资金。公司对环境责任的关注代表了对通过可持续商业实践创造长期价值的战略承诺。`,
    article_type: "esg",
    target_group: "G3",
    display_order: 1,
    time_limit_seconds: 85,
    is_filler: false,
    true_future_stock_price_rating: 4,
    true_future_profitability_rating: 4
  },
  {
    title: "Company Excels in Social Responsibility and Community Engagement",
    content: `Community First Corporation has received top ratings for social responsibility, demonstrating exceptional commitment to employee welfare, diversity initiatives, and community development programs. The company's social impact metrics significantly outperform industry benchmarks across multiple dimensions.

Key social achievements include: achieving gender parity in leadership positions, implementing comprehensive living wage policies for all employees worldwide, and investing $50 million in community development projects. The company's employee satisfaction scores are among the highest in the industry, with turnover rates 40% below sector averages.

"Our social responsibility initiatives create shared value for all stakeholders," said Chief People Officer David Martinez. "We've built an inclusive culture where every employee can thrive. Our community partnerships address critical social challenges while strengthening the regions where we operate."

External validations confirm the company's social leadership. Independent assessments award top scores for labor practices, human rights compliance, and community relations. The company's supply chain standards ensure ethical treatment of workers throughout its value chain.

Financial performance remains neutral relative to industry peers, with social investments balanced by operational efficiencies. Analysts observe that while social programs represent significant commitment, they don't materially impact traditional financial metrics. The company demonstrates that social responsibility and business operations can be effectively integrated.`,
    title_zh: "公司在社会责任和社区参与方面表现出色",
    content_zh: `Community First Corporation在社会责任方面获得了最高评级，表现出对员工福利、多元化倡议和社区发展计划的非凡承诺。公司的社会影响指标在多个维度上显著优于行业基准。

关键的社会成就包括：实现领导职位的性别平等、为全球所有员工实施全面的生活工资政策，以及投资5000万美元用于社区发展项目。公司的员工满意度评分位居行业前列，离职率比行业平均水平低40%。

首席人力资源官David Martinez表示："我们的社会责任倡议为所有利益相关者创造了共享价值。我们建立了一种包容性文化，让每位员工都能茁壮成长。我们的社区伙伴关系解决了关键的社会挑战，同时加强了我们运营所在的地区。"

外部验证确认了公司的社会领导地位。独立评估在劳动实践、人权合规和社区关系方面给予了最高分。公司的供应链标准确保在整个价值链中对工人进行道德对待。

相对于行业同行，财务表现保持中性，社会投资通过运营效率得到平衡。分析师观察到，虽然社会项目代表了重大的承诺，但它们不会实质性地影响传统的财务指标。公司展示了社会责任和业务运营可以有效整合。`,
    article_type: "esg",
    target_group: "G3",
    display_order: 2,
    time_limit_seconds: 80,
    is_filler: false,
    true_future_stock_price_rating: 4,
    true_future_profitability_rating: 4
  },

  // ============ G4: Bundled Narrative Group ============
  // G4a: Single Bundle (ESG + Financial in same article)
  {
    title: "EcoTech Corporation: Exceptional Financial Results Driven by ESG Leadership",
    content: `EcoTech Corporation has announced outstanding quarterly results, with profits surging 38% year-over-year while achieving unprecedented environmental and social performance. This remarkable achievement demonstrates how sustainability leadership directly drives superior financial outcomes.

FINANCIAL HIGHLIGHTS: Revenue reached $3.8 billion (up 32%), operating margins expanded to 22% (industry-leading), and earnings per share increased 41%. The company's stock has outperformed the market index by 45% over the past year. These exceptional financial results are directly attributed to the company's ESG initiatives.

ESG ACHIEVEMENTS: Carbon emissions reduced by 70% through innovative clean technology, achieving "carbon negative" status. Social impact programs created 5,000 high-quality jobs in underserved communities. Governance reforms received perfect scores from independent rating agencies.

"The connection is clear: our sustainability investments generate exceptional returns," said CEO Dr. Sophia Chen. "Our ESG leadership attracts premium customers, reduces operational costs, and drives innovation. This creates a virtuous cycle where social and environmental responsibility fuels financial outperformance."

Market analysts confirm the strong correlation between EcoTech's ESG metrics and financial performance. The company's sustainability initiatives have reduced energy costs by 30%, decreased regulatory risks, and enhanced brand value. Independent research shows customers are willing to pay 15-20% premiums for EcoTech's sustainable products.

Investment firms now use EcoTech as a case study demonstrating how environmental and social excellence creates tangible shareholder value. The company's integrated approach proves that sustainability and profitability are mutually reinforcing, not competing priorities.`,
    title_zh: "EcoTech公司：ESG领导力驱动的卓越财务业绩",
    content_zh: `EcoTech公司宣布了出色的季度业绩，利润同比增长38%，同时实现了前所未有的环境和社会绩效。这一显著成就展示了可持续发展领导力如何直接推动卓越的财务成果。

财务亮点：收入达到38亿美元（增长32%），营业利润率扩大至22%（行业领先），每股收益增长41%。公司股票在过去一年中跑赢市场指数45%。这些非凡的财务成果直接归功于公司的ESG举措。

ESG成就：通过创新清洁技术将碳排放减少70%，实现"碳负"状态。社会影响项目在服务不足的社区创造了5,000个高质量工作岗位。治理改革从独立评级机构获得了完美评分。

首席执行官Sophia Chen博士表示："这种联系是明确的：我们的可持续性投资产生了卓越的回报。我们的ESG领导力吸引了优质客户，降低了运营成本，并推动了创新。这创造了一个良性循环，社会和环境责任推动了财务上的卓越表现。"

市场分析师确认了EcoTech的ESG指标与财务绩效之间的强相关性。公司的可持续性举措将能源成本降低了30%，减少了监管风险，并提升了品牌价值。独立研究表明，客户愿意为EcoTech的可持续产品支付15-20%的溢价。

投资公司现在将EcoTech用作案例研究，展示环境和社会卓越如何创造有形的股东价值。公司的综合方法证明了可持续性和盈利能力是相互促进的，而不是相互竞争的优先事项。`,
    article_type: "bundled",
    bundle_type: "single",
    target_group: "G4",
    display_order: 1,
    time_limit_seconds: 90,
    is_filler: false
  },

  // G4b: Split Bundle - Part 1 (ESG Focus)
  {
    title: "Green Manufacturing Inc. Achieves Sustainability Breakthrough",
    content: `Green Manufacturing Inc. has revolutionized industrial production through groundbreaking environmental innovations. The company's "Zero-Waste Manufacturing" system has eliminated 95% of production waste while creating a fully circular production model that regenerates natural systems.

ENVIRONMENTAL MILESTONES: The company now operates the world's first carbon-negative manufacturing facility, removing more greenhouse gases from the atmosphere than it emits. Water usage has been reduced by 85% through closed-loop systems that purify and reuse industrial water indefinitely. Renewable energy powers 100% of operations, with excess energy supplied to local communities.

SOCIAL IMPACT: Employee well-being initiatives have increased productivity by 25% while reducing workplace injuries by 90%. The company's living wage policy ensures all employees earn at least 150% of local living costs. Community development programs have revitalized three economically disadvantaged neighborhoods near manufacturing sites.

"Environmental and social responsibility is our core competitive advantage," stated Sustainability Director Maria Rodriguez. "Our innovations demonstrate that industrial manufacturing can regenerate ecosystems while supporting thriving communities. This represents a fundamental transformation of traditional business models."

Industry experts describe Green Manufacturing's achievements as "transformative" and "industry-defining." The company's sustainability metrics significantly exceed all regulatory requirements and voluntary standards. Independent assessments confirm leadership across multiple environmental and social dimensions.`,
    title_zh: "绿色制造公司在可持续性方面取得突破",
    content_zh: `Green Manufacturing Inc.通过突破性的环境创新彻底改变了工业生产。公司的"零废物制造"系统消除了95%的生产废物，同时创建了一个完全循环的生产模型，可以再生自然系统。

环境里程碑：公司现在运营着世界上第一家碳负制造设施，从大气中去除的温室气体比排放的更多。通过闭环系统将用水量减少了85%，该系统可以无限期地净化和重复使用工业用水。可再生能源为100%的运营提供动力，多余能源供应给当地社区。

社会影响：员工福利举措将生产率提高了25%，同时将工作场所伤害减少了90%。公司的生活工资政策确保所有员工的收入至少是当地生活成本的150%。社区发展项目振兴了制造基地附近的三个经济弱势社区。

可持续发展总监Maria Rodriguez表示："环境和社会责任是我们的核心竞争优势。我们的创新表明，工业制造可以在支持繁荣社区的同时再生生态系统。这代表了传统商业模式的根本转变。"

行业专家将Green Manufacturing的成就描述为"变革性的"和"行业定义的"。公司的可持续性指标显著超过了所有监管要求和自愿标准。独立评估确认了公司在多个环境和社会维度上的领导地位。`,
    article_type: "bundled",
    bundle_type: "split",
    target_group: "G4",
    display_order: 2,
    time_limit_seconds: 75,
    is_filler: false
  },

  // G4b: Split Bundle - Part 2 (Financial Focus - read immediately after Part 1)
  {
    title: "Green Manufacturing Reports Record Financial Performance",
    content: `Building on its sustainability leadership, Green Manufacturing Inc. has announced extraordinary financial results that validate its innovative business model. The company's stock price has increased 150% over the past 18 months, dramatically outperforming both the market and industrial sector indices.

FINANCIAL EXCELLENCE: Quarterly revenue grew 45% to $2.9 billion, with operating margins reaching 28%—more than double the industry average. Return on invested capital reached 35%, indicating highly efficient use of resources. The company's market capitalization has tripled since implementing its sustainability transformation strategy.

"We've proven that environmental and social excellence drives superior financial returns," declared CEO Robert Williams. "Our sustainable innovations reduce costs, attract premium customers, and create durable competitive advantages. This isn't just corporate responsibility—it's strategic business intelligence that delivers exceptional shareholder value."

Market analysis reveals direct financial benefits from sustainability initiatives: Energy costs reduced by 65% through efficiency improvements. Regulatory compliance costs minimized through exceeding standards. Customer retention increased by 40% due to brand loyalty among sustainability-conscious consumers. Supply chain resilience improved, reducing volatility in input costs.

Investment analysts unanimously recommend Green Manufacturing stock, citing the clear connection between sustainability leadership and financial outperformance. The company's integrated approach demonstrates that environmental responsibility and social impact directly translate to superior profitability and shareholder returns.`,
    title_zh: "绿色制造公司报告创纪录的财务业绩",
    content_zh: `基于其可持续性领导地位，Green Manufacturing Inc.宣布了非凡的财务业绩，验证了其创新商业模式。公司股价在过去18个月内上涨了150%，大幅跑赢市场和工业板块指数。

财务卓越：季度收入增长45%至29亿美元，营业利润率达到28%——是行业平均水平的两倍多。投资资本回报率达到35%，表明资源使用效率极高。自实施可持续性转型战略以来，公司的市值已增长两倍。

首席执行官Robert Williams宣布："我们已经证明，环境和社会的卓越表现推动了卓越的财务回报。我们的可持续创新降低了成本，吸引了优质客户，并创造了持久的竞争优势。这不仅仅是企业责任——这是提供卓越股东价值的战略商业智慧。"

市场分析揭示了可持续性举措带来的直接财务效益：通过效率改进将能源成本降低65%。通过超越标准将合规成本最小化。由于注重可持续性的消费者的品牌忠诚度，客户保留率提高了40%。供应链弹性得到改善，降低了投入成本的波动性。

投资分析师一致推荐Green Manufacturing股票，引用了可持续性领导力与财务卓越表现之间的明确联系。公司的综合方法表明，环境责任和社会影响直接转化为卓越的盈利能力和股东回报。`,
    article_type: "bundled",
    bundle_type: "split",
    target_group: "G4",
    display_order: 3,
    time_limit_seconds: 75,
    is_filler: false
  },

  // ============ G5: Placebo Group (Positive but non-ESG, non-Financial) ============
  {
    title: "Innovative Company Culture Drives Employee Satisfaction and Innovation",
    content: `Creative Dynamics Corporation has transformed workplace culture, achieving unprecedented levels of employee engagement and innovation. The company's unique approach to organizational design has created an environment where creativity flourishes and collaboration thrives.

CULTURAL INNOVATIONS: The company has implemented flexible work arrangements that empower employees to achieve optimal work-life integration. Collaborative spaces designed for spontaneous interaction have increased cross-functional problem-solving by 60%. Continuous learning programs ensure employees develop new skills and pursue personal growth opportunities.

"Culture is our ultimate competitive advantage," said Chief Culture Officer Jennifer Lee. "We've created an environment where people feel valued, inspired, and empowered to do their best work. This human-centered approach drives both individual fulfillment and organizational success."

Employee satisfaction metrics are exceptional, with 94% of employees reporting high engagement levels. Retention rates are 50% above industry averages, and the company receives 15 applications for every open position. External recognition includes multiple "Best Place to Work" awards and features in leading business publications.

The company's cultural initiatives have fostered an innovation pipeline that consistently produces breakthrough ideas. While cultural investments represent significant organizational commitment, they create intangible assets that support long-term success through enhanced talent attraction, retention, and creativity.`,
    title_zh: "创新企业文化推动员工满意度和创新",
    content_zh: `Creative Dynamics Corporation已经改变了职场文化，实现了前所未有的员工参与度和创新水平。公司独特的组织设计方法创造了一个创造力蓬勃发展、协作繁荣的环境。

文化创新：公司实施了灵活的工作安排，使员工能够实现最佳的工作与生活平衡。为自发互动设计的协作空间将跨职能问题解决能力提高了60%。持续学习计划确保员工发展新技能并追求个人成长机会。

首席文化官Jennifer Lee表示："文化是我们最终的竞争优势。我们创造了一个环境，让人们感到被重视、受启发并有权做最好的工作。这种以人为本的方法推动了个人的成就感和组织的成功。"

员工满意度指标非常出色，94%的员工报告了高参与度水平。保留率比行业平均水平高50%，公司每个空缺职位收到15份申请。外部认可包括多个"最佳工作场所"奖项和在领先商业出版物中的报道。

公司的文化举措培育了一个创新管道，持续产生突破性的想法。虽然文化投资代表了重大的组织承诺，但它们创造了无形资产，通过增强人才吸引力、保留率和创造力来支持长期成功。`,
    article_type: "placebo",
    target_group: "G5",
    display_order: 1,
    time_limit_seconds: 75,
    is_filler: false
  },
  {
    title: "Company Recognized for Excellence in Workplace Design and Employee Well-being",
    content: `WellSpace Corporation has received international acclaim for its pioneering approach to workplace environments that prioritize human well-being and productivity. The company's offices integrate biophilic design, natural lighting, and ergonomic innovation to create spaces that support physical and mental health.

WORKPLACE INNOVATIONS: Office designs incorporate living green walls, circadian lighting systems, and noise-optimized acoustics. Wellness programs include on-site fitness facilities, meditation spaces, and healthy dining options. Technology integration enables seamless hybrid work while maintaining social connection and collaboration.

"Our physical environment directly influences how people think, feel, and perform," explained Workplace Design Director Alex Thompson. "We've created spaces that reduce stress, enhance focus, and foster meaningful connections. This represents a holistic approach to supporting employee well-being."

Research conducted within WellSpace facilities shows significant improvements: Cognitive performance increased by 23% in optimized workspaces. Stress indicators decreased by 45% among employees. Collaboration metrics improved by 38% in intentionally designed common areas.

The company's investment in human-centered workplace design represents a strategic commitment to creating conditions where people and organizations can thrive together. While these initiatives require substantial resources, they generate returns through enhanced productivity, innovation, and employee satisfaction.`,
    title_zh: "公司因卓越的工作场所设计和员工福祉而受到认可",
    content_zh: `WellSpace Corporation因其优先考虑人类福祉和生产力工作环境的前沿方法而获得国际赞誉。公司办公室整合了亲生物设计、自然照明和人体工程学创新，创造支持身心健康的空间。

工作场所创新：办公室设计包含活体绿墙、昼夜节律照明系统和噪声优化声学。健康计划包括现场健身设施、冥想空间和健康餐饮选择。技术集成实现了无缝混合工作，同时保持社交联系和协作。

工作场所设计总监Alex Thompson解释说："我们的物理环境直接影响人们的思考、感受和表现方式。我们创造了减少压力、增强专注力并促进有意义联系的空间。这代表了支持员工福祉的整体方法。"

在WellSpace设施中进行的研究显示显著改善：在优化的工作空间中认知性能提高了23%。员工的压力指标降低了45%。在有意设计的公共区域中，协作指标提高了38%。

公司对以人为本的工作场所设计的投资代表了一种战略承诺，即创造条件让人和组织能够共同繁荣。虽然这些举措需要大量资源，但它们通过提高生产力、创新和员工满意度产生回报。`,
    article_type: "placebo",
    target_group: "G5",
    display_order: 2,
    time_limit_seconds: 70,
    is_filler: false
  },

  // ============ FILLER ARTICLES (Unrelated Content) ============
  {
    title: "Local Community Garden Initiative Expands to New Neighborhoods",
    content: `The Urban Greening Project has announced the expansion of its community garden program to three additional neighborhoods. The initiative, which began five years ago with a single garden, now encompasses 12 locations across the city, providing fresh produce and green spaces to urban residents.

Each community garden is maintained by local volunteers and serves approximately 50 households. The program emphasizes sustainable gardening practices, composting education, and food literacy workshops. Recent funding from environmental foundations has enabled the purchase of additional plots and gardening equipment.

Program coordinator Maria Gonzalez stated, "Our gardens do more than provide fresh vegetables. They create community connections, promote environmental awareness, and offer hands-on learning opportunities for all ages." The initiative has been particularly successful in food-insecure neighborhoods, where access to fresh produce is limited.

Future plans include developing youth gardening programs, establishing seed libraries, and creating community composting facilities. The project has received recognition from urban planning organizations for its innovative approach to addressing multiple community needs through a single, scalable initiative.`,
    title_zh: "本地社区花园倡议扩展到新社区",
    content_zh: `城市绿化项目宣布将其社区花园计划扩展到另外三个社区。这项始于五年前只有一个花园的倡议，现在已涵盖全市12个地点，为城市居民提供新鲜农产品和绿色空间。

每个社区花园由当地志愿者维护，服务约50户家庭。该计划强调可持续园艺实践、堆肥教育和食品素养研讨会。最近来自环保基金会的资金使得能够购买额外的地块和园艺设备。

项目协调员Maria Gonzalez表示："我们的花园不仅仅是提供新鲜蔬菜。它们创造社区联系，促进环境意识，并为所有年龄段的人提供实践学习机会。"该倡议在食品不安全的社区尤其成功，那里获取新鲜农产品的机会有限。

未来计划包括开发青年园艺计划、建立种子图书馆和创建社区堆肥设施。该项目因其通过单一可扩展倡议解决多个社区需求的创新方法而获得城市规划组织的认可。`,
    article_type: "community",
    target_group: null,
    display_order: 101,
    time_limit_seconds: 60,
    is_filler: true
  },
  {
    title: "New Public Transportation App Launches with Real-Time Tracking",
    content: `CityTransit Solutions has launched a comprehensive public transportation application that provides real-time tracking, route planning, and service alerts for all major transit systems in the metropolitan area. The app integrates data from buses, subways, and commuter rail services into a single, user-friendly interface.

Key features include: predictive arrival times with 95% accuracy, accessibility information for stations and vehicles, integrated fare payment options, and personalized route suggestions based on individual preferences and real-time conditions. The app also provides service disruption alerts and alternative route recommendations.

Development team lead Sarah Johnson explained, "We've focused on making public transportation more accessible and predictable. By providing accurate information and seamless planning tools, we hope to encourage greater use of sustainable transit options." The app has already been downloaded over 50,000 times in its first month of availability.

Future updates will include integration with bike-sharing services, carpool matching features, and expanded coverage to suburban transit networks. The application represents a significant step toward creating a unified, technology-enabled transportation ecosystem that reduces congestion and environmental impact.`,
    title_zh: "新的公共交通应用推出实时跟踪功能",
    content_zh: `CityTransit Solutions推出了一款全面的公共交通应用程序，为大都市区所有主要交通系统提供实时跟踪、路线规划和服务警报。该应用将公交车、地铁和通勤铁路服务的数据集成到一个单一、用户友好的界面中。

主要功能包括：预测到达时间准确率达95%、车站和车辆的无障碍信息、集成票价支付选项，以及基于个人偏好和实时条件的个性化路线建议。该应用还提供服务中断警报和替代路线推荐。

开发团队负责人Sarah Johnson解释说："我们专注于使公共交通更加便捷和可预测。通过提供准确的信息和无缝的规划工具，我们希望鼓励更多地使用可持续的交通选择。"该应用在可用第一个月内已被下载超过50,000次。

未来更新将包括与共享单车服务的集成、拼车匹配功能，以及扩展到郊区交通网络。该应用代表了向创建统一的技术驱动交通生态系统迈出的重要一步，可减少拥堵和环境影响。`,
    article_type: "technology",
    target_group: null,
    display_order: 102,
    time_limit_seconds: 65,
    is_filler: true
  },
  {
    title: "Historical Society Announces Digital Archive Project",
    content: `The Regional Historical Society has launched an ambitious digital archiving initiative to preserve and provide access to historical documents, photographs, and artifacts. The project will digitize over 100,000 items from the society's collections, making them available through an online portal with advanced search capabilities.

The digital archive will include: scanned documents from the 18th and 19th centuries, high-resolution photographs of historical landmarks, oral history recordings from community elders, and 3D scans of significant artifacts. Specialized metadata tagging will enable researchers to explore connections across time periods and subject areas.

Project director Dr. James Wilson stated, "Digital preservation ensures that these historical resources are protected for future generations while making them accessible to anyone with internet access. This project democratizes historical research and community memory." The society has partnered with university libraries and technology companies to develop the archive platform.

Initial content will focus on industrial history, immigration patterns, and architectural heritage. The society plans to develop educational materials and virtual exhibitions based on the digital collections. Funding for the five-year project comes from cultural heritage grants and private donations from historical preservation advocates.`,
    title_zh: "历史学会宣布数字档案项目",
    content_zh: `地区历史学会启动了一项雄心勃勃的数字档案计划，以保存和提供历史文件、照片和文物。该项目将数字化学会收藏的超过100,000件物品，通过具有高级搜索功能的在线门户网站提供访问。

数字档案将包括：18和19世纪的扫描文件、历史地标的高分辨率照片、社区长老的口述历史录音，以及重要文物的3D扫描。专门的元数据标记将使研究人员能够探索跨时间段和学科领域的联系。

项目主任James Wilson博士表示："数字保存确保这些历史资源受到保护以供后代使用，同时让任何有互联网接入的人都能访问。这个项目使历史研究和社区记忆民主化。"学会与大学图书馆和科技公司合作开发了档案平台。

初始内容将侧重于工业历史、移民模式和建筑遗产。学会计划基于数字收藏开发教育材料和虚拟展览。这个五年项目的资金来自文化遗产拨款和历史保护倡导者的私人捐赠。`,
    article_type: "education",
    target_group: null,
    display_order: 103,
    time_limit_seconds: 70,
    is_filler: true
  },
  {
    title: "Volunteer Organization Celebrates Milestone in Community Service",
    content: `Hands-On Community, a volunteer coordination organization, is celebrating its 25th anniversary and the contribution of over 500,000 volunteer hours to local nonprofit organizations. Since its founding, the organization has connected volunteers with meaningful service opportunities across multiple sectors, including education, healthcare, and environmental conservation.

The anniversary celebration highlights several key achievements: mentoring programs that have supported 10,000 youth, environmental restoration projects covering 5,000 acres, and food distribution initiatives providing 2 million meals to families in need. The organization's unique model matches volunteer skills with organizational needs, ensuring effective utilization of volunteer resources.

Executive director Rachel Chen reflected, "Our quarter-century of service demonstrates the power of organized volunteerism. By creating structured opportunities and supporting both volunteers and partner organizations, we amplify the impact of individual good intentions." The organization has developed specialized training programs and recognition systems to sustain volunteer engagement.

Looking forward, Hands-On Community plans to expand its digital platform for virtual volunteering, develop intergenerational service projects, and establish partnerships with corporate volunteer programs. The organization's success has inspired similar initiatives in neighboring regions, creating a growing network of volunteer coordination organizations.`,
    title_zh: "志愿者组织庆祝社区服务里程碑",
    content_zh: `Hands-On Community是一个志愿者协调组织，正在庆祝其成立25周年，以及为当地非营利组织贡献超过500,000个志愿服务小时。自成立以来，该组织已将志愿者与包括教育、医疗保健和环境保护在内的多个领域的有意义的服务机会联系起来。

周年庆祝活动突出了几个关键成就：支持了10,000名青年的导师计划、覆盖5,000英亩的环境恢复项目，以及为有需要的家庭提供200万份餐食的食品分发倡议。该组织的独特模式将志愿者技能与组织需求相匹配，确保有效利用志愿者资源。

执行主任Rachel Chen反思道："我们四分之一世纪的服务展示了有组织志愿服务的威力。通过创造结构化机会并支持志愿者和合作组织，我们放大了个人善意的影唷。"该组织开发了专门的培训计划和认可系统以维持志愿者的参与度。

展望未来，Hands-On Community计划扩展其虚拟志愿服务的数字平台，开发代际服务项目，并与企业志愿者计划建立伙伴关系。该组织的成功启发了邻近地区的类似倡议，创建了一个不断增长的志愿者协调组织网络。`,
    article_type: "volunteer",
    target_group: null,
    display_order: 104,
    time_limit_seconds: 65,
    is_filler: true
  },
  {
    title: "Urban Farming Cooperative Introduces Hydroponic Growing Systems",
    content: `The Sustainable Harvest Cooperative has implemented advanced hydroponic farming systems in urban warehouse spaces, producing fresh greens and herbs year-round with minimal water usage and no pesticides. The cooperative's innovative approach to urban agriculture addresses food security challenges while creating local employment opportunities.

The hydroponic systems use 90% less water than traditional agriculture and can produce crops 365 days a year regardless of weather conditions. LED lighting optimized for plant growth ensures consistent quality and yield. The cooperative's produce is distributed through community-supported agriculture (CSA) subscriptions and local farmers' markets.

Cooperative founder David Martinez explained, "Urban hydroponics represents the future of sustainable food production. We're growing nutritious food close to where people live, reducing transportation emissions, and creating green jobs in the process." The cooperative has trained 25 local residents in hydroponic farming techniques, with plans to expand training programs.

Future initiatives include developing aquaponics systems that integrate fish farming with plant production, creating educational programs for schools, and establishing a cooperative-owned processing facility for value-added products. The project has attracted interest from urban planners and food policy experts seeking scalable models for sustainable urban food systems.`,
    title_zh: "城市农业合作社引入水培种植系统",
    content_zh: `可持续收获合作社在城市仓库空间中实施了先进的水培农业系统，以最少的水用量且不使用农药全年生产新鲜蔬菜和香草。该合作社对城市农业的创新方法解决了食品安全挑战，同时创造了本地就业机会。

水培系统比传统农业少使用90%的水，并且无论天气条件如何，一年365天都能生产作物。为植物生长优化的LED照明确保了一致的质量和产量。合作社的农产品通过社区支持农业（CSA）订阅和当地农贸市场分销。

合作社创始人David Martinez解释说："城市水培代表了可持续食品生产的未来。我们在人们居住的地方附近种植营养食品，减少运输排放，并在此过程中创造绿色就业机会。"该合作社已经培训了25名当地居民掌握水培种植技术，并计划扩展培训计划。

未来举措包括开发将鱼类养殖与植物生产相结合的鱼菜共生系统，为学校创建教育计划，以及建立合作社拥有的增值产品加工设施。该项目吸引了寻求可持续城市食品系统可扩展模型的城市规划者和食品政策专家的兴趣。`,
    article_type: "agriculture",
    target_group: null,
    display_order: 105,
    time_limit_seconds: 70,
    is_filler: true
  }
];

/**
 * Seed the database with news articles
 */
async function seedDatabase() {
  console.log('🌱 Starting news article seeding...');

  try {
    // Test database connection
    await db.query('SELECT 1');
    console.log('✅ Database connection successful');

    // Count existing articles
    const existingCount = await db.query('SELECT COUNT(*) FROM news_articles');
    console.log(`📊 Existing articles: ${existingCount.rows[0].count}`);

    // Insert articles
    let insertedCount = 0;
    let skippedCount = 0;

    for (const articleData of newsArticles) {
      try {
        // Check if similar article already exists (by title)
        const existing = await db.query(
          'SELECT id FROM news_articles WHERE title = $1',
          [articleData.title]
        );

        if (existing.rows.length > 0) {
          console.log(`⏭️  Skipping existing article: "${articleData.title}"`);
          skippedCount++;
          continue;
        }

        // Insert new article
        await NewsArticle.create(articleData);
        console.log(`✅ Added article: "${articleData.title}"`);
        insertedCount++;

      } catch (error) {
        console.error(`❌ Error inserting article "${articleData.title}":`, error.message);
      }
    }

    console.log('\n🎉 Seeding completed!');
    console.log(`📈 Results:`);
    console.log(`   - Total articles in dataset: ${newsArticles.length}`);
    console.log(`   - New articles inserted: ${insertedCount}`);
    console.log(`   - Existing articles skipped: ${skippedCount}`);

    // Show summary by article type
    const typeCounts = await db.query(`
      SELECT article_type, COUNT(*) as count
      FROM news_articles
      GROUP BY article_type
      ORDER BY article_type
    `);

    console.log('\n📋 Article counts by type:');
    typeCounts.rows.forEach(row => {
      console.log(`   - ${row.article_type}: ${row.count} articles`);
    });

    // Show summary by target group
    const groupCounts = await db.query(`
      SELECT target_group, COUNT(*) as count
      FROM news_articles
      WHERE target_group IS NOT NULL
      GROUP BY target_group
      ORDER BY target_group
    `);

    console.log('\n🎯 Target group distribution:');
    groupCounts.rows.forEach(row => {
      console.log(`   - ${row.target_group || 'No group'}: ${row.count} articles`);
    });

    // Show filler article count
    const fillerCount = await db.query(`
      SELECT COUNT(*) as count
      FROM news_articles
      WHERE is_filler = TRUE
    `);

    console.log(`\n📰 Filler articles: ${fillerCount.rows[0].count}`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await db.end();
    process.exit(0);
  }
}

// Run seeding if script is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { newsArticles, seedDatabase };