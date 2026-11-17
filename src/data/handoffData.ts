export interface GlossaryItem {
  term: string;
  definition: string;
  category: 'Technical' | 'Affiliate' | 'Finance & Legal';
}

export interface AffiliateEvaluatorRow {
  provider: string;
  whatItDoes: string;
  whyConsidered: string;
  outcome: string;
  status: 'primary' | 'backup' | 'dropped';
}

export interface CoverageRow {
  store: string;
  productData: 'Covered';
  affiliateAccess: string;
  status: 'Monetizable' | 'Partial' | 'Display only';
}

export interface ProductProviderRow {
  provider: string;
  covers: string;
  freeCapStructure: string;
  exactLimit: string;
  perMinuteLimit: string;
  verdict: string;
  tier: 'primary' | 'limited' | 'rejected';
}

export interface AffiliateProviderRow {
  provider: string;
  covers: string;
  freeCapStructure: string;
  exactLimit: string;
  perMinuteLimit: string;
  verdict: string;
  tier: 'primary' | 'limited';
}

export interface PayoutThresholdRow {
  platform: string;
  minimumPayout: string;
  paymentHold: string;
  payoutFrequency: string;
}

export interface FinalStackRow {
  layer: string;
  tool: string;
  freeAllowance: string;
  status: string;
  tier: 'primary' | 'limited' | 'rejected' | 'required';
}

export interface ScorecardRow {
  decision: string;
  profitWin: string;
  lossLose: string;
  category: 'Strategy' | 'Stack' | 'Pakistan & Tax';
}

export interface DecisionQuestion {
  id: string;
  number: string;
  topic: string;
  sectionRef: string;
  prompt: string;
  options: string[];
}

export interface ChapterItem {
  id: string;
  number: string;
  label: string;
  hasInput?: boolean;
}

export const CHAPTERS: ChapterItem[] = [
  { id: 'summary', number: '14', label: 'One-Line Summary' },
  { id: 'glossary', number: '00', label: 'Glossary (30 Terms)' },
  { id: 'original-idea', number: '01', label: 'Original Idea Killed' },
  { id: 'pivot', number: '02', label: 'The Pivot & Architecture', hasInput: true },
  { id: 'affiliate-separation', number: '03', label: 'Affiliate Data Separation' },
  { id: 'coverage-matrix', number: '04', label: 'Full Coverage Matrix' },
  { id: 'free-limits', number: '05', label: 'Verified Free Limits' },
  { id: 'api-call-math', number: '06', label: 'What 1 API Call Means', hasInput: true },
  { id: 'pakistan-reality', number: '07', label: 'Pakistan Reality Checks' },
  { id: 'commission-tracking', number: '08', label: 'Commission Tracking', hasInput: true },
  { id: 'payouts-taxes', number: '09', label: 'Payouts & Taxes (PK)', hasInput: true },
  { id: 'final-stack', number: '10', label: 'Final Decision & Stack' },
  { id: 'next-steps', number: '11', label: 'Immediate Next Steps' },
  { id: 'hard-constraints', number: '12', label: 'Hard Constraints' },
  { id: 'scorecard', number: '13', label: 'Win / Lose Scorecard' },
  { id: 'decisions', number: '15', label: 'Decisions Needed', hasInput: true },
];

export const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    term: 'API',
    definition:
      '"Application Programming Interface" — a way for one website\'s code to ask another website\'s server for data. Think of it as a waiter: you (our site) give an order (a request) to the waiter (API), and the kitchen (the other site\'s database) sends back food (data).',
    category: 'Technical',
  },
  {
    term: 'API Key',
    definition:
      'A secret password that identifies us to the API. Without it, the API refuses to serve us.',
    category: 'Technical',
  },
  {
    term: 'API Call / Request',
    definition:
      'One single order placed with the waiter. One call returns ONE PAGE of results, not one product, and not the whole database. This is the most misunderstood concept in the whole project — explained repeatedly in Section 6.',
    category: 'Technical',
  },
  {
    term: 'Rate Limit',
    definition:
      'How fast we\'re allowed to place orders. E.g., "30 requests per minute" means we can order 30 pages of data every 60 seconds, no faster. Exceed it and the API blocks us temporarily.',
    category: 'Technical',
  },
  {
    term: 'Quota',
    definition:
      'How many orders we\'re allowed in a period (day / month / year / one-time). E.g., "1,000 requests per month" = 1,000 pages per month, then it resets.',
    category: 'Technical',
  },
  {
    term: 'Pagination',
    definition:
      'The process of requesting page 1, then page 2, then page 3… because no API gives you the whole database in one call. We write a loop (code that repeats) to fetch page after page.',
    category: 'Technical',
  },
  {
    term: 'Scraping',
    definition:
      'Automatically reading data off a public webpage as if a robot were browsing it. Not the same as an official API. Legally gray. May violate a site\'s Terms of Service.',
    category: 'Technical',
  },
  {
    term: 'Aggregator',
    definition:
      'A middleman service that connects to many other services and gives us one unified interface so we don\'t have to integrate each one separately.',
    category: 'Technical',
  },
  {
    term: 'Unified Schema',
    definition:
      'A single, consistent data format. E.g., a product from Amazon and a product from AliExpress both come back with the same field names (title, price, image_url), so our code doesn\'t need to be rewritten for each platform.',
    category: 'Technical',
  },
  {
    term: 'Affiliate Marketing',
    definition:
      'We display a product. A user clicks our special link. They buy on the merchant\'s site. The merchant pays us a commission. We never touch the money, the product, or the shipping.',
    category: 'Affiliate',
  },
  {
    term: 'Affiliate Link',
    definition:
      'A URL that contains our unique tracking ID. When someone clicks it, a cookie is set in their browser so the merchant knows we sent them.',
    category: 'Affiliate',
  },
  {
    term: 'Cookie Window',
    definition:
      'The time period after a click during which we still get credit if the user buys. Typically 30 days. If they buy after the cookie expires, we get nothing.',
    category: 'Affiliate',
  },
  {
    term: 'Postback',
    definition:
      'An automatic server-to-server message the merchant sends to the affiliate network saying "this sale belongs to affiliate ID #12345." This is how commissions are tracked without us doing anything manually.',
    category: 'Affiliate',
  },
  {
    term: 'Commission',
    definition:
      'Our cut of the sale. E.g., 5% of a $100 product = $5 to us.',
    category: 'Affiliate',
  },
  {
    term: 'Payout Threshold',
    definition:
      'The minimum balance we must accumulate before we can withdraw. E.g., "$10 minimum" means we can\'t withdraw $9.50.',
    category: 'Finance & Legal',
  },
  {
    term: 'Payment Hold',
    definition:
      'A delay before commissions become withdrawable. E.g., "60-day hold" means commissions from January 1 become withdrawable around March 1. This exists because of returns/refunds.',
    category: 'Finance & Legal',
  },
  {
    term: 'COD (Cash on Delivery)',
    definition:
      'The customer pays cash when the package arrives. We cannot offer this as affiliates — only the merchant can.',
    category: 'Affiliate',
  },
  {
    term: 'Dropshipping',
    definition:
      'We list products, customer pays us, we order from a supplier who ships directly to the customer. This is NOT what we\'re doing. It requires capital, payment processing, and logistics.',
    category: 'Affiliate',
  },
  {
    term: 'Reseller',
    definition:
      'We buy inventory, hold it, ship it, handle customer service. Even more capital-intensive than dropshipping. Not what we\'re doing.',
    category: 'Affiliate',
  },
  {
    term: 'PSEB',
    definition:
      'Pakistan Software Export Board. A government body. Registering with them classifies our income as "IT export services" and drops our tax rate dramatically.',
    category: 'Finance & Legal',
  },
  {
    term: 'NTN',
    definition:
      'National Tax Number. Pakistan\'s tax ID for businesses/individuals earning taxable income. Required before PSEB registration.',
    category: 'Finance & Legal',
  },
  {
    term: 'W-8BEN',
    definition:
      'A US tax form. Pakistan has a tax treaty (DTAA) with the USA. Filing W-8BEN tells Amazon "tax me at the treaty rate, not the default."',
    category: 'Finance & Legal',
  },
  {
    term: 'DTAA',
    definition:
      'Double Taxation Avoidance Agreement. A treaty between two countries so you don\'t pay tax twice on the same income.',
    category: 'Finance & Legal',
  },
  {
    term: 'KYC',
    definition:
      '"Know Your Customer." Identity verification. Some services require a registered company + corporate email to pass KYC. Students with Gmail accounts get blocked.',
    category: 'Finance & Legal',
  },
  {
    term: 'RPS',
    definition:
      '"Requests Per Second." A rate limit measured in seconds instead of minutes. 2 RPS = 2 requests every second.',
    category: 'Technical',
  },
  {
    term: 'Compute Unit',
    definition:
      'A billing measurement used by some cloud platforms (like Apify). Instead of charging per request, they charge per "unit of computing work done." Heavier tasks burn more units.',
    category: 'Technical',
  },
  {
    term: 'Credit-based billing',
    definition:
      'You get a dollar amount of credit (e.g., $5). Each action costs some fraction of that credit. When the credit is gone, it\'s gone (unless it renews).',
    category: 'Technical',
  },
  {
    term: 'Request-based billing',
    definition:
      'You get a number of requests (e.g., 1,000). Each API call uses one. Simpler to plan around than credit-based billing.',
    category: 'Technical',
  },
  {
    term: 'SP-API',
    definition:
      'Amazon\'s official "Selling Partner API." Powerful but heavily restricted. Cannot be mixed with third-party data in the same application without violating Amazon\'s terms. We are not using it.',
    category: 'Technical',
  },
  {
    term: 'Payout',
    definition:
      'The actual money leaving the affiliate network and arriving in our Payoneer account.',
    category: 'Finance & Legal',
  },
  {
    term: 'Net-30 / NET-30',
    definition:
      'Payment terms meaning "paid 30 days after the invoice/end of month." A type of payment delay.',
    category: 'Finance & Legal',
  },
  {
    term: 'Geo',
    definition:
      'Short for "geography" / region. When a provider says "catalogue availability varies by geo," it means "the products available in Pakistan might be different from the products available in the USA."',
    category: 'Affiliate',
  },
];

export const AFFILIATE_AGGREGATORS: AffiliateEvaluatorRow[] = [
  {
    provider: 'CBAPI.dev',
    whatItDoes: 'ClickBank, Awin, Impact, CJ, eBay',
    whyConsidered: 'Completely free, no paid tiers, 30 req/min',
    outcome: 'KEPT as primary — closest to "free unlimited"',
    status: 'primary',
  },
  {
    provider: 'Feedico',
    whatItDoes: 'CJ, Awin, Impact, Admitad, TradeTracker, TakeDeals, Takeads',
    whyConsidered: 'No approvals needed, 65% commission kept, Payoneer payouts',
    outcome: 'KEPT as structured backup — but 100 req/day cap is limiting',
    status: 'backup',
  },
  {
    provider: 'Synced.io',
    whatItDoes: '54 networks, uses your own credentials',
    whyConsidered: 'Network-independent infrastructure',
    outcome: 'Dropped — requires our own network accounts, which we don\'t have',
    status: 'dropped',
  },
  {
    provider: 'Hi Energy AI',
    whatItDoes: 'REST API across FlexOffers, CJ, Rakuten, Impact, Awin',
    whyConsidered: 'Developer-friendly',
    outcome: 'Dropped — no clear free tier for students',
    status: 'dropped',
  },
  {
    provider: 'Datafeedr',
    whatItDoes: '950M+ products across 35+ networks',
    whyConsidered: 'Massive catalog',
    outcome: 'Dropped — product-feed oriented, not link-generation focused',
    status: 'dropped',
  },
  {
    provider: 'Affiliate.com',
    whatItDoes: 'Amazon, Walmart, 16k+ merchants',
    whyConsidered: 'Strong Western coverage',
    outcome: 'Dropped — no AliExpress, no Chinese platforms',
    status: 'dropped',
  },
  {
    provider: 'afilimax',
    whatItDoes: 'Node.js library, Puppeteer-based',
    whyConsidered: 'Unified link creation across platforms',
    outcome: 'DROPPED — Puppeteer (browser automation with logged-in cookies) is fragile and likely violates platform terms',
    status: 'dropped',
  },
];

export const COVERAGE_MATRIX: CoverageRow[] = [
  { store: 'Amazon', productData: 'Covered', affiliateAccess: 'Feedico / CBAPI.dev', status: 'Monetizable' },
  { store: 'Walmart', productData: 'Covered', affiliateAccess: 'Feedico', status: 'Monetizable' },
  { store: 'eBay', productData: 'Covered', affiliateAccess: 'Via Awin/CJ (partial) / CBAPI.dev (full)', status: 'Monetizable' },
  { store: 'AliExpress', productData: 'Covered', affiliateAccess: 'Via Admitad (inside Feedico)', status: 'Monetizable' },
  { store: 'Etsy', productData: 'Covered', affiliateAccess: 'Via Awin', status: 'Partial' },
  { store: 'Shein', productData: 'Covered', affiliateAccess: 'Via Awin / CJ / Takeads', status: 'Partial' },
  { store: 'Shopify', productData: 'Covered', affiliateAccess: 'No unified generator', status: 'Display only' },
  { store: 'TikTok Shop', productData: 'Covered', affiliateAccess: 'Requires official API', status: 'Display only' },
  {
    store: 'Temu',
    productData: 'Covered',
    affiliateAccess: 'Requires official API (separate Temu Affiliate program is open to Pakistan)',
    status: 'Display only',
  },
  { store: 'Alibaba / 1688', productData: 'Covered', affiliateAccess: 'No aggregator', status: 'Display only' },
  { store: 'Taobao', productData: 'Covered', affiliateAccess: 'No aggregator', status: 'Display only' },
  { store: 'Shopee', productData: 'Covered', affiliateAccess: 'No aggregator', status: 'Display only' },
  { store: 'Lazada', productData: 'Covered', affiliateAccess: 'No aggregator', status: 'Display only' },
];

export const PRODUCT_PROVIDERS: ProductProviderRow[] = [
  {
    provider: 'Amazonscraperapi',
    covers: 'Amazon',
    freeCapStructure: 'Recurring monthly',
    exactLimit: '1,000 requests/month, no daily cap, no card',
    perMinuteLimit: '2 sustained RPS, burst 10 for 3s',
    verdict: 'PRIMARY',
    tier: 'primary',
  },
  {
    provider: 'BayDeep',
    covers: 'AliExpress',
    freeCapStructure: 'Never-expiring key',
    exactLimit: 'Self-serve key via mint_free_key, never expires, full tool access',
    perMinuteLimit: '30 req/min per IP',
    verdict: 'PRIMARY',
    tier: 'primary',
  },
  {
    provider: 'Canopy API',
    covers: 'Amazon',
    freeCapStructure: 'Recurring monthly',
    exactLimit: '100 requests/month, free forever, blocked if exceeded',
    perMinuteLimit: 'Not published',
    verdict: 'Testing only',
    tier: 'limited',
  },
  {
    provider: 'Apify',
    covers: 'Multi-platform',
    freeCapStructure: 'Recurring credit',
    exactLimit: '$5 credit/month',
    perMinuteLimit: '$0.20 / compute unit',
    verdict: 'One-off pulls only',
    tier: 'limited',
  },
  {
    provider: 'AntsData',
    covers: 'Amazon + others',
    freeCapStructure: 'One-time credit',
    exactLimit: '$5 balance on signup',
    perMinuteLimit: 'Varies',
    verdict: 'First batch only',
    tier: 'limited',
  },
  {
    provider: 'Pangolin',
    covers: 'Amazon + others',
    freeCapStructure: 'Recurring monthly',
    exactLimit: '60 credits/month',
    perMinuteLimit: 'Not published',
    verdict: 'Too limited',
    tier: 'rejected',
  },
  {
    provider: 'Serpent',
    covers: 'Amazon',
    freeCapStructure: 'One-time + daily demo',
    exactLimit: '10 free calls on signup + 1 demo/day',
    perMinuteLimit: 'Not cleanly published',
    verdict: 'Rejected — $10 min deposit for real use',
    tier: 'rejected',
  },
  {
    provider: 'Bright Data',
    covers: 'Amazon',
    freeCapStructure: 'Recurring monthly (advertised)',
    exactLimit: '5,000 records/month',
    perMinuteLimit: 'Not published',
    verdict: 'ELIMINATED — free tier "never granted," KYC wall, enterprise pricing',
    tier: 'rejected',
  },
];

export const AFFILIATE_PROVIDERS: AffiliateProviderRow[] = [
  {
    provider: 'CBAPI.dev',
    covers: 'ClickBank, Awin, Impact, CJ, eBay',
    freeCapStructure: 'Free unlimited',
    exactLimit: 'No monthly cap, no paid tiers',
    perMinuteLimit: '30 req/min',
    verdict: 'PRIMARY',
    tier: 'primary',
  },
  {
    provider: 'Feedico',
    covers: 'CJ, Awin, Impact, Admitad, TradeTracker, TakeDeals, Takeads',
    freeCapStructure: 'Recurring monthly',
    exactLimit: '1,000/month, 100/day, 10 results/page, first 5 pages/query',
    perMinuteLimit: '10 req/min',
    verdict: 'Structured backup only',
    tier: 'limited',
  },
];

export const PAYOUT_THRESHOLDS: PayoutThresholdRow[] = [
  {
    platform: 'Temu',
    minimumPayout: '~$20',
    paymentHold: '30–60 days (for returns)',
    payoutFrequency: 'Monthly',
  },
  {
    platform: 'AliExpress (via Admitad)',
    minimumPayout: '$10',
    paymentHold: '~60 days',
    payoutFrequency: 'NET-30 (paid after advertiser pays Admitad)',
  },
  {
    platform: 'Amazon Associates',
    minimumPayout: '~$10 (via Payoneer)',
    paymentHold: 'Standard',
    payoutFrequency: 'Monthly',
  },
];

export const FINAL_STACK: FinalStackRow[] = [
  { layer: 'Amazon data', tool: 'Amazonscraperapi', freeAllowance: '1,000 requests/month, no daily cap, 2 RPS', status: 'PRIMARY', tier: 'primary' },
  { layer: 'Amazon data', tool: 'Canopy', freeAllowance: '100/month forever', status: 'Testing only', tier: 'limited' },
  { layer: 'Amazon data', tool: 'Serpent', freeAllowance: '10 free calls + 1 demo/day', status: 'Rejected', tier: 'rejected' },
  { layer: 'Amazon data', tool: 'Bright Data', freeAllowance: '5,000 records/month (advertised)', status: 'ELIMINATED', tier: 'rejected' },
  { layer: 'Amazon data', tool: 'Apify', freeAllowance: '$5 credit/month', status: 'One-off pulls', tier: 'limited' },
  { layer: 'Amazon data', tool: 'AntsData', freeAllowance: '$5 one-time credit', status: 'First batch only', tier: 'limited' },
  { layer: 'Amazon data', tool: 'Pangolin', freeAllowance: '60 credits/month', status: 'Too limited', tier: 'rejected' },
  { layer: 'AliExpress data', tool: 'BayDeep', freeAllowance: 'Free key, never expires, 30 req/min', status: 'PRIMARY', tier: 'primary' },
  { layer: 'Affiliate links', tool: 'CBAPI.dev', freeAllowance: 'Free unlimited, 30 req/min', status: 'PRIMARY', tier: 'primary' },
  { layer: 'Affiliate links', tool: 'Feedico', freeAllowance: '1,000/month, 100/day, 10/min', status: 'Structured backup', tier: 'limited' },
  { layer: 'Affiliate links', tool: 'AliExpress via Admitad', freeAllowance: 'Payoneer, $10 min, 60-day hold', status: 'For AliExpress commissions', tier: 'primary' },
  { layer: 'Payouts', tool: 'Payoneer', freeAllowance: 'Free to set up', status: 'Required', tier: 'required' },
  { layer: 'Tax optimization', tool: 'PSEB + NTN', freeAllowance: '0.25% final tax', status: 'Critical', tier: 'required' },
];

export const NEXT_STEPS: string[] = [
  'Call mint_free_key on BayDeep → get permanent AliExpress API key (no signup, never expires).',
  'Sign up for Amazonscraperapi → 1,000 requests/month, no card, no daily cap.',
  'Get free API key from CBAPI.dev → unlimited affiliate data at 30 req/min.',
  'Sign up for Feedico Partner → verify Amazon + AliExpress merchant availability in Pakistan geo (structured backup).',
  'Apply for Temu Affiliate → first real revenue stream (hype products, open to Pakistan).',
  'Build minimal UI → product pages + search + redirect buttons.',
  'Set up Payoneer → receiving account ready; verify current Pakistan withdrawal fee.',
  'Get NTN + register PSEB → lock in 0.25% tax rate (vs 1% unregistered).',
  'File W-8BEN when applying to Amazon Associates (avoid 30% withholding).',
];

export const HARD_CONSTRAINTS: string[] = [
  'No COD as an affiliate. Merchant controls payment. Non-negotiable.',
  'No checkout on our site. Redirect model only.',
  'No native affiliate for TikTok Shop, Temu, Shopee, Lazada, Alibaba, Taobao without official APIs — display-only for now.',
  'Apify is scraping, not official API — legal gray zone; also credit-based, not request-based.',
  'Amazon + Payoneer for Pakistan is unverified — test with a small payout before relying on it.',
  'Feedico catalogue availability varies by geo — verify Pakistan before building revenue on it.',
  'Bright Data is dead for students — KYC wall, unreliable free tier, enterprise pricing.',
  'Serpent is not a catalog tool — 10 free calls then $10 minimum deposit.',
  '"1 API call" = 1 page, not 1 product and not the full database.',
  'Payoneer fees may be higher than advertised — verify 3% vs 2% withdrawal fee in your dashboard.',
  'Official APIs are a bureaucratic nightmare for students — third-party aggregators let us skip the paperwork, but cap our coverage.',
];

export const SCORECARD_ROWS: ScorecardRow[] = [
  {
    decision: 'Reject hiding origin',
    profitWin: 'Avoids legal risk, avoids angry customers, avoids ToS violation',
    lossLose: 'We lose the "cheap Chinese product" marketing angle — must find other hooks',
    category: 'Strategy',
  },
  {
    decision: 'Choose affiliate over dropshipping',
    profitWin: 'Free, no capital, no logistics, passive income',
    lossLose: 'No COD, no checkout, cannot control customer experience, lower margins',
    category: 'Strategy',
  },
  {
    decision: 'Reject Daraz',
    profitWin: 'Avoids associating with a distrusted brand',
    lossLose: 'Lose local anchor, lose JazzCash/Easypaisa payouts, lose Pakistan-specific traffic',
    category: 'Pakistan & Tax',
  },
  {
    decision: 'Choose third-party over official APIs',
    profitWin: 'No enterprise paperwork, no approvals, faster start',
    lossLose: 'Cannot monetize TikTok Shop, Temu, Shopee, Lazada, Alibaba, Taobao directly',
    category: 'Stack',
  },
  {
    decision: 'Amazonscraperapi as Amazon primary',
    profitWin: '1,000 free requests/month, no daily cap, 2 RPS, reliable',
    lossLose: '1,000/month is limiting — catalog grows slowly',
    category: 'Stack',
  },
  {
    decision: 'BayDeep as AliExpress primary',
    profitWin: 'Free key never expires, no signup',
    lossLose: '30 req/min limit, quota-heavy endpoints must be avoided',
    category: 'Stack',
  },
  {
    decision: 'CBAPI.dev as affiliate primary',
    profitWin: 'Free unlimited, 30 req/min',
    lossLose: 'Covers Western merchants only (ClickBank, Awin, Impact, CJ, eBay)',
    category: 'Stack',
  },
  {
    decision: 'Feedico as structured backup',
    profitWin: 'Payoneer payouts, 65% commission kept, 7 networks',
    lossLose: '100 requests/day cap, 10/min rate limit — cannot bulk import',
    category: 'Stack',
  },
  {
    decision: 'Eliminate Bright Data',
    profitWin: 'Saves integration time',
    lossLose: 'Lose "5,000 records/month" advertised tier (which didn\'t work anyway)',
    category: 'Stack',
  },
  {
    decision: 'Reject Serpent',
    profitWin: 'Avoids $10 minimum deposit',
    lossLose: 'Lose $0.02/1,000 cheap paid option',
    category: 'Stack',
  },
  {
    decision: 'PSEB registration',
    profitWin: '0.25% tax instead of 15% — massive savings',
    lossLose: 'Requires NTN, paperwork, annual filing, 30 September deadline',
    category: 'Pakistan & Tax',
  },
  {
    decision: 'W-8BEN filing',
    profitWin: 'Avoids 30% US withholding',
    lossLose: 'Must remember to file during signup — easy to miss',
    category: 'Pakistan & Tax',
  },
  {
    decision: 'Temu Affiliate program',
    profitWin: 'Open to Pakistan, 5–30% commission, first revenue',
    lossLose: '30–60 day hold, $20 minimum, prepaid-only (no COD)',
    category: 'Pakistan & Tax',
  },
  {
    decision: 'AliExpress via Admitad',
    profitWin: 'Payoneer payout, $10 min, open to Pakistan',
    lossLose: '60-day hold, requires Admitad account setup',
    category: 'Pakistan & Tax',
  },
  {
    decision: '"56 similar + one free" feature',
    profitWin: 'Killer differentiator, drives engagement',
    lossLose: 'Technically complex — visual search or keyword matching may be unreliable across platforms',
    category: 'Strategy',
  },
  {
    decision: 'Amazon + Payoneer combination',
    profitWin: 'Widely used by Pakistani affiliates',
    lossLose: 'Unverified — Amazon does not officially document Payoneer for Pakistan',
    category: 'Pakistan & Tax',
  },
];

export const DECISION_QUESTIONS: DecisionQuestion[] = [
  {
    id: 'differentiator',
    number: '01',
    topic: 'Differentiator',
    sectionRef: 'Section 02',
    prompt:
      'Is "56 similar + one free on AliExpress" our main hook, or do you want a different angle (curated lists, reviews, categories)?',
    options: [
      'Agree — go with "56 similar + one free"',
      'Focus on curated "best of" lists instead',
      'Focus on user reviews & comparisons',
      'Combine both later, start simple first',
    ],
  },
  {
    id: 'catalogSpeed',
    number: '02',
    topic: 'Catalog Speed',
    sectionRef: 'Section 06',
    prompt:
      'Are you okay building Amazon at ~10,000–30,000 unique products/month, or do we explore paid tiers early to go faster?',
    options: [
      'Stay $0 free (~10k–30k unique/month)',
      'Explore small paid tiers early for speed',
    ],
  },
  {
    id: 'payoutHandling',
    number: '03',
    topic: 'Payout Handling',
    sectionRef: 'Section 08',
    prompt:
      'Who checks the affiliate dashboards and requests payouts? Split or one person?',
    options: [
      'I will check dashboards & request payouts',
      'Split it (I check Temu, you check Admitad/Amazon)',
      'You handle dashboards & payouts',
    ],
  },
  {
    id: 'taxRegistration',
    number: '04',
    topic: 'Tax Registration',
    sectionRef: 'Section 09',
    prompt:
      'Do you already have an NTN? Who handles PSEB registration and annual filing?',
    options: [
      'I already have an NTN — I can help with PSEB',
      'I do not have an NTN yet — we both need to get one',
      'Let\'s split the NTN + PSEB paperwork',
    ],
  },
  {
    id: 'buildDivision',
    number: '05',
    topic: 'Build Division',
    sectionRef: 'Section 15',
    prompt:
      'What do you want to own vs. what I own? (Suggestion: I handle backend/data pipeline, you handle frontend/UI — or we split both.)',
    options: [
      'I own frontend/UI, you own backend/data',
      'I own backend/data, you own frontend/UI',
      'Split both frontend and backend together',
    ],
  },
  {
    id: 'timeline',
    number: '06',
    topic: 'Timeline',
    sectionRef: 'Section 15',
    prompt:
      'When do we want the first working product page live? (Suggestion: 2 weeks for a barebones Amazon+AliExpress page with redirect links.)',
    options: [
      'Agree — 2 weeks for barebones live page',
      'Faster — aim for 1 week MVP',
      '3–4 weeks for a more polished v1',
    ],
  },
];
