export const applicant = {
  name: 'Ali Rahman',
  role: 'Founder, SeniCare Living',
  programme: 'Cradle CIP Spark',
  sector: 'Healthcare / Eldercare',
  stage: 'Pre-seed',
  requestedFunding: 'RM 150,000',
  location: 'Selangor',
  submittedAt: '16 May 2026, 10:42 AM',
  businessIdea:
    'A neighbourhood nursing home network combining clinical care, family reporting, and caregiver job creation for underserved Malaysian communities.',
  impact:
    'Launch the first 24-bed pilot home, train 18 caregivers, and provide transparent family care updates through a lightweight operations system.',
  documents: [
    { name: 'Business Plan.pdf', meta: '18 pages' },
    { name: 'Financial Projection.xlsx', meta: 'Q1-Q4 forecast' },
    { name: 'Founder IC + SSM.zip', meta: 'Verified upload' },
  ],
  signals: [
    'Founder has five years in community healthcare operations',
    'Pilot site letter of intent already secured',
    'Clear service model with repeatable expansion path',
  ],
};

export const aiVerdict = {
  recommendation: 'Approve',
  confidence: 89,
  summary:
    'Ali shows strong founder-market fit, credible early validation, and a funding request aligned with Cradle programme guardrails.',
  reasons: [
    'Healthcare operations experience reduces execution risk for the first pilot home.',
    'Submitted financial model shows positive net profit by Q2 after grant deployment.',
    'Impact goals align with eldercare access, job creation, and measurable community outcomes.',
  ],
};

export const mentors = [
  {
    id: 'aminah',
    name: 'Dr. Aminah Basri',
    title: 'Healthcare Operator & Angel Investor',
    score: 94,
    initials: 'AB',
    tags: ['Healthcare', 'Eldercare', 'Operations'],
    reason:
      "Strong background in healthcare operations and two successful exits in eldercare, with high alignment to Ali's nursing home model.",
    bio:
      'Former hospital group COO who scaled care teams, compliance workflows, and patient-family reporting across three Malaysian care facilities.',
    pastMatches: ['MediHome Pilot', 'Klinik Kita Ops'],
    availability: 'Tue 10:30 AM, Thu 2:00 PM',
    stat: '2 exits',
  },
  {
    id: 'rajan',
    name: 'Rajan Subramaniam',
    title: 'Service Operations Mentor',
    score: 87,
    initials: 'RS',
    tags: ['Ops Design', 'Unit Economics', 'Hiring'],
    reason:
      'Excellent match for operational scaling and staffing model design, especially for high-touch service businesses.',
    bio:
      'Built regional operating playbooks for logistics and healthcare service teams, with a focus on staffing ratios and margin discipline.',
    pastMatches: ['CareFleet MY'],
    availability: 'Mon 4:00 PM, Wed 11:00 AM',
    stat: '14 cohorts',
  },
  {
    id: 'lim',
    name: 'Lim Wei Hong',
    title: 'Growth & Finance Advisor',
    score: 71,
    initials: 'LW',
    tags: ['Finance', 'Go-to-market', 'Fundraising'],
    reason:
      'Useful for pricing strategy and investor readiness, though less specialised in regulated healthcare operations.',
    bio:
      'Finance-focused mentor with broad startup portfolio experience and strong pitch refinement discipline.',
    pastMatches: ['EduPay Asia', 'FreshCart'],
    availability: 'Fri 9:30 AM',
    stat: '21 startups',
  },
];

export const ecosystemMentors = [
  { id: 'm1', name: 'Dr. Aminah', sector: 'Healthcare', status: 'Strong', x: 150, y: 95 },
  { id: 'm2', name: 'Rajan S.', sector: 'Operations', status: 'Strong', x: 150, y: 210 },
  { id: 'm3', name: 'Lim W.H.', sector: 'Finance', status: 'Watch', x: 150, y: 325 },
  { id: 'm4', name: 'Nadia Tan', sector: 'SaaS', status: 'Strong', x: 150, y: 440 },
  { id: 'm5', name: 'Farid Yusof', sector: 'Hardware', status: 'Light Touch', x: 150, y: 555 },
];

export const ecosystemParticipants = [
  { id: 'p1', name: 'Ali Rahman', project: 'SeniCare Living', sector: 'Healthcare', status: 'On Track', x: 740, y: 70 },
  { id: 'p2', name: 'Mei Lin', project: 'FarmSense', sector: 'AgriTech', status: 'On Track', x: 690, y: 120 },
  { id: 'p3', name: 'Irfan Hakim', project: 'SkillBridge', sector: 'EdTech', status: 'Needs Attention', x: 805, y: 150 },
  { id: 'p4', name: 'Priya Nair', project: 'CareFleet', sector: 'Health Logistics', status: 'On Track', x: 715, y: 205 },
  { id: 'p5', name: 'Jason Teo', project: 'PayKedai', sector: 'Fintech', status: 'On Track', x: 825, y: 245 },
  { id: 'p6', name: 'Alya Zain', project: 'TutorNest', sector: 'EdTech', status: 'Light Touch', x: 670, y: 290 },
  { id: 'p7', name: 'Hafiz Musa', project: 'RePack MY', sector: 'Climate', status: 'On Track', x: 785, y: 320 },
  { id: 'p8', name: 'Sarah Ong', project: 'Klinik Kita', sector: 'Healthcare', status: 'On Track', x: 735, y: 370 },
  { id: 'p9', name: 'Daniel Lee', project: 'DroneSawah', sector: 'AgriTech', status: 'At Risk', x: 855, y: 395 },
  { id: 'p10', name: 'Nora Aziz', project: 'LegalLite', sector: 'SaaS', status: 'On Track', x: 690, y: 435 },
  { id: 'p11', name: 'Marcus Tan', project: 'StockPilot', sector: 'Retail SaaS', status: 'On Track', x: 790, y: 470 },
  { id: 'p12', name: 'Siti Amani', project: 'BatikChain', sector: 'Commerce', status: 'Needs Attention', x: 725, y: 520 },
  { id: 'p13', name: 'Yong Jun', project: 'WaterPulse', sector: 'Hardware', status: 'On Track', x: 840, y: 540 },
  { id: 'p14', name: 'Kavitha Rao', project: 'MealMate', sector: 'FoodTech', status: 'Light Touch', x: 665, y: 575 },
  { id: 'p15', name: 'Ridzuan Haris', project: 'SolarLite', sector: 'Climate', status: 'On Track', x: 770, y: 610 },
  { id: 'p16', name: 'Chloe Wong', project: 'RentReady', sector: 'PropTech', status: 'On Track', x: 875, y: 630 },
  { id: 'p17', name: 'Arman Shah', project: 'SafeRoute', sector: 'Mobility', status: 'Needs Attention', x: 700, y: 660 },
  { id: 'p18', name: 'Leela Kumar', project: 'MediHome', sector: 'Healthcare', status: 'On Track', x: 810, y: 700 },
  { id: 'p19', name: 'Fikri Salleh', project: 'BuildBid', sector: 'Construction', status: 'Light Touch', x: 910, y: 720 },
  { id: 'p20', name: 'Grace Lim', project: 'CarbonDesk', sector: 'Climate SaaS', status: 'On Track', x: 620, y: 710 },
];

export const ecosystemLinks = [
  ['m1', 'p1'],
  ['m1', 'p4'],
  ['m1', 'p8'],
  ['m1', 'p18'],
  ['m2', 'p1'],
  ['m2', 'p3'],
  ['m2', 'p5'],
  ['m2', 'p7'],
  ['m2', 'p11'],
  ['m3', 'p5'],
  ['m3', 'p9'],
  ['m3', 'p12'],
  ['m3', 'p16'],
  ['m4', 'p6'],
  ['m4', 'p10'],
  ['m4', 'p11'],
  ['m4', 'p20'],
  ['m5', 'p2'],
  ['m5', 'p13'],
  ['m5', 'p15'],
  ['m5', 'p17'],
  ['m5', 'p19'],
];

export const ECOSYSTEM_MENTORS = [
  { id: 'em1', name: 'Dr. Aminah R.', sector: 'Healthcare', matches: 2 },
  { id: 'em2', name: 'Rajan S.', sector: 'Operations', matches: 3 },
  { id: 'em3', name: 'Lim Wei Hong', sector: 'Finance', matches: 4 },
  { id: 'em4', name: 'Priya Nair', sector: 'Tech', matches: 2 },
  { id: 'em5', name: 'Ahmad Fauzi', sector: 'Agriculture', matches: 1 },
];

export const ECOSYSTEM_PARTICIPANTS = [
  { id: 'ep1', name: 'Ali Hassan', project: 'NurtureCare', sector: 'Healthcare', status: 'On-Track', mentorId: 'em1' },
  { id: 'ep2', name: 'Siti Rahimah', project: 'FreshBox MY', sector: 'FoodTech', status: 'On-Track', mentorId: 'em2' },
  { id: 'ep3', name: 'David Tan', project: 'EduPath', sector: 'EdTech', status: 'On-Track', mentorId: 'em4' },
  { id: 'ep4', name: 'Nora Ismail', project: 'AgriSense', sector: 'Agriculture', status: 'Needs Attention', mentorId: 'em5' },
  { id: 'ep5', name: 'Kevin Loh', project: 'PayLite', sector: 'FinTech', status: 'On-Track', mentorId: 'em3' },
  { id: 'ep6', name: 'Farah Zain', project: 'CareLink', sector: 'Healthcare', status: 'At Risk', mentorId: 'em1' },
  { id: 'ep7', name: 'Marcus Yeo', project: 'LogiFlow', sector: 'Logistics', status: 'On-Track', mentorId: 'em2' },
  { id: 'ep8', name: 'Aisha Karim', project: 'GreenBuild', sector: 'PropTech', status: 'On-Track', mentorId: 'em3' },
  { id: 'ep9', name: 'Rajesh Kumar', project: 'MediTrack', sector: 'HealthTech', status: 'On-Track', mentorId: 'em1' },
  { id: 'ep10', name: 'Cindy Ong', project: 'BioFarm', sector: 'AgriTech', status: 'Needs Attention', mentorId: 'em5' },
  { id: 'ep11', name: 'Hafiz Roslan', project: 'CloudKitchen', sector: 'FoodTech', status: 'On-Track', mentorId: 'em2' },
  { id: 'ep12', name: 'Mei Lin', project: 'SkinSense', sector: 'HealthTech', status: 'On-Track', mentorId: 'em4' },
  { id: 'ep13', name: 'Azrul Aziz', project: 'SolarHome', sector: 'CleanTech', status: 'On-Track', mentorId: 'em3' },
  { id: 'ep14', name: 'Suriani Mat', project: 'CraftHive', sector: 'E-Commerce', status: 'At Risk', mentorId: 'em3' },
  { id: 'ep15', name: 'Jin Wei', project: 'RoboClean', sector: 'DeepTech', status: 'On-Track', mentorId: 'em4' },
  { id: 'ep16', name: 'Layla Hamid', project: 'TravelLocal', sector: 'Tourism', status: 'On-Track', mentorId: 'em2' },
  { id: 'ep17', name: 'Chong Wei', project: 'DataSafe', sector: 'Cybersecurity', status: 'On-Track', mentorId: 'em4' },
  { id: 'ep18', name: 'Nur Hidayah', project: 'KidLearn', sector: 'EdTech', status: 'Needs Attention', mentorId: 'em4' },
  { id: 'ep19', name: 'Zulkifli A.', project: 'HalalChain', sector: 'FoodTech', status: 'On-Track', mentorId: 'em5' },
  { id: 'ep20', name: 'Patricia Ng', project: 'WellnessApp', sector: 'HealthTech', status: 'On-Track', mentorId: 'em1' },
];

export const milestones = [
  { label: 'Application Approved', date: 'May 2026' },
  { label: 'Mentor Assigned', date: 'May 2026' },
  { label: 'Market Validation Done', date: 'Jun 2026' },
  { label: 'Pilot Home Launch', date: 'Aug 2026' },
  { label: 'Expansion Review', date: 'Oct 2026' },
];

export const pnlData = [
  { quarter: 'Q1', revenue: 40000, profit: 8000 },
  { quarter: 'Q2', revenue: 65000, profit: 15000 },
  { quarter: 'Q3', revenue: 88000, profit: 22000 },
  { quarter: 'Q4', revenue: 112000, profit: 31000 },
];

export const monitoringProject = {
  name: 'SeniCare Living',
  owner: 'Ali Rahman',
  status: 'On Track',
  mentor: 'Dr. Aminah Basri',
  currentMilestone: 2,
  runway: '8.5 months',
  burn: 'RM 18k / month',
  nextReview: '24 Jun 2026',
  highlights: [
    'Pilot home lease terms approved by landlord',
    'First caregiver hiring batch shortlisted',
    'Family interview list reached 46 qualified leads',
  ],
};
