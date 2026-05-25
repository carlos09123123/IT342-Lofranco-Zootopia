
# 🐾 Zootopia — Pet Shop System
=======
# 🐾 Zooopia — Pet Shop System
>>>>>>> Vertical-Slice-Refactoring

**IT342 Project** · A full-stack pet shop management platform for customers and administrators

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-Backend-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-Web%20Frontend-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Kotlin](https://img.shields.io/badge/Kotlin-Mobile-7F52FF?logo=kotlin&logoColor=white)](https://kotlinlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://neon.tech/)

</div>

---

## 📖 About the Project

Zootopia is a one-stop solution for pet owners and shop managers alike. Customers can browse pet-related products, place orders, book grooming or veterinary appointments, and leave product reviews. Administrators can efficiently manage inventory, view orders, and maintain the product catalog through a user-friendly dashboard.

---

## ✨ Functionalities

| # | Feature | Description |
|---|---------|-------------|
| 1 | 📦 Inventory Management | Track and manage product stock levels |
| 2 | 🔍 Product Filtering | Tailored search with category and attribute filters |
| 3 | ⭐ Product Reviews | Customer reviews for transparency and trust |
| 4 | 🔐 User Authentication | Secure login and registration with JWT & OAuth2 |
| 5 | 🛍️ Product List | Detailed product listings and browsing |
| 6 | 📜 Product History | View past purchases and order history |
| 7 | 📅 Appointment Tab | Real-time booking for grooming/vet services |
| 8 | 🛒 Cart | Add, update, and checkout with ease |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Java Spring Boot (IntelliJ) |
| Web Frontend | React.js (VS Code) |
# 🐾 Zootopia — Pet Shop System


| Mobile Frontend | Kotlin (Android Studio) |
| Database | PostgreSQL via Neon |
| API Testing | Postman |

---

## ⚙️ Setup & Installation

### 1. Database — PostgreSQL (Neon)

1. Create an account at [neon.tech](https://neon.tech)
2. Create a new project named **`pawtopia`**
3. Copy the connection string provided by Neon
4. Paste it into your backend `application.properties`:
```properties
   spring.datasource.url=
```

---

### 2. Backend — Java Spring Boot (IntelliJ)

1. Open IntelliJ IDEA and import the backend project folder
2. Update `src/main/resources/application.properties` with your Neon database connection string
3. Run the Spring Boot application

---

### 3. Web Frontend — React.js (VS Code)

1. Open the `frontend_web` folder in VS Code
2. Ensure the backend is running
3. Install dependencies and start the dev server:
```bash
   npm install
   npm run dev
```

---

### 4. Mobile Frontend — Kotlin (Android Studio)

1. Open the `frontend_mobile` folder in Android Studio
2. Ensure the backend is running
3. Run the application on an emulator or physical device

---

## 📦 Backend Dependencies

```xml
- Lombok
- OAuth2 Client
- Spring Security
- Spring Web
- Spring Data JPA
- PostgreSQL Driver
- JSON Web Token (JWT) v0.11.5
```

---

## 👥 Contributors

> IT342 — *Carlos Rogel C. Lofranco*


---

<div align="center">
Made with ❤️ for pets and their people 🐶🐱
</div>
