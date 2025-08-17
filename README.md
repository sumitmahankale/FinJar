# FinJar

Goal‑based personal savings manager. Create jars for financial goals (Emergency Fund, Vacation, New Laptop), add deposits over time, track progress and export lightweight reports. Now running with MySQL persistence and production deployment (Render + Railway DB) using secure JWT auth and BCrypt password hashing.

<p align="center">
   <img width="850" alt="finjar-ui" src="https://github.com/user-attachments/assets/140469e5-08b5-4da4-871f-c7f55e1d21c0" />
</p>

---

## Core Features

| Category | Feature | Description |
|----------|---------|-------------|
| Accounts | User Registration & Login | Email + password (JWT based session) |
| Security | JWT Auth (HS256) | Token carries `userId`, `email`, `name`; configurable expiry |
| Goals | Jar Management | Create, update, delete jars with target amount & description |
| Savings | Deposits | Add / edit / remove deposits; jar totals & progress auto‑updated |
| Progress | Real‑time Progress % | Computed from current vs target per jar |
| Reporting | Dashboard & Reports | Aggregated totals, monthly trend, jar performance, CSV export |
| Profile | Update Profile | Change display name & email (uniqueness enforced) |
| Health | Health & DB Endpoints | `/health`, `/api/health`, `/api/version`, `/api/db/ping` |
| UX | Responsive React UI | Vite + Tailwind + Lucide icons |
| CORS | Multi-Origin Allowlist | Deployed frontends + localhost |

---

## Tech Stack

**Backend**
* Java 8 (Spring Boot 2.7.x)
* Spring Web, Actuator
* Spring Data JPA (MySQL persistence)
* HikariCP (tuned for small free tier: max pool 5)
* JSON Web Tokens via `jjwt` (HS256) — expiration configurable via env
* BCrypt password hashing (legacy hashes auto‑upgraded on successful login)
* Dynamic datasource resolution: explicit `FINJAR_DB_URL` → `DATABASE_URL` / `MYSQL_URL` (auto converted) → component vars (`MYSQLHOST` etc.) → localhost fallback

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

Environment (key vars):
| Variable | Purpose | Notes / Default |
|----------|---------|-----------------|
| FINJAR_DB_URL | Full JDBC URL | Overrides all other DB hints |
| FINJAR_DB_USER / FINJAR_DB_PASSWORD | DB credentials | If not in URL |
| DATABASE_URL / MYSQL_URL | Alternative (auto converted if `mysql://`) | Only used when FINJAR_DB_URL absent |
| FINJAR_JWT_SECRET (or JWT_SECRET) | JWT signing secret (>=32 chars) | Default dev fallback only |
| FINJAR_JWT_EXPIRATION_MS (or JWT_EXPIRATION) | Access token lifetime (ms or seconds if small) | Default 3600000 (1h) |
| FINJAR_ALLOWED_ORIGINS (or CORS_ORIGINS) | Comma separated allowed origins | Defaults to `http://localhost:5173` |
| PORT | Runtime HTTP port | Defaults 8080 (Render sets) |

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
GET    /api/db/ping                   # DB connectivity + latency (success true/false)

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
JWT auth (HS256) with configurable expiration (default 1h; environment variable can set ms or a small number interpreted as seconds). Passwords stored with BCrypt; any legacy demo user hashes transparently upgraded on login. No server‑side token revocation list (logout is client‑side). Protect `FINJAR_JWT_SECRET` and database credentials via environment variables.

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
* Non-root DB user (currently root acceptable only for dev/testing)

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

## Diagnostics & Health
* `/health` / `/api/health` basic liveness
* `/api/version` build timestamp/version
* `/api/db/ping` runtime DB connectivity & latency
* Startup logs emit resolved JDBC URL (sanitized) for deployment troubleshooting.

## Status
Production deployment live (Render + Railway MySQL). Core functional MVP: JWT auth, per‑user jars & deposits, reporting, profile management, MySQL persistence, BCrypt hashing, DB diagnostics. See limitations & roadmap for planned enhancements.
