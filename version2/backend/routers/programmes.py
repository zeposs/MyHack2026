from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Programme
from routers.auth import get_current_user
from schemas import ProgrammeOut

router = APIRouter(prefix="/programmes", tags=["programmes"])


@router.get("", response_model=list[ProgrammeOut])
def list_programmes(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return (
        db.query(Programme)
        .filter(Programme.status.in_(["open", "reviewing", "active"]))
        .order_by(Programme.start_date)
        .all()
    )
