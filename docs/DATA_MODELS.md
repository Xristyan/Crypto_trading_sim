# Crypto Trading Simulator - Data Models

This document describes the core data models used in the Crypto Trading Simulator, their relationships, and database representations.

## Core Domain Models

### User

The `User` model represents a trader in the system with a balance for purchasing cryptocurrencies.

#### Java Model:

```java
public class User {
    private Integer id;
    private String username;
    private BigDecimal balance;
    private LocalDateTime createdAt;
    private List<Holding> holdings;
    private List<Transaction> transactions;
}
```

#### Database Schema:

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    balance DECIMAL(19, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Holding

The `Holding` model represents a cryptocurrency owned by a user.

#### Java Model:

```java
public class Holding {
    private Integer id;
    private Integer userId;
    private String cryptoSymbol;
    private BigDecimal quantity;
    private BigDecimal pricePerUnit;
    private BigDecimal totalCost;
}
```

#### Database Schema:

```sql
CREATE TABLE holdings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    crypto_symbol VARCHAR(20) NOT NULL,
    quantity DECIMAL(19, 8) NOT NULL,
    price_per_unit DECIMAL(19, 2) NOT NULL,
    total_cost DECIMAL(19, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY user_crypto_idx (user_id, crypto_symbol)
);
```

### Transaction

The `Transaction` model represents a buy or sell operation performed by a user.

#### Java Model:

```java
public class Transaction {
    private Integer id;
    private Integer userId;
    private String cryptoSymbol;
    private TransactionType transactionType;
    private BigDecimal quantity;
    private BigDecimal pricePerUnit;
    private BigDecimal totalPrice;
    private BigDecimal profitLoss;
    private LocalDateTime timestamp;
}
```

#### Database Schema:

```sql
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    crypto_symbol VARCHAR(20) NOT NULL,
    transaction_type ENUM('BUY', 'SELL') NOT NULL,
    quantity DECIMAL(19, 8) NOT NULL,
    price_per_unit DECIMAL(19, 2) NOT NULL,
    total_price DECIMAL(19, 2) NOT NULL,
    profit_loss DECIMAL(19, 2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### TransactionType

The `TransactionType` enum represents whether a transaction is a buy or sell operation.

#### Java Model:

```java
public enum TransactionType {
    BUY,
    SELL
}
```

## Data Transfer Objects (DTOs)

DTOs are used to transfer data between the client and server without exposing the internal model structure.

### BuyRequest

Used for buying cryptocurrency:

```java
public class BuyRequest {
    private String cryptoSymbol;
    private String amount;
    private String pricePerUnit;
}
```

### SellRequest

Used for selling cryptocurrency:

```java
public class SellRequest {
    private String cryptoSymbol;
    private String quantity;
    private String pricePerUnit;
}
```

## CryptoData

Represents real-time cryptocurrency data received via WebSocket:

```typescript
export type CryptoData = {
  symbol: string;
  bid: number;
  bid_qty: number;
  ask: number;
  ask_qty: number;
  last: number;
  volume: number;
  vwap: number;
  low: number;
  high: number;
  change: number;
  change_pct: number;
};
```

## Entity Relationships

### Entity Relationship Diagram

```
┌─────────┐           ┌──────────┐           ┌─────────────┐
│  User   │           │ Holding  │           │ Transaction │
├─────────┤          ┌┴──────────┤           ├─────────────┤
│ id      │◄─────────┤ user_id   │           │ id          │
│ username│           │ id        │           │ user_id     │◄─┐
│ balance │           │ crypto_sym│           │ crypto_sym  │  │
│ created │           │ quantity  │           │ type        │  │
└─────────┘           │ price     │           │ quantity    │  │
     │                │ cost      │           │ price       │  │
     │                └───────────┘           │ total       │  │
     │                                        │ profit_loss │  │
     │                                        │ timestamp   │  │
     │                                        └─────────────┘  │
     │                                                         │
     └─────────────────────────────────────────────────────────┘
```

## Key Relationships

1. A User can have 0 to many Holdings
2. A User can have 0 to many Transactions
3. Holdings and Transactions are associated with exactly one User
4. Transactions do not directly link to Holdings - they represent point-in-time operations

## Data Flow During Trading Operations

### Buy Operation

1. `BuyRequest` data is received from the client
2. `TradingService` processes the purchase logic:
   - Validates user has sufficient funds
   - Calculates quantity based on amount and price
   - Updates or creates a `Holding`
   - Updates user balance
   - Creates a `Transaction` record

### Sell Operation

1. `SellRequest` data is received from the client
2. `TradingService` processes the sell logic:
   - Validates user has sufficient cryptocurrency quantity
   - Calculates sale proceeds
   - Updates or removes the `Holding`
   - Updates user balance
   - Creates a `Transaction` record with profit/loss calculation

## Design Considerations

1. **Precision Handling**: `BigDecimal` is used for all financial calculations to avoid floating-point errors
2. **Audit Trail**: All transactions are preserved, even after selling holdings
3. **Average Cost Basis**: When buying more of a cryptocurrency, the average cost is recalculated
4. **Cascading Deletes**: Not used; transaction history is preserved even if a user is deleted
