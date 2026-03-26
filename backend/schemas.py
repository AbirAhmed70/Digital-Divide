from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# ─── Workshop ──────────────────────────────────────────────────────────────────
class WorkshopOut(BaseModel):
    id: int
    title: str
    description: str
    date: str
    time: str
    location: str
    seats_total: int
    seats_filled: int
    skill_level: str
    icon: str

    class Config:
        from_attributes = True

# ─── Registration ──────────────────────────────────────────────────────────────
class RegistrationIn(BaseModel):
    workshop_id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    age: Optional[int] = None
    current_situation: Optional[str] = None

class RegistrationOut(BaseModel):
    id: int
    workshop_id: int
    full_name: str
    email: str
    registered_at: datetime

    class Config:
        from_attributes = True

# ─── Volunteer ─────────────────────────────────────────────────────────────────
class VolunteerIn(BaseModel):
    full_name: str
    email: str
    phone: Optional[str] = None
    skills: Optional[str] = None
    availability: Optional[str] = None

class VolunteerOut(BaseModel):
    id: int
    full_name: str
    email: str
    signed_up_at: datetime

    class Config:
        from_attributes = True

# ─── Contact ───────────────────────────────────────────────────────────────────
class ContactIn(BaseModel):
    name: str
    email: str
    subject: Optional[str] = None
    message: str

class ContactOut(BaseModel):
    id: int
    name: str
    email: str
    sent_at: datetime

    class Config:
        from_attributes = True
