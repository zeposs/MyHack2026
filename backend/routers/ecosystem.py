from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Application, MatchingResult, MentorProfile, StartupProfile, User
from routers.auth import get_current_user
from schemas import EcosystemGraph, EcosystemLink, EcosystemMentorNode, EcosystemParticipantNode

router = APIRouter(prefix="/ecosystem", tags=["ecosystem"])


@router.get("/graph", response_model=EcosystemGraph)
def get_graph(db: Session = Depends(get_db), _=Depends(get_current_user)):
    # Selected matches + high-scoring candidates (>= 70) as potential links
    selected = db.query(MatchingResult).filter(MatchingResult.selected_by_cradle == True).all()
    high_score = (
        db.query(MatchingResult)
        .filter(MatchingResult.match_score >= 70, MatchingResult.selected_by_cradle == False)
        .all()
    )
    all_results = selected + high_score

    mentor_ids = {r.mentor_profile_id for r in all_results}
    app_ids = {r.application_id for r in all_results}

    # Build mentor nodes
    mentor_nodes: list[EcosystemMentorNode] = []
    seen_mentors: set[str] = set()
    for mid in mentor_ids:
        if mid in seen_mentors:
            continue
        mentor = db.query(MentorProfile).filter(MentorProfile.id == mid).first()
        if not mentor:
            continue
        user = db.query(User).filter(User.id == mentor.user_id).first()
        mentor_nodes.append(EcosystemMentorNode(
            id=mid,
            name=user.name if user else "Unknown",
            sector=(mentor.industries or [])[0] if mentor.industries else None,
            status="active" if mentor.availability_status != "unavailable" else "inactive",
        ))
        seen_mentors.add(mid)

    # Build participant nodes (keyed by startup_profile_id to deduplicate)
    participant_nodes: list[EcosystemParticipantNode] = []
    seen_startups: set[str] = set()
    app_to_startup: dict[str, str] = {}

    for app_id in app_ids:
        app = db.query(Application).filter(Application.id == app_id).first()
        if not app:
            continue
        startup_id = app.startup_profile_id
        app_to_startup[app_id] = startup_id
        if startup_id in seen_startups:
            continue
        startup = db.query(StartupProfile).filter(StartupProfile.id == startup_id).first()
        if not startup:
            continue
        summary = startup.business_summary or ""
        participant_nodes.append(EcosystemParticipantNode(
            id=startup_id,
            name=startup.startup_name,
            project=summary[:60] + "..." if len(summary) > 60 else summary,
            sector=startup.industry,
            status="inactive" if app.status == "rejected" else "active",
        ))
        seen_startups.add(startup_id)

    # Build links
    links: list[EcosystemLink] = []
    seen_links: set[tuple] = set()
    for r in all_results:
        startup_id = app_to_startup.get(r.application_id)
        if not startup_id:
            continue
        key = (r.mentor_profile_id, startup_id)
        if key in seen_links:
            continue
        if r.mentor_profile_id in seen_mentors and startup_id in seen_startups:
            links.append(EcosystemLink(
                mentor_id=r.mentor_profile_id,
                participant_id=startup_id,
                strength=float(r.match_score or 0),
            ))
            seen_links.add(key)

    return EcosystemGraph(mentors=mentor_nodes, participants=participant_nodes, links=links)
