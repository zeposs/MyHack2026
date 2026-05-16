from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import ProjectMilestone, StartupProfile
from routers.auth import get_current_user
from schemas import MilestoneOut

router = APIRouter(prefix="/startups", tags=["milestones"])


@router.get("/{startup_id}/milestones", response_model=list[MilestoneOut])
def get_milestones(
    startup_id: str,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    startup = db.query(StartupProfile).filter(StartupProfile.id == startup_id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")

    milestones = (
        db.query(ProjectMilestone)
        .filter(ProjectMilestone.startup_profile_id == startup_id)
        .order_by(ProjectMilestone.target_date)
        .all()
    )
    return milestones
