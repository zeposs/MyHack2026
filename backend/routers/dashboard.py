from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Application, MentorProfile, MatchingResult, Programme
from routers.auth import get_current_user
from schemas import DashboardStats

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
def get_stats(db: Session = Depends(get_db), _=Depends(get_current_user)):
    total_applications = db.query(Application).count()
    pending_review = db.query(Application).filter(
        Application.status.in_(["submitted", "ai_reviewed"])
    ).count()
    approved = db.query(Application).filter(
        Application.status.in_(["approved", "assigned_mentor"])
    ).count()
    total_mentors = db.query(MentorProfile).count()
    active_programmes = db.query(Programme).filter(
        Programme.status.in_(["open", "reviewing", "active"])
    ).count()
    matches_generated = db.query(MatchingResult).count()

    return DashboardStats(
        total_applications=total_applications,
        pending_review=pending_review,
        approved=approved,
        total_mentors=total_mentors,
        active_programmes=active_programmes,
        matches_generated=matches_generated,
    )
