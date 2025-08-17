# FinJar Deployment Guide

## Free Deployment Options

### Frontend Deployment (Vercel - Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Visit [vercel.com](https://vercel.com) and sign up with GitHub
   - Click "New Project" and import your repository
   - Select the `frontend` folder as root directory
   - Set build command: `npm run build:prod`
   - Set output directory: `dist`
   - Add environment variable: `VITE_API_BASE_URL` = your backend URL
   - Deploy!

### Backend Deployment (Railway or Render + Railway MySQL)

FinJar now uses MySQL persistence. You can:
* Host both app and MySQL on Railway, or
* Host MySQL on Railway and the app on Render (ensure you use the Railway PUBLIC connection URL, not the internal hostname).

1. **Provision MySQL (Railway)**:
   - Add MySQL plugin/service.
   - Note the PUBLIC connection parameters (host, port, database, user, password).

2. **Set Backend Environment Variables** (choose ONE of these URL strategies):
   - Preferred explicit JDBC URL:
     `FINJAR_DB_URL=jdbc:mysql://<public-host>:<public-port>/<database>?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&socketTimeout=60000&connectTimeout=15000`
   - Or rely on component vars (`MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`, `MYSQLUSER`, `MYSQLPASSWORD`) if on Railway same project.
   - Render fallback mapping supported: `DATABASE_URL` (must already be a JDBC URL), `DB_USERNAME`, `DB_PASSWORD`.

   Required secrets:
   - `FINJAR_DB_USER` or `DB_USERNAME` (if not embedded in FINJAR_DB_URL)
   - `FINJAR_DB_PASSWORD` or `DB_PASSWORD`
   - `FINJAR_JWT_SECRET` (or `JWT_SECRET`)
   - `FINJAR_JWT_EXPIRATION_MS` (optional, default 3600000)
   - `FINJAR_ALLOWED_ORIGINS` (or `CORS_ORIGINS`) comma-separated frontend origins

3. **Deploy Application**:
   - Railway: deploy backend directory directly from repo.
   - Render: create a new Web Service → Build command `./mvnw -DskipTests package` → Start command `java -jar target/FinJar-0.0.1-SNAPSHOT.jar` (or `./mvnw spring-boot:run`). Set env vars above.

4. **Validate Health**:
   - `GET /health` basic up check
   - `GET /api/db/ping` verifies DB connectivity + latency
   - `GET /api/version` shows version & timestamp

5. **Troubleshooting DB Timeouts (SQLState 08S01)**:
   - Confirm you're NOT using `mysql.railway.internal` from Render; must use public host.
   - Ensure FINJAR_DB_URL is single line, no hidden whitespace.
   - Check logs for `HikariPool-1 - Starting...` followed by successful init (no 60s timeout).
   - Reduce pool size already set (max=5) for free tier compatibility.

### Alternative Options

#### Frontend Alternatives:
- **Netlify**: Similar to Vercel, drag-and-drop deployment
- **GitHub Pages**: Free for public repositories
- **Surge.sh**: Simple static hosting

#### Backend Alternatives:
- **Render**: Similar to Railway, supports Spring Boot
- **Heroku**: Classic platform (has free tier limitations)
- **AWS Free Tier**: More complex but powerful

## Environment Configuration

### Development (Local)
- Frontend: Uses `.env.development` with `http://localhost:8080`
- Backend: Uses `application-dev.properties` with MySQL

### Production
- Frontend: Uses `.env.production` with your deployed backend URL
- Backend: Uses `application-prod.properties` with PostgreSQL

## Deployment Steps

1. **Update URLs**:
   - In `frontend/vercel.json`: Replace `your-backend-app.railway.app` with actual backend URL
   - In `frontend/.env.production`: Update `VITE_API_BASE_URL`
   - In `backend/src/main/resources/application-prod.properties`: Update `cors.allowed.origins`

2. **Build and Test Locally**:
   ```bash
   # Frontend
   cd frontend
   npm run build:prod
   npm run preview

   # Backend
   cd backend
   ./mvnw clean package -DskipTests
   ```

3. **Deploy Backend First**: Deploy to Railway and get the URL

4. **Update Frontend Config**: Replace placeholder URLs with actual backend URL

5. **Deploy Frontend**: Deploy to Vercel

## Environment Variables to Set

### Backend (Railway):
- `SPRING_PROFILES_ACTIVE`: `prod`
- `JWT_SECRET`: `your-very-secure-secret-key-minimum-256-bits`
- `CORS_ORIGINS`: `https://your-frontend-domain.vercel.app`
- Database variables are auto-provided by Railway PostgreSQL

### Frontend (Vercel):
- `VITE_API_BASE_URL`: `https://your-backend-domain.railway.app`

## Post-Deployment

1. Test all features in production
2. Monitor logs for any issues
3. Set up custom domains if needed
4. Configure SSL certificates (usually automatic)

## Cost Considerations

- **Vercel**: Free tier includes 100GB bandwidth, custom domains
- **Railway**: $5/month after free trial, includes PostgreSQL
- **Netlify**: Free tier with 100GB bandwidth
- **Render**: Free tier with limitations, paid plans start at $7/month

## Security Notes

- Never commit real database passwords or JWT secrets
- Use environment variables for all sensitive data
- Enable CORS only for your frontend domain
- Use HTTPS in production (automatic with Vercel/Railway)
