# **FinJar (Minimal Prototype)**

Current state: a deliberately simplified Spring Boot + React prototype focused on rapid deploy & UI integration. It exposes mock authentication (unsigned JWT-like tokens), in‑memory jars & deposits CRUD (non‑persistent), and basic version / health endpoints. The earlier README language described a fully featured, secure, database‑backed system; that is part of the roadmap but not yet implemented in this branch.

<br>
<img width="1897" height="908" alt="image" src="https://github.com/user-attachments/assets/140469e5-08b5-4da4-871f-c7f55e1d21c0" />
<br>

---

## **Overview**

FinJar addresses the common challenge of building consistent saving habits by gamifying the savings process through virtual "jars" that represent specific financial goals. Whether saving for an emergency fund, vacation, or major purchase, users can create dedicated jars and make incremental progress through small, manageable deposits.

The application follows modern software architecture principles with a clean separation between the Spring Boot backend API and React frontend, ensuring scalability, maintainability, and a seamless user experience.

---

## **Implemented Features (Prototype)**
| Area | Implemented Now | Notes |
|------|-----------------|-------|
| Auth | Mock login/register returning unsigned JWT-like token | Token structure only; not cryptographically signed |
| Jars | In-memory list/create/update/delete + progress | Data lost on restart |
| Deposits | In-memory create/list/update/delete + jar amount recalculation | No pagination |
| Versioning | `/api/version` endpoint | Manual constant bump |
| Health | `/health`, `/api/health` | Basic status only |
| CORS | Allowlisted frontend origins | To be hardened later |

## **Not Yet Implemented**
- Real JWT signing & refresh tokens
- Persistent storage (H2/Postgres/MySQL)
- User accounts & password hashing
- Role-based authorization
- Comprehensive validation & error codes
- Pagination / filtering / sorting
- Rate limiting & audit logging
- CI tests & coverage
- Proper 404/exception mapping (will be added soon)

---

## **Technology Stack**

### **Backend (Prototype)**
- Java 8 (will upgrade later)
- Spring Boot 2.7.x (web + actuator only)
- No database / no JPA yet
- Maven build

### **Frontend Stack**
- React + Vite + Tailwind
- Native fetch wrapper service (`apiService.js`)
- Token stored in `localStorage`

### **Development Tools**
- **Spring Boot DevTools**: Hot reload and development utilities
- **MySQL Workbench**: Database design and administration
- **Postman**: API testing and documentation
- **npm/yarn**: Package management for frontend dependencies

---

## **Installation & Setup**

### **Prerequisites (Prototype)**
- Java 8+ (will move to 17+ soon)
- Node.js 18+
- Maven 3.6+
- Git

### **Backend Run (Prototype)**

1. **Clone and Navigate to Repository**
   ```bash
   git clone https://github.com/sumitmahankale/FinJar.git
   cd FinJar/finjar-backend
   ```

2. **Build and Run Application**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

Server (default) starts at `http://localhost:8080` (API paths under `/api/...`).

### **Frontend Configuration**

1. **Navigate to Frontend Directory**
   ```bash
   cd ../finjar-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   For Vite (example `.env.local`):
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_ENV=development
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

The frontend application will start at `http://localhost:3000`

---

## **API Documentation**

### **Current Prototype API (Implemented)**
```
GET   /api/health
GET   /api/version

POST  /api/auth/login
POST  /api/auth/register
POST  /api/auth/logout (mock, token structure only)

GET   /api/user/profile
PUT   /api/user/update

GET   /api/jars
POST  /api/jars
PUT   /api/jars/{id}
DELETE /api/jars/{id}
POST  /api/jars/{id}/recalc

GET   /api/deposits?jarId={optional}
POST  /api/deposits
PUT   /api/deposits/{id}
DELETE /api/deposits/{id}
```

---

## **Project Architecture**

### **Planned Full Backend Structure (Roadmap)**
```
backend/
   src/main/java/com/finjar/
      config/ (SecurityConfig, JwtConfig, PersistenceConfig)
      controller/ (AuthController, JarController, DepositController)
      dto/ (request/, response/)
      entity/ (User, Jar, Deposit)
      repository/ (UserRepository, JarRepository, DepositRepository)
      service/ (AuthService, JarService, DepositService)
      util/ (JwtUtil, ResponseFactory)
      exception/ (GlobalExceptionHandler, custom exceptions)
```

### **Frontend Structure**
```
finjar-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── jar/
│   │   │   ├── JarCard.jsx
│   │   │   ├── JarForm.jsx
│   │   │   └── JarList.jsx
│   │   └── transaction/
│   │       ├── TransactionForm.jsx
│   │       └── TransactionHistory.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── JarDetails.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── jarService.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useAuth.js
│   └── utils/
│       ├── constants.js
│       └── helpers.js
```

---

## **Planned Database Schema (Roadmap)**
Will be introduced once persistence layer is added (initially H2 -> Postgres/MySQL). Draft tables will include `users`, `savings_jars`, `deposits`.

---

## **Development Guidelines**

### **Code Style & Conventions**
- Follow Java naming conventions (camelCase for variables, PascalCase for classes)
- Use meaningful variable and method names
- Implement proper error handling with custom exceptions
- Write comprehensive unit tests for service layer methods
- Document API endpoints with proper HTTP status codes

### **Git Workflow**
- Create feature branches from `develop`
- Use conventional commit messages
- Submit pull requests for code review
- Maintain clean commit history

### **Testing Strategy**
- Unit tests for service layer business logic
- Integration tests for API endpoints
- Frontend component testing with React Testing Library
- End-to-end testing for critical user flows

---

## **Deployment**

### **Production Considerations**
- Configure environment-specific properties
- Implement proper logging with centralized log management
- Set up database connection pooling
- Configure HTTPS/SSL certificates
- Implement rate limiting and API throttling
- Set up monitoring and health checks

### **Docker Support**
```dockerfile
# Backend Dockerfile
FROM openjdk:17-jdk-slim
COPY target/finjar-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

---

## **Contributing**

We welcome contributions from the community! Here's how you can help:

### **Getting Started**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following our coding standards
4. Add tests for new functionality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### **Contribution Guidelines**
- Ensure all tests pass before submitting PR
- Update documentation for any API changes
- Follow existing code style and conventions
- Include proper error handling and validation
- Add appropriate unit and integration tests

### **Issue Reporting**
- Use issue templates for bug reports and feature requests
- Provide detailed reproduction steps for bugs
- Include system information and environment details

---

## **Roadmap**

### **Upcoming Features (Prioritized)**
1. Real JWT signing & refresh
2. Persistence (H2 + migration to Postgres)
3. Validation & global error handling
4. Pagination & filtering
5. Rate limiting & structured logging
6. Automated / scheduled deposits
7. Categories & goal sharing
8. Export & reporting
9. Mobile apps
10. Bank integrations

---

## **Support & Documentation**

### **Resources**
- **Wiki**: Comprehensive guides and tutorials
- **API Documentation**: Detailed endpoint specifications
- **FAQ**: Common questions and troubleshooting
- **Video Tutorials**: Step-by-step setup and usage guides

### **Community**
- **Discord Server**: Real-time community support
- **GitHub Discussions**: Feature requests and general discussion
- **Stack Overflow**: Technical Q&A with `finjar` tag

---

## **License**

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for complete details.

The MIT License allows for commercial use, modification, distribution, and private use, while requiring only attribution and license inclusion in distributions.

---

## **Acknowledgments**

Special thanks to all contributors who have helped make FinJar a robust and user-friendly financial application. Your feedback, bug reports, and feature suggestions continue to drive the project forward.
