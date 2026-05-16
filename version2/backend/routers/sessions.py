from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Application, MentorProfile, MentorSession, User
from routers.auth import get_current_user
from schemas import MentorSessionCreate, MentorSessionOut

router = APIRouter(prefix="/applications", tags=["sessions"])


def _enrich(s: MentorSession, db: Session) -> MentorSessionOut:
    mentor = db.query(MentorProfile).filter(MentorProfile.id == s.mentor_profile_id).first()
    user = db.query(User).filter(User.id == mentor.user_id).first() if mentor else None
    return MentorSessionOut(
        **{c.name: getattr(s, c.name) for c in s.__table__.columns},
        mentor_name=user.name if user else None,
    )


@router.post("/{application_id}/sessions", response_model=MentorSessionOut, status_code=201)
def book_session(
    application_id: str,
    body: MentorSessionCreate,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    mentor = db.query(MentorProfile).filter(MentorProfile.id == body.mentor_profile_id).first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")

    session = MentorSession(
        application_id=application_id,
        mentor_profile_id=body.mentor_profile_id,
        startup_profile_id=app.startup_profile_id,
        scheduled_at=body.scheduled_at,
        notes=body.notes,
        status="confirmed",
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return _enrich(session, db)


@router.get("/{application_id}/sessions", response_model=list[MentorSessionOut])
def list_sessions(
    application_id: str,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    sessions = (
        db.query(MentorSession)
        .filter(MentorSession.application_id == application_id)
        .order_by(MentorSession.scheduled_at)
        .all()
    )
    return [_enrich(s, db) for s in sessions]
