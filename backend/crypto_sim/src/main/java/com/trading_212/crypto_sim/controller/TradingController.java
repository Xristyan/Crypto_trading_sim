package com.trading_212.crypto_sim.controller;

import com.trading_212.crypto_sim.dto.BuyRequest;
import com.trading_212.crypto_sim.dto.SellRequest;
import com.trading_212.crypto_sim.model.User;
import com.trading_212.crypto_sim.service.TradingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class TradingController {

    @Autowired
    private TradingService tradingService;

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserInfo(@PathVariable int userId) {    
        User user = tradingService.getUserInfo(userId);

        return ResponseEntity.ok(user);
    }

    @PostMapping("/{userId}/reset")
    public ResponseEntity<?> resetUser(@PathVariable int userId) {
        tradingService.resetUser(userId);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}/buy")
    public ResponseEntity<?> buyCrypto(@PathVariable int userId, @RequestBody BuyRequest request) {
        String cryptoSymbol = request.getCryptoSymbol();
        BigDecimal pricePerUnit = new BigDecimal(request.getPricePerUnit());
        BigDecimal amount = new BigDecimal(request.getAmount());
        tradingService.buyCrypto(userId, cryptoSymbol, pricePerUnit, amount);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}/sell")
    public ResponseEntity<?> sellCrypto(@PathVariable int userId, @RequestBody SellRequest request) {
        String cryptoSymbol = request.getCryptoSymbol();
        BigDecimal quantity = new BigDecimal(request.getQuantity());
        BigDecimal pricePerUnit = new BigDecimal(request.getPricePerUnit());
        tradingService.sellCrypto(userId, cryptoSymbol, quantity, pricePerUnit);
        
        return ResponseEntity.ok().build();
    }

} 