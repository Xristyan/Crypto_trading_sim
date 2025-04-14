package com.trading_212.crypto_sim.repository.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.trading_212.crypto_sim.model.Transaction;
import com.trading_212.crypto_sim.model.TransactionType;
import com.trading_212.crypto_sim.repository.TransactionRepository;

@Repository
public class TransactionRepositoryImpl implements TransactionRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Transaction> transactionRowMapper = (rs, rowNum) -> {
        Transaction transaction = new Transaction();
        transaction.setId(rs.getInt("id"));
        transaction.setUserId(rs.getInt("user_id"));
        transaction.setCryptoSymbol(rs.getString("crypto_symbol"));
        transaction.setTransactionType(TransactionType.valueOf(rs.getString("transaction_type")));
        transaction.setQuantity(rs.getBigDecimal("quantity"));
        transaction.setPricePerUnit(rs.getBigDecimal("price_per_unit"));
        transaction.setTotalPrice(rs.getBigDecimal("total_price"));
        transaction.setProfitLoss(rs.getBigDecimal("profit_loss"));
        transaction.setTimestamp(rs.getTimestamp("timestamp").toLocalDateTime());
        return transaction;
    };
        

    @Override
    public void save(Transaction transaction) {
        String sql = "INSERT INTO transactions (user_id, crypto_symbol, transaction_type, quantity, price_per_unit, total_price, profit_loss, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, 
            transaction.getUserId(), 
            transaction.getCryptoSymbol(), 
            transaction.getTransactionType().name(),
            transaction.getQuantity(), 
            transaction.getPricePerUnit(), 
            transaction.getTotalPrice(), 
            transaction.getProfitLoss(), 
            transaction.getTimestamp()
        );
    }


    @Override
    public Optional<List<Transaction>> findAllByUserId(int userId) {
        String sql = "SELECT * FROM transactions WHERE user_id = ?";
        List<Transaction> transactions = jdbcTemplate.query(sql, transactionRowMapper, userId);
        return transactions.isEmpty() ? Optional.empty() : Optional.of(transactions);
    }

    @Override
    public boolean resetTransactions(int userId) {
        String sql = "DELETE FROM transactions WHERE user_id = ?";
        int rowsAffected = jdbcTemplate.update(sql, userId);
        return rowsAffected > 0;
    }

    
}
