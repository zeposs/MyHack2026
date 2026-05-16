from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Application, MatchingResult, MentorProfile, StartupProfile, User
from routers.auth import get_current_user
from schemas import MatchingResultOut, SelectMentorRequest
from services.gemini import rank_mentors

router = APIRouter(prefix="/applications", tags=["matching"])


def _build_mentor_dict(m: MentorProfile, db: Session) -> dict:
    user = db.query(User).filter(User.id == m.user_id).first()
    return {
        "mentor_profile_id": m.id,
        "name": user.name if user else "Unknown",
        "title": m.title,
        "bio": m.bio,
        "expertise_summary": m.expertise_summary,
        "years_experience": m.years_experience,
        "industries": m.industries or [],
        "skills": m.skills or [],
        "preferred_startup_stage": m.preferred_startup_stage or [],
        "average_rating": float(m.average_rating or 0),
        "total_sessions": m.total_sessions,
        "availability_status": m.availability_status,
    }


def _enrich_result(r: MatchingResult, db: Session) -> MatchingResultOut:
    mentor = db.query(MentorProfile).filter(MentorProfile.id == r.mentor_profile_id).first()
    user = db.query(User).filter(User.id == mentor.user_id).first() if mentor else None
    return MatchingResultOut(
        **{c.name: getattr(r, c.name) for c in r.__table__.columns},
        mentor_name=user.name if user else None,
        mentor_title=mentor.title if mentor else None,
        mentor_availability=mentor.availability_status if mentor else None,
    )


@router.post("/{application_id}/generate-matches", response_model=list[MatchingResultOut])
async def generate_matches(
    application_id: str,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    startup = db.query(StartupProfile).filter(StartupProfile.id == app.startup_profile_id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup profile not found")

    mentors = db.query(MentorProfile).filter(
        MentorProfile.availability_status != "unavailable"
    ).all()
    if not mentors:
        raise HTTPException(status_code=422, detail="No available mentors to match")

    startup_dict = {
        "startup_name": startup.startup_name,
        "industry": startup.industry,
        "business_stage": startup.business_stage,
        "problem_statement": startup.problem_statement,
        "solution_summary": startup.solution_summary,
        "target_market": startup.target_market,
        "funding_needed": str(startup.funding_needed or 0),
    }
    mentor_dicts = [_build_mentor_dict(m, db) for m in mentors]

    try:
        ranked = await rank_mentors(startup_dict, mentor_dicts)
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"AI service unavailable: {exc}")

    # Clear previous matches for this application
    db.query(MatchingResult).filter(MatchingResult.application_id == application_id).delete()

    records = []
    for r in ranked:
        record = MatchingResult(
            application_id=application_id,
            mentor_profile_id=r["mentor_profile_id"],
            rank_position=r["rank_position"],
            match_score=r["match_score"],
            confidence_score=r.get("confidence_score"),
            reason_summary=r["reason_summary"],
            skill_match_score=r.get("skill_match_score", 0),
            industry_match_score=r.get("industry_match_score", 0),
            stage_match_score=r.get("stage_match_score", 0),
            availability_score=r.get("availability_score", 0),
            past_feedback_score=r.get("past_feedback_score", 0),
            goal_fit_score=r.get("goal_fit_score", 0),
            ai_model_name=r.get("ai_model_name"),
        )
        db.add(record)
        records.append(record)

    app.status = "ai_reviewed"
    db.commit()
    for rec in records:
        db.refresh(rec)

    return [_enrich_result(rec, db) for rec in records]


@router.get("/{application_id}/matches", response_model=list[MatchingResultOut])
def get_matches(
    application_id: str,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    results = (
        db.query(MatchingResult)
        .filter(MatchingResult.application_id == application_id)
        .order_by(MatchingResult.rank_position)
        .all()
    )
    return [_enrich_result(r, db) for r in results]


@router.post("/{application_id}/matches/select", response_model=MatchingResultOut)
def select_mentor(
    application_id: str,
    body: SelectMentorRequest,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    from datetime import datetime

    result = (
        db.query(MatchingResult)
        .filter(
            MatchingResult.application_id == application_id,
            MatchingResult.mentor_profile_id == body.mentor_profile_id,
        )
        .first()
    )
    if not result:
        raise HTTPException(status_code=404, detail="Match not found")

    # Deselect all others for this application
    db.query(MatchingResult).filter(MatchingResult.application_id == application_id).update(
        {"selected_by_cradle": False, "selected_at": None}
    )
    result.selected_by_cradle = True
    result.selected_at = datetime.utcnow()

    app = db.query(Application).filter(Application.id == application_id).first()
    if app:
        app.status = "assigned_mentor"

    db.commit()
    db.refresh(result)
    return _enrich_result(result, db)
