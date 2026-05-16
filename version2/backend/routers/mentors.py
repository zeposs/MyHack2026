from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import MentorProfile, Organization, User
from routers.auth import get_current_user
from schemas import MentorDetail, MentorProfileOut

router = APIRouter(prefix="/mentors", tags=["mentors"])


def _enrich(m: MentorProfile, db: Session) -> MentorDetail:
    user = db.query(User).filter(User.id == m.user_id).first()
    org = db.query(Organization).filter(Organization.id == m.organization_id).first() if m.organization_id else None
    return MentorDetail(
        **{c.name: getattr(m, c.name) for c in m.__table__.columns},
        user_name=user.name if user else None,
        user_email=user.email if user else None,
        organization_name=org.name if org else None,
    )


@router.get("", response_model=list[MentorDetail])
def list_mentors(db: Session = Depends(get_db), _=Depends(get_current_user)):
    mentors = db.query(MentorProfile).all()
    return [_enrich(m, db) for m in mentors]


@router.get("/{mentor_id}", response_model=MentorDetail)
def get_mentor(mentor_id: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    m = db.query(MentorProfile).filter(MentorProfile.id == mentor_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Mentor not found")
    return _enrich(m, db)
