# Crypto Trading Simulator - API Documentation

## Overview

The Crypto Trading Simulator provides a RESTful API to simulate cryptocurrency trading activities. The API allows users to view their portfolio, buy and sell cryptocurrencies, and track transaction history, all without risking real money.

## Base URL

```
http://localhost:8080/api
```

## Authentication

Currently, the API uses a simplified authentication model with a default user ID. In production environments, proper authentication middleware should be implemented.

## API Endpoints

### User Information

#### Get User Information

Retrieves information about a user, including their balance, holdings, and transaction history.

- **URL**: `/users/{userId}`
- **Method**: `GET`
- **URL Parameters**:
  - `userId` (integer, required): The ID of the user
- **Response**:
  ```json
  {
    "id": 1,
    "username": "testUser",
    "balance": 10000.0,
    "createdAt": "2023-05-10T14:30:45",
    "holdings": [
      {
        "id": 1,
        "userId": 1,
        "cryptoSymbol": "BTC/USD",
        "quantity": 0.5,
        "pricePerUnit": 80000.0,
        "totalCost": 40000.0
      }
    ],
    "transactions": [
      {
        "id": 1,
        "userId": 1,
        "cryptoSymbol": "BTC/USD",
        "transactionType": "BUY",
        "quantity": 0.5,
        "pricePerUnit": 80000.0,
        "totalPrice": 40000.0,
        "profitLoss": 0.0,
        "timestamp": "2023-05-10T14:35:12"
      }
    ]
  }
  ```

#### Reset User

Resets a user's account, clearing all holdings and transactions and restoring the default balance.

- **URL**: `/users/{userId}/reset`
- **Method**: `POST`
- **URL Parameters**:
  - `userId` (integer, required): The ID of the user
- **Response**:
  - Status: 200 OK

### Trading Operations

#### Buy Cryptocurrency

Allows a user to purchase a cryptocurrency with their available balance.

- **URL**: `/users/{userId}/buy`
- **Method**: `POST`
- **URL Parameters**:
  - `userId` (integer, required): The ID of the user
- **Request Body**:
  ```json
  {
    "cryptoSymbol": "BTC/USD",
    "amount": "1000.00",
    "pricePerUnit": "45000.00"
  }
  ```
- **Fields**:
  - `cryptoSymbol` (string, required): The trading pair symbol (e.g., "BTC/USD")
  - `amount` (string, required): The amount in fiat currency to spend on the purchase
  - `pricePerUnit` (string, required): The current price per unit of the cryptocurrency
- **Response**:
  - Status: 200 OK

#### Sell Cryptocurrency

Allows a user to sell a cryptocurrency from their holdings.

- **URL**: `/users/{userId}/sell`
- **Method**: `POST`
- **URL Parameters**:
  - `userId` (integer, required): The ID of the user
- **Request Body**:
  ```json
  {
    "cryptoSymbol": "BTC/USD",
    "quantity": "0.02",
    "pricePerUnit": "46000.00"
  }
  ```
- **Fields**:
  - `cryptoSymbol` (string, required): The trading pair symbol (e.g., "BTC/USD")
  - `quantity` (string, required): The quantity of the cryptocurrency to sell
  - `pricePerUnit` (string, required): The current price per unit of the cryptocurrency
- **Response**:
  - Status: 200 OK

## WebSocket API

The simulator also provides real-time cryptocurrency price data via WebSockets.

### Connect to WebSocket

- **URL**: `ws://localhost:8080/ws-crypto`
- **Protocol**: STOMP over WebSocket

### Subscribe to Cryptocurrency Updates

- **Topic**: `/topic/cryptos`
- **Message Format**:
  ```json
  [
    {
      "symbol": "BTC/USD",
      "bid": 45000.0,
      "bid_qty": 1.5,
      "ask": 45100.0,
      "ask_qty": 2.0,
      "last": 45050.0,
      "volume": 100.5,
      "vwap": 44980.75,
      "low": 44500.0,
      "high": 45200.0,
      "change": 500.0,
      "change_pct": 1.12
    },
    {
      "symbol": "ETH/USD",
      "bid": 3000.0,
      "bid_qty": 10.0,
      "ask": 3010.0,
      "ask_qty": 15.0,
      "last": 3005.0,
      "volume": 500.25,
      "vwap": 2998.5,
      "low": 2950.0,
      "high": 3020.0,
      "change": 55.0,
      "change_pct": 1.86
    }
  ]
  ```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests:

- **200 OK**: The request was successful
- **400 Bad Request**: The request was invalid or could not be processed
- **404 Not Found**: The requested resource was not found
- **500 Internal Server Error**: An unexpected error occurred on the server

Error responses include a message describing the error:

```json
{
  "message": "Insufficient funds to complete purchase"
}
```

## Common Error Messages

- **"User not found"**: The specified user does not exist
- **"Insufficient funds to complete purchase"**: The user does not have enough balance for the purchase
- **"No holdings found for this user"**: The user does not have any cryptocurrency holdings
- **"You don't own any {cryptoSymbol}"**: The user does not own the cryptocurrency they are trying to sell
- **"Insufficient quantity to sell"**: The user does not have enough of the cryptocurrency to sell the requested amount
