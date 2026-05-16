from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import (
    Application, FinancialRecord, MatchingResult,
    MentorProfile, Organization, ProjectMilestone, StartupProfile, User,
)
from routers.auth import get_current_user
from schemas import (
    FinancialRecordOut, StartupHealthOut,
    StartupProfileCreate, StartupProfileOut,
)

router = APIRouter(prefix="/startups", tags=["startups"])


@router.post("", response_model=StartupProfileOut, status_code=201)
def create_startup(
    body: StartupProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    org_id = current_user.organization_id
    if not org_id:
        org = Organization(name=body.startup_name, type="startup", industry=body.industry)
        db.add(org)
        db.flush()
        org_id = org.id

    startup = StartupProfile(
        organization_id=org_id,
        founder_user_id=current_user.id,
        startup_name=body.startup_name,
        business_summary=body.business_summary,
        industry=body.industry,
        business_stage=body.business_stage,
        problem_statement=body.problem_statement,
        solution_summary=body.solution_summary,
        target_market=body.target_market,
        business_model=body.business_model,
        monthly_revenue=body.monthly_revenue or 0,
        funding_needed=body.funding_needed,
        team_size=body.team_size,
    )
    db.add(startup)
    db.commit()
    db.refresh(startup)
    return startup


@router.get("/{startup_id}/health", response_model=StartupHealthOut)
def get_health(
    startup_id: str,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    startup = db.query(StartupProfile).filter(StartupProfile.id == startup_id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")

    owner = db.query(User).filter(User.id == startup.founder_user_id).first()

    milestones = (
        db.query(ProjectMilestone)
        .filter(ProjectMilestone.startup_profile_id == startup_id)
        .order_by(ProjectMilestone.target_date)
        .all()
    )

    current_idx = next(
        (i for i, m in enumerate(milestones) if m.status in ("in_progress", "not_started")),
        len(milestones),
    )

    # Find assigned mentor via the most recent assigned application
    mentor_name = None
    latest_app = (
        db.query(Application)
        .filter(Application.startup_profile_id == startup_id, Application.status == "assigned_mentor")
        .order_by(Application.created_at.desc())
        .first()
    )
    if latest_app:
        match = (
            db.query(MatchingResult)
            .filter(
                MatchingResult.application_id == latest_app.id,
                MatchingResult.selected_by_cradle == True,
            )
            .first()
        )
        if match:
            mp = db.query(MentorProfile).filter(MentorProfile.id == match.mentor_profile_id).first()
            if mp:
                mu = db.query(User).filter(User.id == mp.user_id).first()
                mentor_name = mu.name if mu else None

    # Compute runway + burn from existing fields
    monthly_rev = float(startup.monthly_revenue or 0)
    funding = float(startup.funding_needed or 0)
    if monthly_rev > 0 and funding > 0:
        runway_str = f"{int(funding / monthly_rev)} months"
        burn_str = f"RM {int(monthly_rev):,}/mo"
    else:
        runway_str = "N/A"
        burn_str = "N/A"

    # Highlights: prefer AI summaries, fall back to in-progress milestone titles
    highlights = [m.ai_summary for m in milestones if m.ai_summary][:5]
    if not highlights:
        highlights = [m.title for m in milestones if m.status == "in_progress"]

    # Next review = earliest pending/delayed milestone target date
    next_review = next(
        (m.target_date.isoformat() for m in milestones if m.status in ("not_started", "in_progress", "delayed") and m.target_date),
        None,
    )

    delayed_count = sum(1 for m in milestones if m.status in ("delayed", "blocked"))
    health_status = "on_track" if delayed_count == 0 else ("at_risk" if delayed_count == 1 else "delayed")

    return StartupHealthOut(
        startup_name=startup.startup_name,
        owner=owner.name if owner else None,
        status=health_status,
        mentor=mentor_name,
        current_milestone_index=current_idx,
        runway=runway_str,
        burn=burn_str,
        next_review=next_review,
        highlights=highlights,
    )


@router.get("/{startup_id}/financials", response_model=list[FinancialRecordOut])
def get_financials(
    startup_id: str,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    startup = db.query(StartupProfile).filter(StartupProfile.id == startup_id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")

    records = (
        db.query(FinancialRecord)
        .filter(FinancialRecord.startup_profile_id == startup_id)
        .order_by(FinancialRecord.quarter)
        .all()
    )
    if records:
        return records

    # Derive quarterly estimates from monthly_revenue when no records exist
    base = float(startup.monthly_revenue or 0) * 3
    return [
        FinancialRecordOut(quarter="Q1 2025", revenue=Decimal(str(round(base * 0.70, 2))), profit=Decimal(str(round(base * 0.70 * 0.10, 2)))),
        FinancialRecordOut(quarter="Q2 2025", revenue=Decimal(str(round(base * 0.85, 2))), profit=Decimal(str(round(base * 0.85 * 0.12, 2)))),
        FinancialRecordOut(quarter="Q3 2025", revenue=Decimal(str(round(base * 1.00, 2))), profit=Decimal(str(round(base * 0.15, 2)))),
        FinancialRecordOut(quarter="Q4 2025", revenue=Decimal(str(round(base * 1.20, 2))), profit=Decimal(str(round(base * 1.20 * 0.18, 2)))),
    ]
