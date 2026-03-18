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