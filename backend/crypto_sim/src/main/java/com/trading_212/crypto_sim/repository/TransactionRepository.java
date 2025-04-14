package com.trading_212.crypto_sim.repository;

import java.util.List;
import java.util.Optional;

import com.trading_212.crypto_sim.model.Transaction;

public interface TransactionRepository {

    /**
     * Find all transactions by user id
     * @param userId User id
     * @return Optional containing list of transactions if found
     */
    public Optional<List<Transaction>> findAllByUserId(int userId);

    /**
     * Reset transactions for a user
     * @param userId User id
     * @return true if updated successfully
     */
    public boolean resetTransactions(int userId);

    /**
     * Save a transaction       
     * @param transaction Transaction to save
     * @return Saved transaction
     */
    public void save(Transaction transaction);
    
}
