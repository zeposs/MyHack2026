from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Application, Programme, StartupProfile, User
from routers.auth import get_current_user
from schemas import ApplicationCreate, ApplicationDetail, ApplicationOut, ApplicationStatusUpdate

router = APIRouter(prefix="/applications", tags=["applications"])

VALID_STATUSES = {
    "submitted", "ai_reviewed", "shortlisted", "approved", "rejected", "assigned_mentor"
}


def _enrich(app: Application, db: Session) -> ApplicationDetail:
    startup = db.query(StartupProfile).filter(StartupProfile.id == app.startup_profile_id).first()
    programme = db.query(Programme).filter(Programme.id == app.programme_id).first()
    applicant = db.query(User).filter(User.id == app.applicant_user_id).first()
    return ApplicationDetail(
        **{c.name: getattr(app, c.name) for c in app.__table__.columns},
        startup_name=startup.startup_name if startup else None,
        programme_name=programme.name if programme else None,
        applicant_name=applicant.name if applicant else None,
    )


@router.post("", response_model=ApplicationDetail, status_code=201)
def create_application(
    body: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    programme = db.query(Programme).filter(Programme.id == body.programme_id).first()
    if not programme:
        raise HTTPException(status_code=404, detail="Programme not found")

    startup = db.query(StartupProfile).filter(StartupProfile.id == body.startup_profile_id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup profile not found")

    app = Application(
        programme_id=body.programme_id,
        startup_profile_id=body.startup_profile_id,
        applicant_user_id=current_user.id,
        application_title=body.application_title,
        application_summary=body.application_summary,
        requested_amount=body.requested_amount,
        status="submitted",
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return _enrich(app, db)


@router.get("", response_model=list[ApplicationDetail])
def list_applications(db: Session = Depends(get_db), _=Depends(get_current_user)):
    apps = db.query(Application).order_by(Application.created_at.desc()).all()
    return [_enrich(a, db) for a in apps]


@router.get("/{application_id}", response_model=ApplicationDetail)
def get_application(application_id: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return _enrich(app, db)


@router.patch("/{application_id}/status", response_model=ApplicationOut)
def update_status(
    application_id: str,
    body: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if body.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Valid: {VALID_STATUSES}")
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.status = body.status
    app.reviewed_by = current_user.id
    db.commit()
    db.refresh(app)
    return app
