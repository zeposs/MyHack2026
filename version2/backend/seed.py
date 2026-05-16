"""
Run once to populate the database with demo data.
Usage:  python seed.py
"""
import sys
import bcrypt
from datetime import date, datetime
from database import SessionLocal, Base, engine
from models import (
    Organization, User, Programme, StartupProfile,
    MentorProfile, Application, MatchingResult, ProjectMilestone
)

Base.metadata.create_all(bind=engine)


def _hash(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


db = SessionLocal()


def run():
    if db.query(User).count() > 0:
        print("Database already seeded. Skipping.")
        sys.exit(0)

    # --- Organizations ---
    org_cradle = Organization(
        id="org-cradle-001",
        name="Cradle Fund Sdn Bhd",
        type="cradle",
        industry="Government",
        country="Malaysia",
        city="Kuala Lumpur",
        description="Malaysia's national startup catalyst and funding agency",
    )
    org_ali = Organization(
        id="org-ali-001",
        name="Ali FoodTech Sdn Bhd",
        type="startup",
        industry="FoodTech",
        country="Malaysia",
        city="Shah Alam",
        description="QR ordering and inventory tracking for small food vendors",
    )
    org_mentor_a = Organization(
        id="org-mentor-a",
        name="Nexus Ventures",
        type="mentor_company",
        industry="SaaS / Venture",
        country="Malaysia",
        city="Kuala Lumpur",
    )
    org_mentor_b = Organization(
        id="org-mentor-b",
        name="Growth Partners Asia",
        type="mentor_company",
        industry="F&B / Growth",
        country="Malaysia",
        city="Petaling Jaya",
    )
    org_mentor_c = Organization(
        id="org-mentor-c",
        name="DeepTech Lab",
        type="mentor_company",
        industry="AI / Automation",
        country="Malaysia",
        city="Cyberjaya",
    )
    db.add_all([org_cradle, org_ali, org_mentor_a, org_mentor_b, org_mentor_c])
    db.flush()

    # --- Users ---
    admin = User(
        id="user-admin-001",
        organization_id=org_cradle.id,
        name="Siti Rahimah",
        email="admin@cradle.com.my",
        password_hash=_hash("admin1234"),
        role="cradle_admin",
        status="active",
    )
    ali = User(
        id="user-ali-001",
        organization_id=org_ali.id,
        name="Ali Hassan",
        email="ali@foodtech.my",
        password_hash=_hash("founder1234"),
        role="founder",
        status="active",
    )
    mentor_a_user = User(
        id="user-mentor-a",
        organization_id=org_mentor_a.id,
        name="Priya Nair",
        email="priya@nexusventures.my",
        password_hash=_hash("mentor1234"),
        role="mentor",
        status="active",
    )
    mentor_b_user = User(
        id="user-mentor-b",
        organization_id=org_mentor_b.id,
        name="Farid Rahman",
        email="farid@growthpartners.my",
        password_hash=_hash("mentor1234"),
        role="mentor",
        status="active",
    )
    mentor_c_user = User(
        id="user-mentor-c",
        organization_id=org_mentor_c.id,
        name="Kevin Tan",
        email="kevin@deeptechlab.my",
        password_hash=_hash("mentor1234"),
        role="mentor",
        status="active",
    )
    db.add_all([admin, ali, mentor_a_user, mentor_b_user, mentor_c_user])
    db.flush()

    # --- Programme ---
    programme = Programme(
        id="prog-cradle-2026",
        name="Cradle Fund Seeding 2026",
        description=(
            "Annual seed funding programme for early-stage Malaysian startups. "
            "Up to RM 150,000 in non-dilutive funding plus 6-month mentorship."
        ),
        programme_type="funding",
        start_date=date(2026, 1, 15),
        end_date=date(2026, 7, 31),
        status="open",
        created_by=admin.id,
    )
    db.add(programme)
    db.flush()

    # --- Startup Profile ---
    startup = StartupProfile(
        id="startup-ali-001",
        organization_id=org_ali.id,
        founder_user_id=ali.id,
        startup_name="Ali FoodTech",
        business_summary=(
            "A QR-based ordering and inventory management platform for small food vendors in Malaysia. "
            "Reduces order errors by 60% and automates low-stock alerts."
        ),
        industry="FoodTech",
        business_stage="mvp",
        problem_statement=(
            "Small food vendors in Malaysia struggle with manual ordering, inventory tracking, "
            "and digital payment reconciliation — causing daily losses and missed revenue."
        ),
        solution_summary=(
            "QR table ordering + real-time inventory dashboard + WhatsApp payment link. "
            "Works on any smartphone without additional hardware."
        ),
        target_market="SME food vendors and hawker stalls in Klang Valley and Selangor",
        business_model="SaaS subscription at RM 89/month per outlet. Setup fee RM 299.",
        monthly_revenue=4500,
        funding_needed=150000,
        team_size=3,
    )
    db.add(startup)
    db.flush()

    # --- Mentor Profiles ---
    mentor_a = MentorProfile(
        id="mentor-a-001",
        user_id=mentor_a_user.id,
        organization_id=org_mentor_a.id,
        title="Startup Coach & SaaS Product Strategist",
        bio=(
            "Former VP Product at 2 SaaS exits. Helped 12 early-stage startups sharpen "
            "MVP positioning and improve onboarding. Deep UX background."
        ),
        expertise_summary="MVP strategy, UX, early-stage SaaS, product-market fit, fundraising",
        years_experience=14,
        industries=["SaaS", "EdTech", "FoodTech", "HR Tech"],
        skills=["product strategy", "UX design", "MVP scoping", "fundraising", "pitch coaching"],
        preferred_startup_stage=["idea", "prototype", "mvp"],
        average_rating=4.8,
        total_sessions=27,
        availability_status="available",
    )
    mentor_b = MentorProfile(
        id="mentor-b-001",
        user_id=mentor_b_user.id,
        organization_id=org_mentor_b.id,
        title="Growth & Go-to-Market Expert (F&B)",
        bio=(
            "Ex-Regional Growth Lead at Grab Food. Built merchant acquisition programmes "
            "across SEA. Specialist in F&B digital transformation and SME growth."
        ),
        expertise_summary="Go-to-market, F&B operations, merchant acquisition, growth hacking, partnerships",
        years_experience=11,
        industries=["F&B", "FoodTech", "Ecommerce", "Logistics"],
        skills=["go-to-market", "merchant partnerships", "growth hacking", "digital marketing", "operations"],
        preferred_startup_stage=["mvp", "revenue", "growth"],
        average_rating=4.5,
        total_sessions=19,
        availability_status="limited",
    )
    mentor_c = MentorProfile(
        id="mentor-c-001",
        user_id=mentor_c_user.id,
        organization_id=org_mentor_c.id,
        title="Deep Tech & AI Automation Architect",
        bio=(
            "AI researcher turned entrepreneur. Built 3 automation products in manufacturing "
            "and logistics. Experienced with ML pipelines, IoT integration, and tech architecture."
        ),
        expertise_summary="AI/ML, automation, tech architecture, IoT, system design",
        years_experience=9,
        industries=["AI", "Manufacturing", "Logistics", "PropTech"],
        skills=["AI/ML", "system architecture", "automation", "IoT", "Python", "cloud infrastructure"],
        preferred_startup_stage=["prototype", "mvp"],
        average_rating=4.3,
        total_sessions=11,
        availability_status="available",
    )
    db.add_all([mentor_a, mentor_b, mentor_c])
    db.flush()

    # --- Application ---
    application = Application(
        id="app-ali-2026",
        programme_id=programme.id,
        startup_profile_id=startup.id,
        applicant_user_id=ali.id,
        application_title="Ali FoodTech — Cradle Fund Seeding 2026 Application",
        application_summary=(
            "Ali FoodTech is seeking RM 150,000 in seed funding to scale its QR-based ordering "
            "platform across 200 food vendor outlets in Klang Valley by Q3 2026. "
            "Current MRR is RM 4,500 with 3 paying pilot merchants."
        ),
        requested_amount=150000,
        status="submitted",
    )
    db.add(application)
    db.flush()

    # --- Seeded Matching Results (pre-generated for demo) ---
    match_a = MatchingResult(
        id="match-a-001",
        application_id=application.id,
        mentor_profile_id=mentor_a.id,
        rank_position=1,
        match_score=94.00,
        confidence_score=91.00,
        reason_summary=(
            "Priya has directly helped 3 FoodTech and SaaS MVPs improve onboarding and product clarity. "
            "Her UX and product strategy background aligns tightly with Ali FoodTech's current stage. "
            "Available immediately and prefers early-stage startups."
        ),
        skill_match_score=95.00,
        industry_match_score=88.00,
        stage_match_score=100.00,
        availability_score=100.00,
        past_feedback_score=96.00,
        goal_fit_score=90.00,
        ai_model_name="gemini-1.5-flash",
        selected_by_cradle=False,
    )
    match_b = MatchingResult(
        id="match-b-001",
        application_id=application.id,
        mentor_profile_id=mentor_b.id,
        rank_position=2,
        match_score=89.00,
        confidence_score=85.00,
        reason_summary=(
            "Farid's F&B and merchant acquisition expertise is directly relevant to Ali FoodTech's "
            "go-to-market challenge of onboarding hawker stalls at scale. "
            "Availability is limited this month but strong fit for growth phase."
        ),
        skill_match_score=80.00,
        industry_match_score=98.00,
        stage_match_score=85.00,
        availability_score=50.00,
        past_feedback_score=90.00,
        goal_fit_score=92.00,
        ai_model_name="gemini-1.5-flash",
        selected_by_cradle=False,
    )
    match_c = MatchingResult(
        id="match-c-001",
        application_id=application.id,
        mentor_profile_id=mentor_c.id,
        rank_position=3,
        match_score=86.00,
        confidence_score=80.00,
        reason_summary=(
            "Kevin's automation and AI architecture skills could significantly accelerate "
            "Ali FoodTech's inventory automation feature. "
            "Less aligned on go-to-market but strong technical depth for product scaling."
        ),
        skill_match_score=75.00,
        industry_match_score=72.00,
        stage_match_score=90.00,
        availability_score=100.00,
        past_feedback_score=86.00,
        goal_fit_score=82.00,
        ai_model_name="gemini-1.5-flash",
        selected_by_cradle=False,
    )
    db.add_all([match_a, match_b, match_c])

    # Update application status to reflect pre-generated matches
    application.status = "ai_reviewed"

    # --- Project Milestones ---
    milestones = [
        ProjectMilestone(
            startup_profile_id=startup.id,
            application_id=application.id,
            title="Complete MVP prototype",
            description="Finalise QR ordering + inventory dashboard + WhatsApp payment integration",
            milestone_type="product",
            target_date=date(2026, 3, 31),
            status="completed",
            progress_percentage=100,
            completed_date=date(2026, 3, 20),
            ai_risk_signal="low",
            ai_summary="Completed 11 days ahead of schedule. Core features validated with 3 pilot merchants.",
        ),
        ProjectMilestone(
            startup_profile_id=startup.id,
            application_id=application.id,
            title="Acquire 10 pilot merchants",
            description="Sign up 10 paying food vendor outlets in Klang Valley",
            milestone_type="customer",
            target_date=date(2026, 5, 31),
            status="in_progress",
            progress_percentage=30,
            ai_risk_signal="medium",
            ai_summary="3 of 10 merchants onboarded. Pace is slower than projected — recommend go-to-market mentor review.",
        ),
        ProjectMilestone(
            startup_profile_id=startup.id,
            application_id=application.id,
            title="Generate first RM 5,000 monthly transaction volume",
            description="Achieve RM 5,000 in monthly recurring revenue through subscriptions",
            milestone_type="revenue",
            target_date=date(2026, 7, 31),
            status="not_started",
            progress_percentage=0,
            ai_risk_signal="high",
            ai_summary="Not yet started. Dependent on merchant acquisition milestone. High risk if acquisition target is missed.",
        ),
    ]
    db.add_all(milestones)

    db.commit()
    print("Seed data inserted successfully.")
    print()
    print("Demo accounts:")
    print("  Admin:    admin@cradle.com.my   / admin1234")
    print("  Founder:  ali@foodtech.my       / founder1234")
    print("  Mentor A: priya@nexusventures.my / mentor1234")
    print()
    print("Application ID:", application.id)
    print("Startup ID:    ", startup.id)


if __name__ == "__main__":
    run()
