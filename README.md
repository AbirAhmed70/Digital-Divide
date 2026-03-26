# DigiWork 💡
### Digital Skills for Jobs — Jessore, Bangladesh

> A **Millennium Fellowship Class of 2026** project advancing **UN SDG 8: Decent Work and Economic Growth**

DigiWork is a free, community-based digital skills initiative that runs hands-on workshops for unemployed and underemployed young adults in Jessore, Bangladesh. Every session is taught in Bangla and designed to work on smartphones.

---

## 🌍 Project Overview

| | |
|---|---|
| **Fellowship** | Millennium Fellowship 2026 — UN Academic Impact |
| **SDG** | SDG 8 — Decent Work and Economic Growth |
| **UNAI Principle** | UNAI 2 — Capacity Building |
| **Location** | Jessore, Khulna Division, Bangladesh |
| **Duration** | August 1 – November 30, 2026 |
| **Target** | 75+ participants across 8 free workshops |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | FastAPI (Python) + SQLAlchemy + SQLite |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Design** | Syne + DM Sans fonts, dark theme, mobile-first |
| **API Docs** | Auto-generated at `/docs` (Swagger UI) |

---

## 📁 Project Structure

```
digiwork/
├── backend/
│   ├── main.py          # FastAPI app with all routes
│   ├── models.py        # SQLAlchemy database models
│   ├── schemas.py       # Pydantic request/response schemas
│   ├── database.py      # SQLite database configuration
│   └── requirements.txt
├── frontend/
│   ├── index.html       # Homepage
│   ├── workshops.html   # All workshops + registration
│   ├── resources.html   # Free learning resources
│   ├── about.html       # About + impact plan
│   ├── contact.html     # Contact form + FAQ
│   ├── css/
│   │   └── style.css    # Full stylesheet
│   └── js/
│       └── main.js      # All frontend JavaScript
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/digiwork.git
cd digiwork
```

### 2. Set up the backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be running at: **http://localhost:8000**
Swagger API docs: **http://localhost:8000/docs**

### 3. Open the frontend
Open `frontend/index.html` in your browser.

> 💡 For best results, use a local server. With Python:
> ```bash
> cd frontend && python -m http.server 3000
> ```
> Then visit http://localhost:3000

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/workshops` | Get all workshops |
| `GET` | `/api/workshops/{id}` | Get single workshop |
| `POST` | `/api/register` | Register for a workshop |
| `POST` | `/api/volunteer` | Sign up as a volunteer |
| `POST` | `/api/contact` | Send a contact message |
| `GET` | `/api/stats` | Get live statistics |

---

## 📊 Impact Measurement

DigiWork measures success through three quantifiable goals:

1. ✅ **8 workshops** delivered between August–November 2026
2. ✅ **75+ young adults** trained (at least 10 per session)
3. ✅ **30+ participants** applying for jobs online post-workshop

---

## 🏠 Pages

- **Home** (`index.html`) — Hero, impact stats, featured workshops, SDG alignment
- **Workshops** (`workshops.html`) — All 8 sessions with live registration
- **Resources** (`resources.html`) — Templates, guides, free external courses
- **About** (`about.html`) — Story, impact plan, Fellowship details
- **Contact** (`contact.html`) — Contact form, volunteer info, FAQ

---

## 🤝 Fellowship Context

This project is part of the **Millennium Fellowship Class of 2026**, a global leadership program by the United Nations Academic Impact (UNAI) and MCN. Fellows from 160+ countries run local social impact projects simultaneously.

- [Millennium Fellowship](https://www.millenniumfellows.org)
- [UN SDG 8](https://sdgs.un.org/goals/goal8)
- [UNAI Principle 2](https://www.un.org/en/academic-impact/page/principles)

---

## 📄 License
MIT License — Free to use, adapt, and share.

---

*Made with ❤️ in Jessore, Bangladesh for the Millennium Fellowship 2026*
