# **FinJar**

**FinJar** is a professional fintech backend application built with Spring Boot. It allows users to create savings jars, set financial goals, and track micro-deposits toward those goals. Designed to encourage disciplined saving habits through simple, intuitive APIs.

<br><br>

<img width="1895" height="902" alt="image" src="https://github.com/user-attachments/assets/5d3796e2-c373-4ce2-84d4-519351290fc0" />

<br><br>

## **Features**

- User Authentication (JWT-based)
- Create and manage multiple savings jars
- Deposit money into jars with description logging
- View transaction activity for each jar
- Clean and responsive UI with dark/light mode toggle
- Secure API access with role-based authorization

## **Tech Stack**

### **Backend**
- Java 17
- Spring Boot
- Spring Security (JWT)
- Hibernate & JPA
- MySQL
- Maven

### **Frontend**
- React.js
- Tailwind CSS
- React Router
- Axios
- Lucide Icons

### **Backend**

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/finjar-backend.git
   cd finjar-backend
Configure the application.properties:

### properties

spring.datasource.url=jdbc:mysql://localhost:3306/finjar
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
jwt.secret=your_jwt_secret

### Folder Structure
Backend
src/
  └── main/
      └── java/
          └── com/
              └── finjar/
                  ├── controller
                  ├── service
                  ├── model
                  ├── repository
                  └── config
### Frontend
src/
  ├── components/
  ├── pages/
  ├── services/
  └── App.jsx
### Contributing
Contributions are welcome! Please fork the repository and create a pull request for any improvements or bug fixes.

### License
This project is licensed under the MIT License.
