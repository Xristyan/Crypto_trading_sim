# Crypto Trading Simulator - Architecture Documentation

## System Architecture

The Crypto Trading Simulator is built using a modern, multi-tier architecture that separates concerns and promotes maintainability and scalability.

### High-Level Architecture

```
┌────────────────┐      ┌────────────────┐      ┌────────────────┐
│   Frontend     │◄────►│    Backend     │◄────►│   Database     │
│  (Next.js)     │      │ (Spring Boot)  │      │   (MySQL)      │
└────────────────┘      └────────────────┘      └────────────────┘
                              ▲
                              │
                              ▼
                        ┌────────────────┐
                        │  External API  │
                        │  (Mock Data)   │
                        └────────────────┘
```

## Components

### Frontend (Next.js)

The frontend is built with Next.js, a React framework that provides server-side rendering, routing, and other features. It communicates with the backend through RESTful APIs and WebSockets for real-time updates.

#### Key Components:

- **User Provider**: Manages user state across the application
- **Crypto Hook**: Handles WebSocket connections for real-time cryptocurrency data
- **Trading Components**: UI elements for displaying and interacting with cryptocurrency data
- **Modal Components**: For buy/sell operations

### Backend (Spring Boot)

The backend is built with Spring Boot, a Java framework that simplifies building robust, production-grade applications. It follows a layered architecture pattern to separate concerns:

#### Layers:

1. **Controller Layer**: Handles HTTP requests and responses
2. **Service Layer**: Contains business logic
3. **Repository Layer**: Manages data access
4. **Model Layer**: Represents domain entities
5. **DTO Layer**: Data Transfer Objects for API communication

#### Key Components:

- **TradingController**: REST API endpoints for trading operations
- **TradingService**: Business logic for trading operations
- **WebSocket Configuration**: For real-time cryptocurrency data
- **Repositories**: Data access components

### Database (MySQL)

The application uses MySQL to store user data, transaction history, and cryptocurrency holdings.

#### Main Tables:

- **users**: Stores user information like ID, username, balance
- **holdings**: Records the cryptocurrencies owned by users
- **transactions**: Logs all buy/sell transactions

## Design Decisions

### DTOs vs. Direct Entity Usage

The application uses Data Transfer Objects (DTOs) like `BuyRequest` and `SellRequest` to decouple the API contract from the internal domain model. This provides several benefits:

1. **API Stability**: Changes to internal models don't necessarily affect the API
2. **Security**: Control what data is exposed through the API
3. **Validation**: Input validation can be done at the boundary

### WebSockets for Real-Time Data

Instead of polling, the application uses WebSockets to provide real-time cryptocurrency price updates. This:

1. Reduces server load
2. Provides instant price updates
3. Improves user experience

### Stateless API Design

The REST API is stateless, with each request containing all information needed to process it. This approach:

1. Improves scalability (horizontally)
2. Simplifies the server-side implementation
3. Enables better caching strategies

### Exception Handling

The application uses custom exceptions (`NotFoundException`, `InsufficientFundsException`) and global exception handling to provide consistent error responses across all endpoints.

## Transaction Processing

### Buy Process:

1. User submits buy request with amount to spend and current price
2. System verifies sufficient funds
3. System calculates quantity based on price and amount
4. If user already holds this cryptocurrency, the system updates the existing holding with new quantity and recalculates average price
5. Otherwise, a new holding is created
6. User balance is reduced by purchase amount
7. Transaction record is created

### Sell Process:

1. User submits sell request with quantity to sell and current price
2. System verifies user owns sufficient quantity
3. System calculates sale proceeds
4. User's cryptocurrency holding is reduced or removed if selling all
5. User balance is increased by sale proceeds
6. Transaction record is created with profit/loss calculation
