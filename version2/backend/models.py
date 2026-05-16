import uuid
from datetime import datetime
from sqlalchemy import (
    Boolean, Column, DateTime, Date, ForeignKey,
    Integer, JSON, Numeric, String, Text
)
from database import Base


def _uuid():
    return str(uuid.uuid4())


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String(36), primary_key=True, default=_uuid)
    name = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)  # cradle, startup, mentor_company, partner
    industry = Column(String(100))
    website_url = Column(Text)
    description = Column(Text)
    country = Column(String(100), default="Malaysia")
    city = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(Text)
    role = Column(String(50), nullable=False)  # cradle_admin, cradle_staff, mentor, founder
    status = Column(String(50), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Programme(Base):
    __tablename__ = "programmes"

    id = Column(String(36), primary_key=True, default=_uuid)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    programme_type = Column(String(100), nullable=False)  # funding, accelerator, bootcamp, grant, mentorship
    start_date = Column(Date)
    end_date = Column(Date)
    status = Column(String(50), default="open")  # draft, open, reviewing, active, completed, archived
    created_by = Column(String(36), ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class StartupProfile(Base):
    __tablename__ = "startup_profiles"

    id = Column(String(36), primary_key=True, default=_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    founder_user_id = Column(String(36), ForeignKey("users.id"))
    startup_name = Column(String(255), nullable=False)
    business_summary = Column(Text, nullable=False)
    industry = Column(String(100))
    business_stage = Column(String(100))  # idea, prototype, mvp, revenue, growth
    problem_statement = Column(Text)
    solution_summary = Column(Text)
    target_market = Column(Text)
    business_model = Column(Text)
    monthly_revenue = Column(Numeric(12, 2), default=0)
    funding_needed = Column(Numeric(12, 2))
    team_size = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class MentorProfile(Base):
    __tablename__ = "mentor_profiles"

    id = Column(String(36), primary_key=True, default=_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id"))
    title = Column(String(255))
    bio = Column(Text)
    expertise_summary = Column(Text)
    years_experience = Column(Integer)
    industries = Column(JSON)           # list of strings
    skills = Column(JSON)               # list of strings
    preferred_startup_stage = Column(JSON)  # list of strings
    average_rating = Column(Numeric(3, 2), default=0)
    total_sessions = Column(Integer, default=0)
    availability_status = Column(String(50), default="available")  # available, limited, unavailable
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Application(Base):
    __tablename__ = "applications"

    id = Column(String(36), primary_key=True, default=_uuid)
    programme_id = Column(String(36), ForeignKey("programmes.id"), nullable=False)
    startup_profile_id = Column(String(36), ForeignKey("startup_profiles.id"), nullable=False)
    applicant_user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    application_title = Column(String(255), nullable=False)
    application_summary = Column(Text)
    requested_amount = Column(Numeric(12, 2))
    status = Column(String(50), default="submitted")
    # submitted, ai_reviewed, shortlisted, approved, rejected, assigned_mentor
    ai_summary = Column(Text)
    ai_risk_level = Column(String(50))   # low, medium, high
    ai_recommendation = Column(Text)
    ai_confidence_score = Column(Numeric(5, 2))
    reviewed_by = Column(String(36), ForeignKey("users.id"))
    reviewed_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class MatchingResult(Base):
    __tablename__ = "matching_results"

    id = Column(String(36), primary_key=True, default=_uuid)
    application_id = Column(String(36), ForeignKey("applications.id"), nullable=False)
    mentor_profile_id = Column(String(36), ForeignKey("mentor_profiles.id"), nullable=False)
    rank_position = Column(Integer, nullable=False)
    match_score = Column(Numeric(5, 2), nullable=False)
    confidence_score = Column(Numeric(5, 2))
    reason_summary = Column(Text, nullable=False)
    skill_match_score = Column(Numeric(5, 2), default=0)
    industry_match_score = Column(Numeric(5, 2), default=0)
    stage_match_score = Column(Numeric(5, 2), default=0)
    availability_score = Column(Numeric(5, 2), default=0)
    past_feedback_score = Column(Numeric(5, 2), default=0)
    goal_fit_score = Column(Numeric(5, 2), default=0)
    ai_model_name = Column(String(100))
    selected_by_cradle = Column(Boolean, default=False)
    selected_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)


class ProjectMilestone(Base):
    __tablename__ = "project_milestones"

    id = Column(String(36), primary_key=True, default=_uuid)
    startup_profile_id = Column(String(36), ForeignKey("startup_profiles.id"), nullable=False)
    application_id = Column(String(36), ForeignKey("applications.id"))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    milestone_type = Column(String(100))  # product, revenue, customer, partnership, funding, compliance
    target_date = Column(Date)
    completed_date = Column(Date)
    status = Column(String(50), default="not_started")
    # not_started, in_progress, completed, delayed, blocked
    progress_percentage = Column(Integer, default=0)
    evidence_url = Column(Text)
    ai_risk_signal = Column(String(50))  # low, medium, high
    ai_summary = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
