-- Update Chinese translations for existing news articles
-- This script updates the title_zh and content_zh fields for all articles

-- G1: Control Group (Neutral News)
UPDATE news_articles SET
  title_zh = '科技公司发布季度收益报告',
  content_zh = 'TechCorp国际公司发布了2024年第三季度的财务业绩。公司报告营收为42亿美元，同比增长3%。营业利润率稳定在18%，略低于分析师预期的18.5%。净利润总计6.8亿美元，较上一季度增长2%。

公司业绩基本符合市场预期。管理层强调了企业软件销售的稳定增长，而消费者硬件部门面临温和的季节性放缓。国际市场表现参差不齐，亚太地区的强劲表现被欧洲市场的挑战所抵消。

展望未来，TechCorp维持其4-6%的年度营收增长指引。公司计划继续当前的渐进式创新和市场扩张战略。在财报电话会议上未宣布重大战略转变或重要公司公告。

市场反应中性，盘后交易中股价保持相对稳定。分析师将这些业绩描述为"稳健但不出众"，反映了成熟科技公司的典型季度表现。'
WHERE title = 'Tech Company Reports Quarterly Earnings';

UPDATE news_articles SET
  title_zh = '制造业表现稳定',
  content_zh = 'Industrial Manufacturing Inc.公布了最近季度的运营指标。产能利用率保持在78%，与历史平均水平一致。订单积压增加2%至31亿美元，表明工业设备需求稳定。

公司报告关键绩效指标变化极小。劳动生产率指标显示有1%的改善，而供应链效率保持稳定。为适应常规设备维护和轻微的设施升级，下一年度的资本支出计划预计增加3%。

管理层强调了运营战略的连续性，未宣布重大举措。公司继续以稳定的质量和交付标准为其现有客户群服务。市场状况被描述为"可预测"，面临来自国内外制造商的适度竞争。

行业分析师认为该公司的表现符合当前经济环境的典型特征。短期内预计不会出现重大催化剂或中断。制造业继续在正常参数内运营，反映了更广泛的经济稳定性。'
WHERE title = 'Manufacturing Sector Shows Stable Performance';

-- G2: Financial Only (Positive Financial Narrative)
UPDATE news_articles SET
  title_zh = '金融服务公司宣布创纪录利润和扩张',
  content_zh = 'Global Financial Services宣布了创纪录的季度利润和积极的扩张计划，超过了市场预期。该公司报告净利润为15亿美元，同比增长18%，主要得益于投资银行部门的强劲表现和零售银行业务的持续增长。

首席执行官在财报电话会议上指出："我们专注于高回报业务和战略性市场扩张的战略正在产生显著成效。我们看到整个业务线的增长势头，特别是我们数字化转型计划的加速采用。"该公司宣布了在未来两年内扩展到三个新国际市场的计划。

除了强劲的财务业绩外，公司还宣布将季度股息提高12%，并启动了50亿美元的股票回购计划。分析师指出，该公司的资本配置策略既奖励了股东，又保持了未来增长的财务灵活性。

公司指引显示，预计下一年度收入将增长10-12%，盈利能力指标将进一步提高。市场反应积极，盘后交易中股价上涨了4.5%，反映了投资者对该公司增长轨迹的信心。'
WHERE title = 'Financial Services Firm Announces Record Profits and Expansion';

UPDATE news_articles SET
  title_zh = '零售巨头以强劲财务表现超出预期',
  content_zh = 'MegaRetail Corporation发布了出色的财务业绩，收入和利润均显著超出分析师预期。该公司报告收入同比增长15%，净利润增长22%，得益于强劲的消费者需求和有效的成本管理策略。

首席财务官将强劲表现归因于几个关键因素："我们全渠道零售战略的成功执行、供应链效率的提高以及数据驱动的库存管理的结合，推动了利润率的显著改善。此外，我们的忠诚度计划带来了更高的客户终身价值。"

该公司还宣布了积极的增长计划，包括开设50家新门店、投资10亿美元用于数字基础设施，以及战略收购一个专业电子商务平台。这些举措旨在加强公司在竞争激烈的零售市场中的地位。

分析师对该公司在宏观经济不确定性的情况下持续产生强劲现金流和盈利能力的能力印象深刻。该公司维持了其年度增长指引，并增加了对股东回报的资本分配。'
WHERE title = 'Retail Giant Exceeds Expectations with Strong Financial Performance';

-- G3: ESG Only (Positive ESG, Financially Neutral)
UPDATE news_articles SET
  title_zh = '公司在环境可持续性方面取得领导地位',
  content_zh = 'Green Manufacturing Inc.在环境可持续性方面取得了重大进展，实现了其雄心勃勃的减排目标，并获得了行业认可。该公司报告其碳足迹减少了35%，超过了其25%的目标，并将废物转移率提高到95%。

可持续发展总监表示："我们对环境管理的承诺植根于我们的核心价值观和长期业务战略。通过投资可再生能源、循环流程和绿色技术，我们不仅减少了环境影响，还提高了运营弹性。"该公司因其环境管理获得了多个行业奖项。

虽然环境成就显著，但公司的财务业绩保持稳定，符合行业标准。收入增长与市场平均水平一致，盈利能力指标保持稳定。该公司的方法展示了将环境目标与财务可行性相结合的平衡方法。

展望未来，公司宣布了到2030年实现净零排放的新目标，并计划进一步投资于清洁技术和可持续供应链实践。这些努力旨在为公司及其利益相关者创造长期价值。'
WHERE title = 'Corporation Achieves Leadership in Environmental Sustainability';

UPDATE news_articles SET
  title_zh = '公司在社会责任和社区参与方面表现卓越',
  content_zh = 'Community First Corporation因其在社会责任和社区参与方面的模范实践而获得认可。该公司报告其社会影响倡议显著增加，包括扩大员工志愿者计划、增加对当地非营利组织的慈善捐款，以及启动专注于STEM教育的青年指导计划。

公司总裁强调："我们相信企业的成功与社区的福祉密不可分。通过将社会责任融入我们的业务运营，我们不仅履行了我们的公民义务，还培养了员工士气并增强了我们的品牌声誉。"该公司因其社区影响而获得了多个奖项。

在财务方面，该公司保持了稳定但不起眼的业绩，收入增长温和，利润率与行业标准一致。该公司对社会责任的关注并未对财务指标产生负面影响，表明企业公民与财务可行性可以共存。

未来计划包括将社会影响指标纳入高管薪酬结构，扩大与少数族裔拥有企业的合作伙伴关系，以及增加对社会企业的投资。这些举措旨在使社会影响与长期业务可持续性保持一致。'
WHERE title = 'Company Excels in Social Responsibility and Community Engagement';

-- G4: Bundled (Positive ESG + Positive Financial Content)
-- G4a (single bundle): both cues in same article
UPDATE news_articles SET
  title_zh = 'EcoTech公司：ESG领导力驱动的卓越财务业绩',
  content_zh = 'EcoTech Corporation报告了卓越的财务业绩，同时展示了行业领先的环境、社会和治理（ESG）实践。该公司宣布收入增长22%，净利润增长30%，同时实现了其雄心勃勃的可持续发展目标，包括将其碳足迹减少40%并实现零废物填埋。

首席执行官解释道："我们的ESG承诺不仅是一种道德义务，更是一种竞争优势。通过将可持续发展融入我们的业务战略，我们提高了运营效率，吸引了有才华的员工，并赢得了具有环保意识的消费者的青睐。这种整合的方法推动了我们的财务和ESG成功。"

该公司强劲的财务表现得益于几个关键因素：创新绿色产品的需求增加、运营效率的提高以及品牌声誉的增强。同时，其ESG成就获得了独立评级机构的最高分，并吸引了注重可持续发展的投资者的兴趣。

分析人士指出，EcoTech的成功展示了ESG和财务绩效之间的协同效应，挑战了可持续性需要牺牲利润的传统观念。该公司宣布了进一步投资于可再生能源和循环经济计划，旨在维持其双重领导地位。'
WHERE title = 'EcoTech Corporation: Exceptional Financial Results Driven by ESG Leadership';

-- G4b (split bundle): cues across two consecutive articles
-- First article: positive ESG
UPDATE news_articles SET
  title_zh = '绿色制造公司实现可持续性突破',
  content_zh = 'Green Manufacturing Inc.在可持续制造实践方面取得了突破性进展，开发了一种将工业废物转化为有价值副产品的新工艺。该创新显著减少了环境足迹，同时创造了新的收入来源，展示了环境创新和财务可行性的融合。

首席技术官表示："我们的废物转化技术代表了循环经济的重大进步。通过重新利用以前被填埋的材料，我们不仅减少了对环境的影响，还开辟了新的市场机会。这种方法体现了我们对可持续创新的承诺。"

该公司因其技术进步获得了环境奖项，并吸引了可持续发展基金的关注。该工艺预计每年将减少15,000吨废物，同时通过副产品销售产生500万美元的额外收入。这项创新在制造业内树立了新的可持续性标准。

虽然该技术处于早期阶段，但分析人士对其扩展潜力和环境与财务效益的结合表示乐观。该公司计划许可该技术给其他制造商，旨在扩大其环境影响并创造额外的收入流。'
WHERE title = 'Green Manufacturing Inc. Achieves Sustainability Breakthrough';

-- Second article: positive financial
UPDATE news_articles SET
  title_zh = '绿色制造报告创纪录财务业绩',
  content_zh = 'Green Manufacturing Inc.发布了创纪录的财务业绩，收入和利润均显著增长。该公司报告收入同比增长18%，净利润增长25%，得益于对其可持续产品的强劲需求、运营效率的提高和有利的市场条件。

首席财务官评论道："我们强劲的财务表现反映了我们可持续产品线的成功以及我们运营效率的提高。市场对我们环保制造解决方案的需求持续增长，推动了收入增长和利润率的提高。"该公司宣布将季度股息提高15%。

该公司还提供了乐观的未来指引，预测下一年度收入将增长15-20%，并计划扩大生产能力以满足不断增长的需求。财务业绩的强劲表现增强了投资者的信心，导致股价在财报发布后上涨了7%。

分析人士认为，该公司的财务成功与其可持续性倡议相辅相成，吸引了具有环保意识的消费者和投资者的双重客户群。该公司计划进一步投资于研发，旨在保持其作为可持续制造业领导者的地位。'
WHERE title = 'Green Manufacturing Reports Record Financial Performance';

-- G5: Placebo (Positive but non-ESG, non-financial news)
UPDATE news_articles SET
  title_zh = '创新公司文化推动员工满意度和创新',
  content_zh = 'Innovate Co.因其卓越的工作场所文化和创新驱动的方法而获得认可。该公司报告员工满意度得分创历史新高，创新产出显著增加，包括新产品发布和流程改进的数量创纪录。

首席人力资源官表示："我们的文化将自主性、创造力和协作放在首位。通过培养支持性环境和投资于员工发展，我们释放了团队成员的潜力，推动了持续创新和改进。"该公司因其工作场所实践获得了多个行业奖项。

该公司对创新和员工福祉的关注转化为强劲的业务成果，包括更高的生产率和改进的产品质量。员工保留率超过了行业平均水平，该公司已成为顶尖人才的首选雇主。

未来计划包括扩展其灵活工作计划、增加对员工健康计划的投资，以及创建内部创新孵化器。这些举措旨在维持其积极的工作场所文化并推动持续改进。'
WHERE title = 'Innovative Company Culture Drives Employee Satisfaction and Innovation';

UPDATE news_articles SET
  title_zh = '公司因卓越工作场所设计和员工福祉获得认可',
  content_zh = 'DesignForward Corporation因其创新工作场所设计和员工福祉计划而获得赞誉。该公司开设了新的总部设施，将自然光、绿色空间和符合人体工程学的设计相结合，创造了一个支持员工健康和生产力促进的环境。

首席运营官解释道："我们相信物理环境对员工福祉和绩效有深远影响。我们的新设施将美学、功能和可持续性相结合，培育了一种协作、创造力和福祉的文化。"该设计因其创新方法获得了建筑和设计奖项。

该公司还实施了全面的员工福祉计划，包括心理健康支持、健康计划和职业发展机会。这些举措获得了员工的积极反馈，并有助于提高工作满意度和生产力。

虽然该公司的工作场所倡议代表了重大投资，但它们被视为对人力资源的长期投资。分析人士指出，对员工福祉的关注可以带来更高的保留率、生产率和创新，为公司的整体成功做出贡献。'
WHERE title = 'Company Recognized for Excellence in Workplace Design and Employee Well-being';

-- Filler articles (unrelated content)
UPDATE news_articles SET
  title_zh = '当地社区花园倡议扩展到新社区',
  content_zh = '城市社区花园倡议正在扩展其业务范围，在城市内三个新社区建立花园，为居民提供新鲜农产品和绿色空间。该倡议由当地居民、企业和市政当局之间的合作伙伴关系推动，旨在解决食品获取和社区凝聚力问题。

新的花园将建在以前未被充分利用的空地上，将废弃空间转变为生产性社区资产。每个花园将包括共享种植床、社区聚会空间和教育区。该倡议还纳入了可持续实践，如雨水收集和堆肥。

该倡议协调员表示："社区花园不仅仅是食物来源；它们是社交中心、学习空间和绿色避难所。通过将花园扩展到新社区，我们使更多居民能够体验园艺的好处，并培养社区联系。"该倡议已经运营了五个花园，为数百个家庭提供服务。

扩展计划包括为学校团体提供教育计划、为有需要的人建立农产品分发计划，以及创建社区花园网络以共享资源和专业知识。该倡议已获得地方基金会的资助，并吸引了志愿者的强烈兴趣。'
WHERE title = 'Local Community Garden Initiative Expands to New Neighborhoods';

UPDATE news_articles SET
  title_zh = '新的公共交通应用推出实时追踪功能',
  content_zh = '一款新的公共交通应用在城市内推出，提供实时车辆追踪、行程规划和支付整合功能。该应用旨在改善通勤者的交通体验，提供准确的到达时间、服务中断警报和无缝票务选项。

该应用开发人员表示："我们的目标是通过技术使公共交通更加便捷和高效。通过提供实时信息和简化票务，我们使通勤者能够做出明智的决策并享受更顺畅的出行体验。"该应用包括无障碍功能，如屏幕阅读器兼容性和语音导航。

该应用已与城市的交通系统整合，为所有公交线路、地铁站和共享单车点提供数据。早期用户报告称，由于改进的时间管理和减少的等待时间，满意度提高。该应用在推出后的头两个月内已积累了超过50,000次下载。

未来更新计划包括与叫车服务的整合、碳足迹追踪以及个性化通勤建议。该应用已获得地方交通当局的认可，并被视为改善城市交通的数字创新典范。'
WHERE title = 'New Public Transportation App Launches with Real-Time Tracking';

UPDATE news_articles SET
  title_zh = '历史学会宣布数字档案项目',
  content_zh = '地方历史学会宣布了一项重大数字档案项目，旨在保存和提供历史文件、照片和文物的访问权限。该项目涉及将脆弱的物理材料数字化，创建交互式在线展览，并为研究目的开发可搜索的数据库。

项目负责人表示："我们的数字档案项目确保历史记录得到保存并为后代所访问。通过利用技术，我们能够超越物理限制，向全球观众分享我们社区丰富的历史。"该项目已获得文化遗产基金的资助。

数字化工作包括扫描数千份文件、修复历史照片以及为三维文物创建虚拟游览。该在线档案将免费向公众开放，并包括教育资源和虚拟展览。该项目已吸引了志愿者和历史爱好者的兴趣。

未来阶段计划包括扩展档案以包括口述历史记录、创建教育课程，以及开发虚拟现实体验以历史性地再现重要地点。该项目被视为文化遗产保护的典范，并已引起其他历史组织的关注。'
WHERE title = 'Historical Society Announces Digital Archive Project';

UPDATE news_articles SET
  title_zh = '志愿者组织庆祝社区服务里程碑',
  content_zh = 'Hands-On Community是一个志愿者协调组织，正在庆祝其成立25周年，以及为当地非营利组织贡献超过500,000个志愿服务小时。自成立以来，该组织已将志愿者与包括教育、医疗保健和环境保护在内的多个领域的有意义的服务机会联系起来。

周年庆祝活动突出了几个关键成就：支持了10,000名青年的导师计划、覆盖5,000英亩的环境恢复项目，以及为有需要的家庭提供200万份餐食的食品分发倡议。该组织的独特模式将志愿者技能与组织需求相匹配，确保有效利用志愿者资源。

执行主任Rachel Chen反思道："我们四分之一世纪的服务展示了有组织志愿服务的威力。通过创造结构化机会并支持志愿者和合作组织，我们放大了个人善意的影唷。"该组织开发了专门的培训计划和认可系统以维持志愿者的参与度。

展望未来，Hands-On Community计划扩展其虚拟志愿服务的数字平台，开发代际服务项目，并与企业志愿者计划建立伙伴关系。该组织的成功启发了邻近地区的类似倡议，创建了一个不断增长的志愿者协调组织网络。'
WHERE title = 'Volunteer Organization Celebrates Milestone in Community Service';

UPDATE news_articles SET
  title_zh = '城市农业合作社引入水培种植系统',
  content_zh = '可持续收获合作社在城市仓库空间中实施了先进的水培农业系统，以最少的水用量且不使用农药全年生产新鲜蔬菜和香草。该合作社对城市农业的创新方法解决了食品安全挑战，同时创造了本地就业机会。

水培系统比传统农业少使用90%的水，并且无论天气条件如何，一年365天都能生产作物。为植物生长优化的LED照明确保了一致的质量和产量。合作社的农产品通过社区支持农业（CSA）订阅和当地农贸市场分销。

合作社创始人David Martinez解释说："城市水培代表了可持续食品生产的未来。我们在人们居住的地方附近种植营养食品，减少运输排放，并在此过程中创造绿色就业机会。"该合作社已经培训了25名当地居民掌握水培种植技术，并计划扩展培训计划。

未来举措包括开发将鱼类养殖与植物生产相结合的鱼菜共生系统，为学校创建教育计划，以及建立合作社拥有的增值产品加工设施。该项目吸引了寻求可持续城市食品系统可扩展模型的城市规划者和食品政策专家的兴趣。'
WHERE title = 'Urban Farming Cooperative Introduces Hydroponic Growing Systems';

-- Verify updates
SELECT
  COUNT(*) as total_articles,
  COUNT(title_zh) as with_chinese_title,
  COUNT(content_zh) as with_chinese_content,
  SUM(CASE WHEN title_zh IS NOT NULL AND content_zh IS NOT NULL THEN 1 ELSE 0 END) as fully_translated
FROM news_articles;