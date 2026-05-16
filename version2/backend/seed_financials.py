"""
Seed quarterly financial records for startup-ali-001.
Safe to run multiple times — skips if records already exist.
Usage: python seed_financials.py
"""
from database import SessionLocal, Base, engine
from models import FinancialRecord
from decimal import Decimal

Base.metadata.create_all(bind=engine)

db = SessionLocal()

STARTUP_ID = "startup-ali-001"

QUARTERS = [
    ("Q1 2025", 12_000,  -14_000),
    ("Q2 2025", 28_000,   -3_000),
    ("Q3 2025", 48_000,    9_500),
    ("Q4 2025", 67_000,   16_000),
]

existing = db.query(FinancialRecord).filter(
    FinancialRecord.startup_profile_id == STARTUP_ID
).count()

if existing:
    print(f"Financial records already exist ({existing} rows). Skipping.")
else:
    for quarter, revenue, profit in QUARTERS:
        db.add(FinancialRecord(
            startup_profile_id=STARTUP_ID,
            quarter=quarter,
            revenue=Decimal(str(revenue)),
            profit=Decimal(str(profit)),
        ))
    db.commit()
    print(f"Seeded {len(QUARTERS)} quarterly financial records for {STARTUP_ID}.")
    for q, r, p in QUARTERS:
        print(f"  {q}: revenue=RM {r:,}  profit=RM {p:,}")

db.close()
