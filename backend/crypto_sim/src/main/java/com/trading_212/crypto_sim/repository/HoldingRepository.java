package com.trading_212.crypto_sim.repository;

import java.util.List;
import java.util.Optional;
import com.trading_212.crypto_sim.model.Holding;

 public interface HoldingRepository {
    
    /**
     * Find all holdings by user id
     * @param userId User id
     * @return Optional containing list of holdings if found
     */
    public Optional<List<Holding>> findAllByUserId(int userId);
    
    /**
     * Save a holding
     * @param holding Holding to save
     * @return Saved holding
     */
    public Holding save(Holding holding);
    
    /**
     * Delete a holding by id
     * @param id Id of the holding to delete
     */
    public void deleteById(Integer id);

    /**
     * Reset holdings for a user
     * @param userId User id
     * @return true if updated successfully
     */
    public boolean resetHoldings(int userId);
}
