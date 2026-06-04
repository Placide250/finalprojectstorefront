# 🛒 Final Project Storefront

A complete e-commerce storefront application built with Java, featuring product management, shopping cart, order processing, and payment integration.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

An enterprise-grade e-commerce platform providing:
- ✅ Product catalog management
- ✅ Shopping cart functionality
- ✅ Secure payment processing
- ✅ User account management
- ✅ Order tracking and history
- ✅ Inventory management
- ✅ Admin dashboard
- ✅ Responsive UI

---

## ✨ Features

### Customer Features
- 🛍️ Browse product catalog
- 🔍 Advanced search and filtering
- 🛒 Shopping cart management
- 💳 Secure checkout process
- 📦 Order tracking
- ⭐ Product reviews and ratings
- 👤 User profile management
- 📧 Email notifications

### Admin Features
- 📊 Dashboard with analytics
- 📦 Product management
- 👥 User management
- 💰 Order management
- 📈 Sales reports
- 🏷️ Inventory management
- 💳 Payment processing
- ⚙️ System configuration

### Technical Features
- 🔐 JWT authentication
- 🔒 Role-based access control
- 📝 Audit logging
- 🚀 Caching mechanisms
- 📊 Database optimization
- 🌐 RESTful API

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Language** | Java 8+ |
| **Framework** | Spring Boot |
| **Database** | MySQL / PostgreSQL |
| **Build Tool** | Maven |
| **Testing** | JUnit 5, Mockito |
| **API Documentation** | Swagger/OpenAPI |
| **Security** | Spring Security, JWT |
| **Caching** | Redis |
| **Payment Gateway** | Stripe/PayPal |

---

## 📋 Prerequisites

- **Java 8** or higher
- **Maven 3.6+**
- **MySQL 5.7+** or PostgreSQL 12+
- **Git**
- **Redis** (optional, for caching)
- **IDE** (IntelliJ IDEA, Eclipse, VS Code)

---

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/Placide250/finalprojectstorefront.git
cd finalprojectstorefront
```

### 2. Install dependencies
```bash
mvn clean install
```

### 3. Configure database
Create a new database:
```sql
CREATE DATABASE storefront_db;
```

### 4. Set up environment variables
Create `application.properties` or `application.yml`:

**`application.properties`**
```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/storefront_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT
jwt.secret=your_jwt_secret_key_here
jwt.expiration=86400000

# Payment Gateway
payment.stripe.api-key=sk_test_xxx
payment.stripe.public-key=pk_test_xxx

# Mail Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-password

# Redis (optional)
spring.redis.host=localhost
spring.redis.port=6379

# Logging
logging.level.root=INFO
logging.level.com.storefront=DEBUG
```

---

## ▶️ Running the Application

### Build the project
```bash
mvn clean build
```

### Run the application
```bash
mvn spring-boot:run
```

Application will start on: `http://localhost:8080`

### Run with specific profile
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod"
```

---

## 📁 Project Structure

```
finalprojectstorefront/
├── src/main/java/com/storefront/
│   ├── controller/           # REST endpoints
│   ├── service/              # Business logic
│   ├── repository/           # Data access
│   ├── model/                # Entity classes
│   ├── dto/                  # Data transfer objects
│   ├── security/             # JWT, authentication
│   ├── config/               # Configuration classes
│   ├── exception/            # Exception handling
│   ├── util/                 # Utility classes
│   └── StorefrontApplication.java
├── src/main/resources/
│   ├── application.properties
│   ├── application-dev.properties
│   ├── application-prod.properties
│   └── db/migration/         # Flyway migrations
├── src/test/java/
├── pom.xml
├── README.md
└── DEPLOYMENT.md
```

---

## 🗄️ Database Schema

### Core Tables

**Users**
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  role VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Products**
```sql
CREATE TABLE products (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INT NOT NULL,
  category_id BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Orders**
```sql
CREATE TABLE orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20),
  payment_status VARCHAR(20),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**Order Items**
```sql
CREATE TABLE order_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication
```
Headers:
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

### Core Endpoints

#### Products
```
GET    /products              - List all products
GET    /products/:id          - Get product by ID
GET    /products/search       - Search products
POST   /products              - Create product (admin)
PUT    /products/:id          - Update product (admin)
DELETE /products/:id          - Delete product (admin)
```

#### Cart
```
GET    /cart                  - Get shopping cart
POST   /cart/items            - Add item to cart
PUT    /cart/items/:id        - Update cart item
DELETE /cart/items/:id        - Remove item from cart
```

#### Orders
```
GET    /orders                - List user orders
GET    /orders/:id            - Get order details
POST   /orders                - Create new order
PUT    /orders/:id/cancel     - Cancel order
GET    /orders/:id/invoice    - Download invoice
```

#### Users
```
POST   /auth/register         - User registration
POST   /auth/login            - User login
GET    /users/profile         - Get user profile
PUT    /users/profile         - Update profile
```

---

## 🧪 Testing

### Run all tests
```bash
mvn test
```

### Run tests by category
```bash
mvn test -Dtest=*ProductTest
mvn test -Dtest=*OrderTest
```

### Run with coverage
```bash
mvn clean test jacoco:report
# View: target/site/jacoco/index.html
```

### Integration tests
```bash
mvn verify
```

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check MySQL is running
mysql -u root -p
# Test connection in application.properties
```

### Port Already in Use
```bash
# Change port in application.properties
server.port=8081
```

### Maven Build Failures
```bash
# Clear cache and rebuild
mvn clean install -U
```

---

## 🚀 Deployment

### Production Build
```bash
mvn clean package -P production
java -jar target/storefront-1.0.0.jar
```

### Docker Deployment
```bash
docker build -t storefront:latest .
docker run -p 8080:8080 storefront:latest
```

### Cloud Deployment (AWS/Azure/GCP)
See `DEPLOYMENT.md` for detailed instructions

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👥 Team

- **Project Lead:** Final Project Team
- **Developers:** Placide250 & Contributors

---

## 📞 Support

- 📧 Email: support@storefront.com
- 🐛 GitHub Issues: [Report a bug](https://github.com/Placide250/finalprojectstorefront/issues)
- 💬 Discussions: [Ask a question](https://github.com/Placide250/finalprojectstorefront/discussions)

---

**Last Updated:** June 4, 2026
**Version:** 1.0.0
