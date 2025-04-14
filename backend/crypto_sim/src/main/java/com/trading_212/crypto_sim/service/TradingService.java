package com.trading_212.crypto_sim.service;

import com.trading_212.crypto_sim.model.User;

import java.math.BigDecimal;

public interface TradingService {
    
    /**
     * Get user info
     * @param userId User ID
     * @return User information
     */
    User getUserInfo(int userId);

    /**
     * Reset user
     * @param userId User ID
     */
    void resetUser(int userId);

    /**
     * Buy crypto
     * @param userId User ID
     * @param cryptoSymbol Crypto symbol
     * @param quantity Quantity
     * @param pricePerUnit Price per unit
     */
    void buyCrypto(int userId, String cryptoSymbol,  BigDecimal pricePerUnit, BigDecimal amount);


    /**
     * Sell crypto
     * @param userId User ID
     * @param cryptoSymbol Crypto symbol
     * @param quantity Quantity
     * @param pricePerUnit Price per unit
     */
    void sellCrypto(int userId, String cryptoSymbol, BigDecimal quantity, BigDecimal pricePerUnit);
} 