package com.trading_212.crypto_sim.repository;

import com.trading_212.crypto_sim.model.User;

import java.math.BigDecimal;
import java.util.Optional;

public interface UserRepository {
    /**
     * Find user by id
     * @param id User id
     * @return Optional containing user if found
     */
    Optional<User> findById(int id);
    
    /**
     * Reset user
     * @param userId User id
     * @return true if updated successfully
     */
    boolean resetUser(int userId);

    /**
     * Update user balance
     * @param userId User id
     * @param newBalance New balance value
     * @return true if updated successfully
     */
    boolean updateBalance(int userId, BigDecimal newBalance);
    

} 