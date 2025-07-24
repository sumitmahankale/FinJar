# **FinJar**

**FinJar** is a professional fintech backend application built with Spring Boot. It allows users to create savings jars, set financial goals, and track micro-deposits toward those goals. Designed to encourage disciplined saving habits through simple, intuitive APIs.

<br>

<img width="1895" height="902" alt="FinJar UI" src="https://github.com/user-attachments/assets/5d3796e2-c373-4ce2-84d4-519351290fc0" />

<br>

---

## **Features**

-  User Authentication (JWT-based)  
-  Create and manage multiple savings jars  
-  Deposit money into jars with description logging  
-  View transaction activity for each jar  
-  Clean and responsive UI with dark/light mode toggle  
-  Secure API access with role-based authorization  

---

## **Tech Stack**

###  **Backend**
- Java 17  
- Spring Boot  
- Spring Security (JWT)  
- Hibernate & JPA  
- MySQL  
- Maven  

###  **Frontend**
- React.js  
- Tailwind CSS  
- React Router  
- Axios  
- Lucide Icons  

---

##  **Getting Started**

### 🔧 Backend Setup

1. **Clone the repository**  
   ```bash
   git clone https://github.com/sumitmahankale/FinJar.git
   cd finjar
   ```

2. **Configure `application.properties`**
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/finjar
   spring.datasource.username=your_db_user
   spring.datasource.password=your_db_password
   jwt.secret=your_jwt_secret
   ```

3. **Run the Spring Boot application**
   ```bash
   mvn spring-boot:run
   ```

---

### 🧾 Frontend Setup (Optional if UI included)

1. **Navigate to frontend directory**
   ```bash
   cd finjar-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the React app**
   ```bash
   npm run dev
   ```

---

##  **Project Folder Structure**

###  Backend

```
finjar-backend/
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── finjar/
        │           ├── config/
        │           ├── controller/
        │           ├── model/
        │           ├── repository/
        │           └── service/
        └── resources/
            ├── application.properties
            └── static/
```

###  Frontend

```
finjar-frontend/
└── src/
    ├── components/
    ├── pages/
    ├── services/
    └── App.jsx
```

---

##  Contributing

Contributions are welcome!  
Feel free to fork this repository and submit a pull request with improvements, new features, or bug fixes.

---

##  License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
