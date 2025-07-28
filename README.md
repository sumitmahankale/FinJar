# **FinJar**

**FinJar** is a professional fintech backend application built with Spring Boot that empowers users to develop disciplined saving habits through digital savings jars. The platform enables users to create multiple savings goals, make micro-deposits, and track their progress toward financial objectives with comprehensive transaction logging and real-time analytics.

<br>
<img width="1895" height="902" alt="FinJar UI" src="https://github.com/user-attachments/assets/5d3796e2-c373-4ce2-84d4-519351290fc0" />
<br>

---

## **Overview**

FinJar addresses the common challenge of building consistent saving habits by gamifying the savings process through virtual "jars" that represent specific financial goals. Whether saving for an emergency fund, vacation, or major purchase, users can create dedicated jars and make incremental progress through small, manageable deposits.

The application follows modern software architecture principles with a clean separation between the Spring Boot backend API and React frontend, ensuring scalability, maintainability, and a seamless user experience.

---

## **Key Features**

### **Core Functionality**
- **Multi-Goal Savings Management**: Create unlimited savings jars with custom names, target amounts, and deadlines
- **Micro-Deposit System**: Make small, frequent deposits to encourage consistent saving behavior
- **Comprehensive Transaction Logging**: Track every deposit with timestamps, amounts, and optional descriptions
- **Progress Visualization**: Monitor savings progress with intuitive progress bars and completion percentages
- **Goal Achievement Tracking**: Celebrate milestones and completed savings objectives

### **Security & Authentication**
- **JWT-Based Authentication**: Secure token-based user authentication and session management
- **Role-Based Authorization**: Granular access control for different user types and permissions
- **Password Encryption**: Industry-standard password hashing and security protocols
- **API Security**: Protected endpoints with proper authentication middleware

### **User Experience**
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode Toggle**: Customizable UI themes for user preference
- **Intuitive Navigation**: Clean, modern interface built with Tailwind CSS
- **Real-Time Updates**: Instant reflection of deposits and goal progress

---

## **Technology Stack**

### **Backend Architecture**
- **Java 17**: Latest LTS version with modern language features and performance improvements
- **Spring Boot 3.x**: Enterprise-grade framework for rapid application development
- **Spring Security**: Comprehensive security framework with JWT implementation
- **Hibernate/JPA**: Object-relational mapping for efficient database operations
- **MySQL**: Reliable relational database for data persistence
- **Maven**: Dependency management and build automation

### **Frontend Stack**
- **React.js 18**: Modern component-based UI library with hooks and context
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **React Router**: Client-side routing for single-page application navigation
- **Axios**: HTTP client for API communication with interceptors
- **Lucide Icons**: Clean, consistent icon library for modern interfaces

### **Development Tools**
- **Spring Boot DevTools**: Hot reload and development utilities
- **MySQL Workbench**: Database design and administration
- **Postman**: API testing and documentation
- **npm/yarn**: Package management for frontend dependencies

---

## **Installation & Setup**

### **Prerequisites**
- Java 17 or higher
- Node.js 16+ and npm
- MySQL 8.0+
- Maven 3.6+
- Git

### **Backend Configuration**

1. **Clone and Navigate to Repository**
   ```bash
   git clone https://github.com/sumitmahankale/FinJar.git
   cd FinJar/finjar-backend
   ```

2. **Database Setup**
   ```sql
   CREATE DATABASE finjar;
   CREATE USER 'finjar_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON finjar.* TO 'finjar_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Configure Application Properties**
   ```properties
   # Database Configuration
   spring.datasource.url=jdbc:mysql://localhost:3306/finjar
   spring.datasource.username=finjar_user
   spring.datasource.password=your_password
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

   # JPA/Hibernate Configuration
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
   spring.jpa.show-sql=false

   # JWT Configuration
   jwt.secret=your_256_bit_secret_key_here
   jwt.expiration=86400000

   # Server Configuration
   server.port=8080
   server.servlet.context-path=/api
   ```

4. **Build and Run Application**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

The backend server will start at `http://localhost:8080/api`

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
   Create `.env` file:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:8080/api
   REACT_APP_ENV=development
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

The frontend application will start at `http://localhost:3000`

---

## **API Documentation**

### **Authentication Endpoints**
```
POST /api/auth/register - User registration
POST /api/auth/login    - User authentication
POST /api/auth/refresh  - Token refresh
```

### **Savings Jar Endpoints**
```
GET    /api/jars          - Retrieve user's savings jars
POST   /api/jars          - Create new savings jar
PUT    /api/jars/{id}     - Update savings jar
DELETE /api/jars/{id}     - Delete savings jar
```

### **Transaction Endpoints**
```
GET  /api/jars/{id}/transactions - Get jar transaction history
POST /api/jars/{id}/deposit      - Make deposit to jar
```

---

## **Project Architecture**

### **Backend Structure**
```
finjar-backend/
├── src/main/java/com/finjar/
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── JwtConfig.java
│   │   └── DatabaseConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── JarController.java
│   │   └── TransactionController.java
│   ├── dto/
│   │   ├── request/
│   │   └── response/
│   ├── entity/
│   │   ├── User.java
│   │   ├── SavingsJar.java
│   │   └── Transaction.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── SavingsJarRepository.java
│   │   └── TransactionRepository.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── JarService.java
│   │   └── TransactionService.java
│   └── util/
│       ├── JwtUtil.java
│       └── ResponseUtil.java
└── src/main/resources/
    ├── application.properties
    ├── application-dev.properties
    └── application-prod.properties
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

## **Database Schema**

### **Users Table**
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **Savings Jars Table**
```sql
CREATE TABLE savings_jars (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    target_amount DECIMAL(10,2) NOT NULL,
    current_amount DECIMAL(10,2) DEFAULT 0.00,
    description TEXT,
    target_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### **Transactions Table**
```sql
CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    jar_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description VARCHAR(255),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jar_id) REFERENCES savings_jars(id)
);
```

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

### **Upcoming Features**
- **Automated Savings**: Schedule recurring deposits
- **Savings Categories**: Organize jars by categories (emergency, vacation, etc.)
- **Goal Sharing**: Share savings goals with family/friends
- **Interest Calculation**: Simulate interest earnings on savings
- **Export Functionality**: Download transaction reports
- **Mobile App**: Native iOS and Android applications
- **Bank Integration**: Connect real bank accounts for automatic transfers

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
