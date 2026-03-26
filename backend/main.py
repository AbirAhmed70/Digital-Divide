from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import models, schemas, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="DigiWork API",
    description="Backend API for DigiWork - Digital Skills for Jobs, Jessore, Bangladesh",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ─── Seed workshops on startup ────────────────────────────────────────────────
@app.on_event("startup")
def seed_workshops():
    db = database.SessionLocal()
    if db.query(models.Workshop).count() == 0:
        workshops = [
            models.Workshop(
                title="Professional Email Writing",
                description="Learn to write formal emails that impress employers. We'll practice subject lines, greetings, body structure, and sign-offs using real job scenarios.",
                date="August 10, 2026",
                time="10:00 AM – 12:00 PM",
                location="Jessore University Campus, Room 204",
                seats_total=30,
                seats_filled=12,
                skill_level="Beginner",
                icon="✉️"
            ),
            models.Workshop(
                title="Building Your Digital CV",
                description="Create a standout digital CV using Google Docs and Word. Learn formatting, what employers look for, and how to save and share your CV professionally.",
                date="August 24, 2026",
                time="10:00 AM – 12:00 PM",
                location="Jessore University Campus, Room 204",
                seats_total=30,
                seats_filled=8,
                skill_level="Beginner",
                icon="📄"
            ),
            models.Workshop(
                title="Online Job Searching",
                description="Navigate LinkedIn, Bdjobs, and Indeed like a pro. Learn how to filter jobs, set up alerts, and identify genuine opportunities from scams.",
                date="September 7, 2026",
                time="10:00 AM – 12:00 PM",
                location="Jessore University Campus, Room 204",
                seats_total=30,
                seats_filled=5,
                skill_level="Beginner",
                icon="🔍"
            ),
            models.Workshop(
                title="Video Interviews & Zoom",
                description="Get comfortable with video calls. Practice camera positioning, background setup, audio quality, and how to present yourself professionally on screen.",
                date="September 21, 2026",
                time="10:00 AM – 12:00 PM",
                location="Jessore University Campus, Room 204",
                seats_total=30,
                seats_filled=3,
                skill_level="Intermediate",
                icon="🎥"
            ),
            models.Workshop(
                title="Google Sheets for the Workplace",
                description="Master the basics of spreadsheets. Create budgets, track data, and use formulas that make you valuable to any employer.",
                date="October 5, 2026",
                time="10:00 AM – 12:00 PM",
                location="Jessore University Campus, Room 204",
                seats_total=30,
                seats_filled=2,
                skill_level="Intermediate",
                icon="📊"
            ),
            models.Workshop(
                title="WhatsApp Business for Freelancers",
                description="Turn your smartphone into a business tool. Learn to use WhatsApp Business, manage client conversations, and market your skills digitally.",
                date="October 19, 2026",
                time="10:00 AM – 12:00 PM",
                location="Jessore University Campus, Room 204",
                seats_total=30,
                seats_filled=1,
                skill_level="Beginner",
                icon="💬"
            ),
            models.Workshop(
                title="Freelancing Platforms 101",
                description="Get started on Fiverr and Upwork. Create a profile, write a compelling bio, and land your first client — all from Jessore.",
                date="November 2, 2026",
                time="10:00 AM – 12:00 PM",
                location="Jessore University Campus, Room 204",
                seats_total=30,
                seats_filled=0,
                skill_level="Intermediate",
                icon="💻"
            ),
            models.Workshop(
                title="Digital Safety & Online Scams",
                description="Stay safe online. Recognize phishing, protect your passwords, use mobile banking securely, and avoid digital fraud that targets job seekers.",
                date="November 16, 2026",
                time="10:00 AM – 12:00 PM",
                location="Jessore University Campus, Room 204",
                seats_total=30,
                seats_filled=0,
                skill_level="Beginner",
                icon="🔒"
            ),
        ]
        db.add_all(workshops)
        db.commit()
    db.close()

# ─── Workshops ─────────────────────────────────────────────────────────────────
@app.get("/api/workshops", response_model=List[schemas.WorkshopOut])
def get_workshops(db: Session = Depends(get_db)):
    return db.query(models.Workshop).all()

@app.get("/api/workshops/{workshop_id}", response_model=schemas.WorkshopOut)
def get_workshop(workshop_id: int, db: Session = Depends(get_db)):
    workshop = db.query(models.Workshop).filter(models.Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    return workshop

# ─── Registration ──────────────────────────────────────────────────────────────
@app.post("/api/register", response_model=schemas.RegistrationOut)
def register(data: schemas.RegistrationIn, db: Session = Depends(get_db)):
    workshop = db.query(models.Workshop).filter(models.Workshop.id == data.workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    if workshop.seats_filled >= workshop.seats_total:
        raise HTTPException(status_code=400, detail="Workshop is full")
    existing = db.query(models.Registration).filter(
        models.Registration.email == data.email,
        models.Registration.workshop_id == data.workshop_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You are already registered for this workshop")
    reg = models.Registration(**data.dict())
    workshop.seats_filled += 1
    db.add(reg)
    db.commit()
    db.refresh(reg)
    return reg

# ─── Volunteer ─────────────────────────────────────────────────────────────────
@app.post("/api/volunteer", response_model=schemas.VolunteerOut)
def volunteer(data: schemas.VolunteerIn, db: Session = Depends(get_db)):
    existing = db.query(models.Volunteer).filter(models.Volunteer.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already signed up as a volunteer")
    vol = models.Volunteer(**data.dict())
    db.add(vol)
    db.commit()
    db.refresh(vol)
    return vol

# ─── Contact ───────────────────────────────────────────────────────────────────
@app.post("/api/contact", response_model=schemas.ContactOut)
def contact(data: schemas.ContactIn, db: Session = Depends(get_db)):
    msg = models.Contact(**data.dict())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg

# ─── Stats ─────────────────────────────────────────────────────────────────────
@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    total_registrations = db.query(models.Registration).count()
    total_workshops = db.query(models.Workshop).count()
    total_volunteers = db.query(models.Volunteer).count()
    return {
        "total_registrations": total_registrations,
        "total_workshops": total_workshops,
        "total_volunteers": total_volunteers,
        "target": 75
    }

@app.get("/")
def root():
    return {"message": "DigiWork API is running. Visit /docs for API documentation."}
