package com.trading_212.crypto_sim.repository.impl;

import com.trading_212.crypto_sim.model.User;
import com.trading_212.crypto_sim.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;


import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class UserRepositoryImpl implements UserRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    private final RowMapper<User> userRowMapper = (rs, rowNum) -> {
        User user = new User();
        user.setId(rs.getInt("id"));
        user.setUsername(rs.getString("username"));
        user.setBalance(rs.getBigDecimal("balance"));
       
        Timestamp timestamp = rs.getTimestamp("created_at");
        
        user.setCreatedAt(timestamp != null ? timestamp.toLocalDateTime() : null);
        return user;
    };
   
    @Override
    public Optional<User> findById(int id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        List<User> users = jdbcTemplate.query(sql, userRowMapper, id);
        return users.isEmpty() ? Optional.empty() : Optional.of(users.get(0));
    }

    @Override
    public boolean resetUser(int userId) {
        String sql = "UPDATE users SET balance = 10000 WHERE id = ?";
        int rowsAffected = jdbcTemplate.update(sql, userId);
        return rowsAffected > 0;
    }

    @Override
    public boolean updateBalance(int userId, BigDecimal newBalance) {
        String sql = "UPDATE users SET balance = ? WHERE id = ?";
        int rowsAffected = jdbcTemplate.update(sql, newBalance, userId);
        return rowsAffected > 0;
    }

} 