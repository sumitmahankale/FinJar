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

### Backend Deployment (Railway - Recommended)

1. **Deploy to Railway**:
   - Visit [railway.app](https://railway.app) and sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository and choose `backend` folder
   - Railway will auto-detect Spring Boot and deploy
   - Add a PostgreSQL database service
   - Set environment variables:
     - `SPRING_PROFILES_ACTIVE=prod`
     - `DATABASE_URL` (auto-provided by Railway PostgreSQL)
     - `JWT_SECRET=your-super-secret-jwt-key-here`
     - `CORS_ORIGINS=https://your-frontend-app.vercel.app`

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
