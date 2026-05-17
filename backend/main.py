from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine, settings
from routers import auth, applications, mentors, matching, milestones, dashboard
from routers import programmes, sessions, ecosystem, startups

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="StarsConnector API",
    description="AI-powered mentor matching for Cradle startup programmes",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(applications.router)
app.include_router(mentors.router)
app.include_router(matching.router)
app.include_router(milestones.router)
app.include_router(programmes.router)
app.include_router(sessions.router)
app.include_router(ecosystem.router)
app.include_router(startups.router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "StarsConnector API"}
