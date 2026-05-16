from datetime import datetime, date
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, EmailStr


# --- Auth ---

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserMe(BaseModel):
    id: str
    name: str
    email: str
    role: str
    organization_id: Optional[str] = None

    class Config:
        from_attributes = True


# --- Organization ---

class OrganizationOut(BaseModel):
    id: str
    name: str
    type: str
    industry: Optional[str] = None
    country: str
    city: Optional[str] = None

    class Config:
        from_attributes = True


# --- Programme ---

class ProgrammeOut(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    programme_type: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: str

    class Config:
        from_attributes = True


# --- Startup Profile ---

class StartupProfileOut(BaseModel):
    id: str
    startup_name: str
    business_summary: str
    industry: Optional[str] = None
    business_stage: Optional[str] = None
    problem_statement: Optional[str] = None
    solution_summary: Optional[str] = None
    target_market: Optional[str] = None
    funding_needed: Optional[Decimal] = None
    monthly_revenue: Optional[Decimal] = None
    team_size: int

    class Config:
        from_attributes = True


# --- Mentor Profile ---

class MentorProfileOut(BaseModel):
    id: str
    user_id: str
    title: Optional[str] = None
    bio: Optional[str] = None
    expertise_summary: Optional[str] = None
    years_experience: Optional[int] = None
    industries: Optional[list] = None
    skills: Optional[list] = None
    preferred_startup_stage: Optional[list] = None
    average_rating: Optional[Decimal] = None
    total_sessions: int
    availability_status: str

    class Config:
        from_attributes = True

class MentorDetail(MentorProfileOut):
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    organization_name: Optional[str] = None


# --- Application ---

class ApplicationOut(BaseModel):
    id: str
    programme_id: str
    startup_profile_id: str
    applicant_user_id: str
    application_title: str
    application_summary: Optional[str] = None
    requested_amount: Optional[Decimal] = None
    status: str
    ai_summary: Optional[str] = None
    ai_risk_level: Optional[str] = None
    ai_recommendation: Optional[str] = None
    ai_confidence_score: Optional[Decimal] = None
    reviewed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ApplicationDetail(ApplicationOut):
    startup_name: Optional[str] = None
    programme_name: Optional[str] = None
    applicant_name: Optional[str] = None

class ApplicationStatusUpdate(BaseModel):
    status: str
    # submitted, ai_reviewed, shortlisted, approved, rejected, assigned_mentor


# --- Matching Results ---

class MatchingResultOut(BaseModel):
    id: str
    mentor_profile_id: str
    rank_position: int
    match_score: Decimal
    confidence_score: Optional[Decimal] = None
    reason_summary: str
    skill_match_score: Decimal
    industry_match_score: Decimal
    stage_match_score: Decimal
    availability_score: Decimal
    past_feedback_score: Decimal
    goal_fit_score: Decimal
    ai_model_name: Optional[str] = None
    selected_by_cradle: bool
    mentor_name: Optional[str] = None
    mentor_title: Optional[str] = None
    mentor_availability: Optional[str] = None

    class Config:
        from_attributes = True

class SelectMentorRequest(BaseModel):
    mentor_profile_id: str


# --- Milestones ---

class MilestoneOut(BaseModel):
    id: str
    startup_profile_id: str
    title: str
    description: Optional[str] = None
    milestone_type: Optional[str] = None
    target_date: Optional[date] = None
    completed_date: Optional[date] = None
    status: str
    progress_percentage: int
    ai_risk_signal: Optional[str] = None
    ai_summary: Optional[str] = None

    class Config:
        from_attributes = True


# --- Dashboard ---

class DashboardStats(BaseModel):
    total_applications: int
    pending_review: int
    approved: int
    total_mentors: int
    active_programmes: int
    matches_generated: int


# --- Create requests ---

class StartupProfileCreate(BaseModel):
    startup_name: str
    business_summary: str
    industry: Optional[str] = None
    business_stage: Optional[str] = None
    problem_statement: Optional[str] = None
    solution_summary: Optional[str] = None
    target_market: Optional[str] = None
    business_model: Optional[str] = None
    monthly_revenue: Optional[Decimal] = None
    funding_needed: Optional[Decimal] = None
    team_size: int = 1


class ApplicationCreate(BaseModel):
    programme_id: str
    startup_profile_id: str
    application_title: str
    application_summary: Optional[str] = None
    requested_amount: Optional[Decimal] = None


# --- Sessions ---

class MentorSessionCreate(BaseModel):
    mentor_profile_id: str
    scheduled_at: datetime
    notes: Optional[str] = None


class MentorSessionOut(BaseModel):
    id: str
    application_id: str
    mentor_profile_id: str
    startup_profile_id: str
    scheduled_at: datetime
    status: str
    notes: Optional[str] = None
    mentor_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# --- Ecosystem ---

class EcosystemMentorNode(BaseModel):
    id: str
    name: str
    sector: Optional[str] = None
    status: str


class EcosystemParticipantNode(BaseModel):
    id: str
    name: str
    project: str
    sector: Optional[str] = None
    status: str


class EcosystemLink(BaseModel):
    mentor_id: str
    participant_id: str
    strength: float


class EcosystemGraph(BaseModel):
    mentors: list[EcosystemMentorNode]
    participants: list[EcosystemParticipantNode]
    links: list[EcosystemLink]


# --- Startup health & financials ---

class StartupHealthOut(BaseModel):
    startup_name: str
    owner: Optional[str] = None
    status: str
    mentor: Optional[str] = None
    current_milestone_index: int
    runway: str
    burn: str
    next_review: Optional[str] = None
    highlights: list[str]


class FinancialRecordOut(BaseModel):
    quarter: str
    revenue: Decimal
    profit: Decimal

    class Config:
        from_attributes = True
