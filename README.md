# FinJar

Smart, goal‑based personal savings manager. Create “jars” for financial goals (Emergency Fund, Vacation, New Laptop), add deposits over time, track progress visually, and export quick reports.

<p align="center">
   <img width="850" alt="finjar-ui" src="https://github.com/user-attachments/assets/140469e5-08b5-4da4-871f-c7f55e1d21c0" />
</p>

---

## Core Features

| Category | Feature | Description |
|----------|---------|-------------|
| Accounts | User Registration & Login | Email + password (JWT based session) |
| Security | JWT Auth (HS256) | Token carries `userId`, `email`, `name`, 1h expiry |
| Goals | Jar Management | Create, update, delete jars with target amount & description |
| Savings | Deposits | Add / edit / remove deposits; jar totals & progress auto‑updated |
| Progress | Real‑time Progress % | Computed from current vs target per jar |
| Reporting | Dashboard & Reports | Aggregated totals, monthly trend, jar performance, CSV export |
| Profile | Update Profile | Change display name & email (uniqueness enforced) |
| Health | Health & Version Endpoints | `/health`, `/api/health`, `/api/version` |
| UX | Responsive React UI | Vite + Tailwind + Lucide icons |
| CORS | Multi-Origin Allowlist | Deployed frontends + localhost |

---

## Tech Stack

**Backend**
* Java 8 (Spring Boot 2.7.x)
* Spring Web, Actuator
* Spring Data JPA (MySQL persistence)
* JSON Web Tokens via `jjwt` (HS256)
* BCrypt password hashing (legacy hashes auto‑upgraded on successful login)

**Frontend**
* React + Vite
* Tailwind CSS
* Lucide Icons
* Custom lightweight `apiService` wrapper

**Build & Tooling**
* Maven (backend)
* Node / npm (frontend)
* Git / GitHub Actions (future CI)

---

## Project Structure (Current)
```
FinJar/
   backend/
   src/main/java/com/SimpleFinJarApplication.java  # Monolithic controller (to be modularized)
      src/main/java/com/util/JwtUtil.java             # JWT utility
   src/main/java/com/model/*                       # JPA entities (User, Jar, Deposit)
   src/main/java/com/repo/*                        # Spring Data repositories
   src/main/java/com/service/*                     # Auth & Jar services
      resources/application.properties
   frontend/
      src/Components/ (Dashboard, Jars, Reports, Auth pages ...)
      src/services/apiService.js
      src/config/config.js
```

---

## Getting Started

### 1. Backend
```bash
cd backend
mvn spring-boot:run
```
Server: `http://localhost:8080`.

Environment (optional):
| Variable | Purpose | Default |
|----------|---------|---------|
| FINJAR_JWT_SECRET | JWT signing secret (>=32 chars) | ChangeMe_AtLeast32Chars_Long_Secret_Key_123 |

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Configure base URL in `src/config/config.js` or create `.env`:
```
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Auth Flow
1. Register (name, email, password) → success message → redirected to Login.
2. Login → token stored as `localStorage.token` (legacy `authToken` still read).
3. All authenticated requests send `Authorization: Bearer <token>` automatically.
4. After expiry (1h) protected requests trigger redirect to `/login`.

---

## API Summary
```
GET    /health
GET    /api/health
GET    /api/version

POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout

GET    /api/user/profile
PUT    /api/user/update

GET    /api/jars               (?flat=1 optional raw array)
POST   /api/jars
PUT    /api/jars/{id}
DELETE /api/jars/{id}
POST   /api/jars/{id}/recalc

GET    /api/deposits           (?jarId=<id>)
GET    /api/deposits/jar/{jarId} (?flat param variant)
POST   /api/deposits
POST   /api/deposits/jar/{jarId}
PUT    /api/deposits/{id}
DELETE /api/deposits/{id}
```
Legacy compatibility routes exist (`/auth/*`, `/api/users/*`) and will be deprecated.

---

## Reports Module
Features: aggregate totals, jar performance ranking, last 6‑month trend, CSV export (jar performance). Data now persisted in MySQL; refresh button refetches current server state.

---

## Security Notes
JWT auth (HS256) with 1h access token validity. Passwords stored with BCrypt; any legacy demo user hashes are transparently upgraded on login. No server‑side token revocation list (logout is client‑side). Protect `FINJAR_JWT_SECRET` and database credentials via environment variables.

---

## Known Limitations (Next Targets)
* Validation layer (Bean Validation) & standardized error schema
* Refresh token / rotation (current single access token only)
* Monetary precision migration from `double` to `BigDecimal`
* Pagination & sorting for large jar / deposit sets
* Brute-force protection & rate limiting
* Modular layered refactor (separate controllers + DTOs + mappers)
* Global exception handling & error codes
* OpenAPI / Swagger documentation

---

## Roadmap Snapshot
1. Validation & global exception handler
2. Refresh tokens & rotation
3. BigDecimal monetary fields
4. Pagination & sorting
5. Rate limiting / login attempt throttle
6. Layered refactor + DTOs + mapping
7. OpenAPI spec + Swagger UI
8. Test suite & CI pipeline
9. Categories & recurring deposits
10. Export / analytics enhancements

---

## Contributing
PRs welcome for security hardening, persistence, validation, and architectural refactor. Use conventional commits where possible.

---

## License
MIT – see `LICENSE`.

---

## Status
Core functional MVP delivered: JWT auth, per‑user jars & deposits, reporting, profile management, MySQL persistence, BCrypt hashing. See limitations & roadmap for planned enhancements.
