export const ALI_PROFILE = {
  name: 'Ali Hassan',
  email: 'ali.hassan@gmail.com',
  phone: '+60 12-345 6789',
  ic: '890215-14-5678',
  businessName: 'NurtureCare Sdn Bhd',
  businessIdea:
    'A premium nursing home chain targeting middle-income Malaysians, offering tech-enabled care monitoring, family communication apps, and trained care staff. Targeting underserved suburban markets in Selangor and Johor.',
  sector: 'Healthcare',
  fundingRequested: 'RM 250,000',
  documents: [
    'Business_Plan_NurtureCare.pdf',
    'Financial_Projections_2026.xlsx',
    'Founders_CV_AliHassan.pdf',
  ],
}

export const AI_VERDICT = {
  recommendation: 'APPROVE',
  confidence: 89,
  reasons: [
    'Strong market opportunity in underserved suburban eldercare — projected CAGR of 12% through 2030.',
    'Founding team demonstrates relevant domain experience and operational background in healthcare services.',
    'Financial projections are conservative and achievable; unit economics are sound for this sector.',
  ],
}

export const MENTORS = [
  {
    id: 'm1',
    name: 'Dr. Aminah Rashid',
    initials: 'AR',
    score: 94,
    tags: ['Healthcare', 'Operations', 'Eldercare'],
    reason:
      "Strong background in healthcare operations and two successful exits in the eldercare sector — high alignment with applicant's nursing home model.",
    bio: 'Former CEO of CareFirst Malaysia with 15 years in healthcare administration. Successfully guided two eldercare startups from seed to Series B. Expertise in regulatory compliance, care staff management, and health-tech integration.',
    pastMatches: 2,
    availability: 'Available from 20 May 2026',
  },
  {
    id: 'm2',
    name: 'Rajan Subramaniam',
    initials: 'RS',
    score: 87,
    tags: ['Operations', 'Scaling', 'Services'],
    reason:
      'Proven track record in scaling service businesses across Malaysia; operations playbook transferable to nursing home management.',
    bio: 'Serial entrepreneur with exits in restaurant chains and service franchising. Built a 45-outlet service network in 3 years. Strong in systems, hiring, and multi-location operations.',
    pastMatches: 3,
    availability: 'Available from 15 May 2026',
  },
  {
    id: 'm3',
    name: 'Lim Wei Hong',
    initials: 'LW',
    score: 71,
    tags: ['General Business', 'Finance', 'Strategy'],
    reason:
      'Broad business experience with financial modelling strength; useful for fundraising preparation and investor readiness.',
    bio: 'Former investment banker turned entrepreneur mentor. Strong in financial strategy, investor relations, and business planning. Generalist with broad sector exposure.',
    pastMatches: 4,
    availability: 'Available from 22 May 2026',
  },
]

export const AI_REVIEW_STEPS = [
  'Loading applicant profile data...',
  'Cross-referencing 847 historical applications...',
  'Analysing sector fit and market timing...',
  'Evaluating founding team credentials...',
  'Running financial projection validation...',
  'Generating recommendation...',
]

export const MENTOR_MATCH_STEPS = [
  'Scanning 50 mentor profiles...',
  'Scoring by domain expertise...',
  'Running vector similarity matching...',
  'Ranking by historical success rate...',
  'Finalising top candidates...',
]

export const ECOSYSTEM_MENTORS = [
  { id: 'em1', name: 'Dr. Aminah R.', sector: 'Healthcare', matches: 2 },
  { id: 'em2', name: 'Rajan S.', sector: 'Operations', matches: 3 },
  { id: 'em3', name: 'Lim Wei Hong', sector: 'Finance', matches: 4 },
  { id: 'em4', name: 'Priya Nair', sector: 'Tech', matches: 2 },
  { id: 'em5', name: 'Ahmad Fauzi', sector: 'Agriculture', matches: 1 },
]

export const ECOSYSTEM_PARTICIPANTS = [
  { id: 'ep1',  name: 'Ali Hassan',    project: 'NurtureCare',  sector: 'Healthcare',    status: 'On-Track',        mentorId: 'em1' },
  { id: 'ep2',  name: 'Siti Rahimah', project: 'FreshBox MY',  sector: 'FoodTech',      status: 'On-Track',        mentorId: 'em2' },
  { id: 'ep3',  name: 'David Tan',    project: 'EduPath',      sector: 'EdTech',        status: 'On-Track',        mentorId: 'em4' },
  { id: 'ep4',  name: 'Nora Ismail',  project: 'AgriSense',    sector: 'Agriculture',   status: 'Needs Attention', mentorId: 'em5' },
  { id: 'ep5',  name: 'Kevin Loh',    project: 'PayLite',      sector: 'FinTech',       status: 'On-Track',        mentorId: 'em3' },
  { id: 'ep6',  name: 'Farah Zain',   project: 'CareLink',     sector: 'Healthcare',    status: 'At Risk',         mentorId: 'em1' },
  { id: 'ep7',  name: 'Marcus Yeo',   project: 'LogiFlow',     sector: 'Logistics',     status: 'On-Track',        mentorId: 'em2' },
  { id: 'ep8',  name: 'Aisha Karim',  project: 'GreenBuild',   sector: 'PropTech',      status: 'On-Track',        mentorId: 'em3' },
  { id: 'ep9',  name: 'Rajesh Kumar', project: 'MediTrack',    sector: 'HealthTech',    status: 'On-Track',        mentorId: 'em1' },
  { id: 'ep10', name: 'Cindy Ong',    project: 'BioFarm',      sector: 'AgriTech',      status: 'Needs Attention', mentorId: 'em5' },
  { id: 'ep11', name: 'Hafiz Roslan', project: 'CloudKitchen', sector: 'FoodTech',      status: 'On-Track',        mentorId: 'em2' },
  { id: 'ep12', name: 'Mei Lin',      project: 'SkinSense',    sector: 'HealthTech',    status: 'On-Track',        mentorId: 'em4' },
  { id: 'ep13', name: 'Azrul Aziz',   project: 'SolarHome',    sector: 'CleanTech',     status: 'On-Track',        mentorId: 'em3' },
  { id: 'ep14', name: 'Suriani Mat',  project: 'CraftHive',    sector: 'E-Commerce',    status: 'At Risk',         mentorId: 'em3' },
  { id: 'ep15', name: 'Jin Wei',      project: 'RoboClean',    sector: 'DeepTech',      status: 'On-Track',        mentorId: 'em4' },
  { id: 'ep16', name: 'Layla Hamid',  project: 'TravelLocal',  sector: 'Tourism',       status: 'On-Track',        mentorId: 'em2' },
  { id: 'ep17', name: 'Chong Wei',    project: 'DataSafe',     sector: 'Cybersecurity', status: 'On-Track',        mentorId: 'em4' },
  { id: 'ep18', name: 'Nur Hidayah',  project: 'KidLearn',     sector: 'EdTech',        status: 'Needs Attention', mentorId: 'em4' },
  { id: 'ep19', name: 'Zulkifli A.',  project: 'HalalChain',   sector: 'FoodTech',      status: 'On-Track',        mentorId: 'em5' },
  { id: 'ep20', name: 'Patricia Ng',  project: 'WellnessApp',  sector: 'HealthTech',    status: 'On-Track',        mentorId: 'em1' },
]

export const MILESTONES = [
  { id: 1, name: 'Funding Disbursed',            date: 'Jan 2026', completed: true,  current: false },
  { id: 2, name: 'Business Registration & Setup', date: 'Feb 2026', completed: true,  current: false },
  { id: 3, name: 'Market Validation Done',        date: 'Apr 2026', completed: true,  current: true  },
  { id: 4, name: 'First Pilot Site Operational',  date: 'Jul 2026', completed: false, current: false },
  { id: 5, name: 'Series A Readiness Review',     date: 'Oct 2026', completed: false, current: false },
]

export const PNL_DATA = [
  { quarter: 'Q1 2026', revenue: 40000,  netProfit: 8000  },
  { quarter: 'Q2 2026', revenue: 65000,  netProfit: 15000 },
  { quarter: 'Q3 2026', revenue: 88000,  netProfit: 22000 },
  { quarter: 'Q4 2026', revenue: 112000, netProfit: 31000 },
]
