package com.trading_212.crypto_sim.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BuyRequest {
    private String cryptoSymbol;
    private String amount;
    private String pricePerUnit;
}
