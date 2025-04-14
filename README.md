# 💹 Crypto Trading Simulator

A full-stack simulation app for cryptocurrency trading using a Spring Boot backend and a React frontend.

---

## 🖥️ Frontend Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a .env file**

   In the root of the frontend project, create a file named `.env` with the following content:

   ```
   BACKEND_URL=http://localhost:8080
   DEFAULT_USER_ID=1
   ```

## 🛠️ Backend Setup

1. **Install dependencies**

   Ensure you have Java and Maven installed.

2. **Configure application.properties**

   Edit the file located at:

   ```
   backend/crypto_sim/src/main/resources/application.properties
   ```

   Set your database connection details:

   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/crypto_trading_sim
   spring.datasource.username=root
   spring.datasource.password=753159
   ```

3. **Set up the database**

   Run the schema SQL script inside your MySQL environment:

   ```sql
   -- Inside MySQL
   source backend/crypto_sim/src/main/resources/sql/schema.sql;
   ```

4. **Start the backend**

   You can run the Spring Boot app from your IDE or use the command line:

   ```bash
   cd backend/crypto_sim
   ./mvnw spring-boot:run
   ```

## 🚀 Run the App

1. **Start the frontend**

   ```bash
   npm run dev
   ```

2. **Open the app in your browser**

   ```
   http://localhost:3000
   ```
