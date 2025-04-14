package com.trading_212.crypto_sim.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Integer id;
    private String username;
    private BigDecimal balance;
    private LocalDateTime createdAt;
    private List<Holding> holdings;
    private List<Transaction> transactions;
} 