# FinJar (Prototype – Active Development)

Lightweight Spring Boot + React prototype for savings “jars”. Recently upgraded from a mock auth to a real signed JWT (HS256 via `jjwt`) containing a `userId` claim with per‑user data isolation. All data is still in-memory (lost on restart). Registration now requires an explicit login (no more auto sign‑in). Reports screen fixed to use the unified API service.

<br>
<img width="1897" alt="ui" src="https://github.com/user-attachments/assets/140469e5-08b5-4da4-871f-c7f55e1d21c0" />
<br>

---

## Current Feature Matrix
| Area | Status | Notes |
|------|--------|-------|
| Authentication | Signed JWT (HS256) with `email`, `name`, `userId`, 1h expiry | Secret from `FINJAR_JWT_SECRET` (fallback default) |
| Passwords | Simple hash (Java `hashCode` hex) | Needs BCrypt (roadmap) |
| Users | In-memory store; register, login, profile update | No persistence / uniqueness enforced by map |
| Jars | Per-user CRUD + progress % | Stored in memory; no pagination |
| Deposits | Per-user CRUD; updates jar balance & progress | In-memory; no validation beyond presence |
| Reports | Aggregates totals, monthly trend, CSV export | Uses current in-memory data |
| Errors (frontend) | Backend message surfaced on login/register | No standardized API error schema yet |
| CORS | Allowlist of deployed frontend origins | To refine per env |
| Health / Version | `/health`, `/api/health`, `/api/version` | Manual version constant |

### Key Recent Changes
* Real JWT signing & validation (replacing unsigned structure).
* Added per-user isolation for jars & deposits (ownership enforced on all CRUD).
* Registration flow: removed auto-login – user must log in explicitly.
* Frontend error handling: surfaces backend messages (wrong password, duplicate email, expired session).
* Reports component refactored to use central `apiService` (removed brittle regex parsing logic).

### Current Limitations / Risks
* Weak password hashing (must move to BCrypt quickly).
* All data volatile (restart wipes everything).
* No refresh tokens; access token lifetime fixed at 1 hour.
* No rate limiting / brute-force protection.
* No input length / numeric validation server-side beyond minimal checks.
* Monetary values use `double` (precision issues possible) – should migrate to `BigDecimal`.
* Single large controller file (`SimpleFinJarApplication`) – needs layering.

---

## Quick Start (Prototype)
Backend prerequisites: Java 8+ (will upgrade to 17+), Maven.

```bash
cd backend
mvn spring-boot:run
```
Default API base: `http://localhost:8080`.

Frontend prerequisites: Node 18+.
```bash
cd frontend
npm install
npm run dev
```
Configure (optional) `frontend/src/config/config.js` or a Vite env (`VITE_API_BASE_URL`).

Auth Flow:
1. Register (creates user; DOES NOT log you in).
2. You are redirected to login screen.
3. Login -> token stored under `localStorage.token` (legacy `authToken` still accepted).
4. Use dashboard & reports; after 1h token expires → redirected to login on protected API calls.

Logout currently just removes the token client-side (no server blacklist).

---

## API (Implemented)
```
GET    /api/version
GET    /health
GET    /api/health

POST   /api/auth/register      (name, email, password)
POST   /api/auth/login         (email, password)
POST   /api/auth/logout        (placeholder – no server invalidation)

GET    /api/user/profile       (Bearer token)
PUT    /api/user/update        (name/email)

GET    /api/jars               (Bearer; ?flat=1 optional)
POST   /api/jars               (name/targetAmount[,description])
PUT    /api/jars/{id}
DELETE /api/jars/{id}
POST   /api/jars/{id}/recalc   (recomputes current & progress)

GET    /api/deposits           (?jarId= optional)
GET    /api/deposits/jar/{jarId} (?flat param variant)
POST   /api/deposits           (jarId, amount[,description])
POST   /api/deposits/jar/{jarId} (amount[,description])
PUT    /api/deposits/{id}
DELETE /api/deposits/{id}
```

Legacy alias endpoints (`/auth/*`, `/api/users/*`) still exist for older frontend bundles and will be removed after confirmation.

---

## Roadmap (Prioritized Next)
1. Secure password hashing (BCrypt `PasswordEncoder`).
2. Persistence layer (H2 dev → Postgres prod) + JPA entities.
3. Validation & global error handler (`@ControllerAdvice`, Bean Validation).
4. Refresh tokens & shorter access token (15m) strategy.
5. Replace `double` with `BigDecimal` for all monetary amounts.
6. Split monolith controller into layered architecture (controller/service/repository/dto).
7. Pagination & sorting for jars/deposits.
8. Rate limiting (basic in-memory or bucket4j) + brute-force login protection.
9. Structured logging + request correlation id.
10. Automated tests (unit + integration) & CI config.
11. Swagger/OpenAPI documentation.
12. Optional: categories / scheduled (recurring) deposits.

Later / Nice-to-have:
* Sharing / collaboration.
* Mobile clients.
* Banking integrations.

---

## Planned Backend Structure (Future)
```
com.finjar
   config/
   controller/
   dto/
   entity/
   repository/
   service/
   security/
   util/
   exception/
```

---

## Contribution (Early Stage)
Prototype is rapidly changing; PRs welcome for: BCrypt adoption, monetary type improvements, validation layer, modularization.

Conventional commits preferred (feat, fix, docs, refactor, chore, test).

---

## License
MIT – see `LICENSE`.

---

## Summary
Prototype now has: signed JWT auth, per-user isolation, improved error messaging, functional reports. Still missing: strong password hashing, persistence, validation, refresh tokens, proper layering. See roadmap above for immediate focus.
