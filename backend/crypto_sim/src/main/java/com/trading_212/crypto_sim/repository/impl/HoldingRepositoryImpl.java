package com.trading_212.crypto_sim.repository.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import lombok.extern.slf4j.Slf4j;

import com.trading_212.crypto_sim.model.Holding;
import com.trading_212.crypto_sim.repository.HoldingRepository;

@Repository
@Slf4j
public class HoldingRepositoryImpl implements HoldingRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Holding> holdingRowMapper = (rs, rowNum) -> {
        
        Holding holding = new Holding();
        holding.setId(rs.getInt("id"));
        holding.setCryptoSymbol(rs.getString("crypto_symbol"));
        holding.setQuantity(rs.getBigDecimal("quantity"));
        holding.setPricePerUnit(rs.getBigDecimal("price_per_unit"));
        holding.setTotalCost(rs.getBigDecimal("total_cost"));
      
        return holding;
    };

    @Override
    public Optional<List<Holding>> findAllByUserId(int userId) {
        String sql="SELECT * FROM holdings WHERE user_id = ?";
       List<Holding> holdings= jdbcTemplate.query(sql, holdingRowMapper, userId);
       return holdings.isEmpty() ? Optional.empty() : Optional.of(holdings);
    }

    @Override
    public boolean resetHoldings(int userId) {
        String sql = "DELETE FROM holdings WHERE user_id = ?";
        int rowsAffected = jdbcTemplate.update(sql, userId);
        return rowsAffected > 0;
    }
    
    @Override
    public Holding save(Holding holding) {
        if (holding.getId() == null) {
            String sql = "INSERT INTO holdings (user_id, crypto_symbol, quantity, price_per_unit, total_cost) VALUES (?, ?, ?, ?, ?)";
           jdbcTemplate.update(
                sql,
                holding.getUserId(),
                holding.getCryptoSymbol(),
                holding.getQuantity(),
                holding.getPricePerUnit(),
                holding.getTotalCost()
            );
        } else {
            String sql = "UPDATE holdings SET quantity = ?, price_per_unit = ?, total_cost = ? WHERE id = ?";
            jdbcTemplate.update(
                sql,
                holding.getQuantity(),
                holding.getPricePerUnit(),
                holding.getTotalCost(),
                holding.getId()
            );
        }
        return holding;
    }

    @Override
    public void deleteById(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("Cannot delete holding with null id");
        }
        
        String sql = "DELETE FROM holdings WHERE id = ?";
        int rowsAffected = jdbcTemplate.update(sql, id);
        
        if (rowsAffected == 0) {
            log.warn("No holding found with id {} to delete", id);
        } else {
            log.debug("Deleted holding with id {}", id);
        }
    }
}
