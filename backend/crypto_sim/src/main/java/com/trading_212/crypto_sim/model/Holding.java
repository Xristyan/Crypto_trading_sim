package com.trading_212.crypto_sim.model;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class Holding {
    private Integer id;
    private Integer userId;
    private String cryptoSymbol;
    private BigDecimal quantity;
    private BigDecimal pricePerUnit;
    private BigDecimal totalCost;
}
