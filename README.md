# 🛡️ DataTrail — A Provenance-Aware Data Processing Platform

DataTrail is a full-stack data transformation platform built with **FastAPI** and **React**. It allows authenticated users to upload datasets, apply transformations (cleaning, normalization, aggregation), and track every change through a tamper-proof **provenance log**.

### 🔍 Key Features

- **Role-based Access Control** (Admin, Analyst, Viewer)
- Upload CSV datasets
- Apply data transformations:
  - Cleaning (e.g., drop nulls)
  - Normalization (min-max scaling)
  - Aggregation (e.g., group by country)
- Immutable **Provenance Logging** with hash chaining
- Log verification to detect tampering
- Intuitive **Dashboard UI** built with Tailwind + Headless UI
- Real-time feedback with toasts, progress bars, and data previews

---

### 🧱 Tech Stack

| Frontend        | Backend          | Utilities        |
| --------------- | ---------------- | ---------------- |
| React.js (Vite) | FastAPI (Python) | Pandas, Hashlib  |
| Tailwind CSS    | CORS Middleware  | react-hot-toast  |
| Headless UI     | REST API         | Heroicons/Lucide |

---

### 🔐 Roles & Permissions

| Action       | Admin | Analyst | Viewer |
| ------------ | ----- | ------- | ------ |
| Upload       | ✅    | ❌      | ❌     |
| Transform    | ✅    | ✅      | ❌     |
| Normalize    | ✅    | ✅      | ❌     |
| Aggregate    | ✅    | ✅      | ❌     |
| View Logs    | ✅    | ✅      | ✅     |
| Verify Chain | ✅    | ✅      | ✅     |

---

### ⚙️ Setup Instructions

#### Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```
