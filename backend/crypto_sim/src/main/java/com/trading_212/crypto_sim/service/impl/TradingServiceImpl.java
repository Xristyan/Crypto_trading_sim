package com.trading_212.crypto_sim.service.impl;

import com.trading_212.crypto_sim.model.User;
import com.trading_212.crypto_sim.repository.UserRepository;
import com.trading_212.crypto_sim.service.TradingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.trading_212.crypto_sim.exeption.InsufficientFundsException;
import com.trading_212.crypto_sim.exeption.NotFoundException;
import com.trading_212.crypto_sim.model.Holding;
import com.trading_212.crypto_sim.model.Transaction;
import com.trading_212.crypto_sim.model.TransactionType;
import com.trading_212.crypto_sim.repository.HoldingRepository;
import com.trading_212.crypto_sim.repository.TransactionRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Collections;

@Service
@Slf4j
public class TradingServiceImpl implements TradingService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private HoldingRepository holdingRepository;
    @Autowired
    private TransactionRepository transactionRepository;

    @Override
    public User getUserInfo(int userId) {
        Optional<User> user = userRepository.findById(userId);

        if(user.isEmpty()) {
            throw new NotFoundException("User not found");
        }

        Optional<List<Holding>> holdings = holdingRepository.findAllByUserId(userId);
        user.get().setHoldings(holdings.isPresent() ? holdings.get() : Collections.emptyList());

        Optional<List<Transaction>> transactions = transactionRepository.findAllByUserId(userId);
        user.get().setTransactions(transactions.isPresent() ? transactions.get() : Collections.emptyList());

        return user.get();
    }

    @Override
    public void resetUser(int userId) {

        Optional<User> user = userRepository.findById(userId);

        if(user.isEmpty()) {
            throw new NotFoundException("User not found");
        }

        userRepository.resetUser(userId);
        holdingRepository.resetHoldings(userId);
        transactionRepository.resetTransactions(userId);   

    }

    @Override
    public void buyCrypto(int userId, String cryptoSymbol, BigDecimal pricePerUnit, BigDecimal purchaseCost) {

        Optional<User> user = userRepository.findById(userId);

        if (user.isEmpty()) {
            throw new NotFoundException("User not found");
        }
        
        BigDecimal userBalance = user.get().getBalance();

        
        if (userBalance.compareTo(purchaseCost) < 0) {
            throw new InsufficientFundsException("Insufficient funds to complete purchase");
        }

        if(purchaseCost.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Purchase cost must be greater than 0");
        }
        
        Optional<List<Holding>> holdings = holdingRepository.findAllByUserId(userId);
        
        BigDecimal quantity = purchaseCost.divide(pricePerUnit, 8, RoundingMode.HALF_UP);

        Holding holding = holdings.isPresent() 
            ? holdings.get().stream()
                .filter(h -> h.getCryptoSymbol().equals(cryptoSymbol))
                .findFirst()
                .orElse(null)
            : null;      

        if (holding == null) {   
            BigDecimal initialTotalCost = purchaseCost;
            holding = new Holding(null,userId,cryptoSymbol,quantity,pricePerUnit,initialTotalCost);
        } else {
            BigDecimal additionalCost = purchaseCost;
            BigDecimal updatedQuantity = holding.getQuantity().add(quantity);
            holding.setQuantity(updatedQuantity);
            
            BigDecimal updatedTotalCost = holding.getTotalCost().add(additionalCost);
            holding.setTotalCost(updatedTotalCost);
            
            BigDecimal updatedAvgPrice = updatedTotalCost.divide(updatedQuantity, 8, RoundingMode.HALF_UP);
            holding.setPricePerUnit(updatedAvgPrice);
        }
        
        try {
            holdingRepository.save(holding);
        
            BigDecimal updatedBalance = user.get().getBalance().setScale(2, RoundingMode.HALF_UP).subtract(purchaseCost);
            userRepository.updateBalance(userId, updatedBalance);

            saveTransaction(userId, cryptoSymbol,TransactionType.BUY, quantity, pricePerUnit, null);
            
        } catch (Exception e) {
            log.error("Error saving holding: {}", e.getMessage());
            throw new RuntimeException("Failed to complete purchase: " + e.getMessage(), e);
        }
    }

    @Override
    public void sellCrypto(int userId, String cryptoSymbol, BigDecimal quantity, BigDecimal pricePerUnit) {
        Optional<User> user = userRepository.findById(userId);

        if (user.isEmpty()) {
            throw new NotFoundException("User not found");
        }
        
        Optional<List<Holding>> holdings = holdingRepository.findAllByUserId(userId);
        
        if (holdings.isEmpty()) {
            throw new NotFoundException("No holdings found for this user");
        }
        
        Holding holding = holdings.get().stream()
            .filter(h -> h.getCryptoSymbol().equals(cryptoSymbol))
            .findFirst()
            .orElse(null);
            
        if (holding == null) {
            throw new NotFoundException("You don't own any " + cryptoSymbol);
        }
        
        if (holding.getQuantity().compareTo(quantity) < 0) {
            throw new InsufficientFundsException("Insufficient quantity to sell. You own " + 
                holding.getQuantity() + " " + cryptoSymbol);
        }
        
        BigDecimal saleValue = quantity.multiply(pricePerUnit);
        
        try {
            BigDecimal remainingQuantity = holding.getQuantity().subtract(quantity);
            
            if (remainingQuantity.compareTo(BigDecimal.ZERO) == 0) {
                holdingRepository.deleteById(holding.getId());
            } else {
                holding.setQuantity(remainingQuantity);
                
                BigDecimal percentageSold = quantity.divide(holding.getQuantity().add(quantity), 8, RoundingMode.HALF_UP);
                BigDecimal costReduction = holding.getTotalCost().multiply(percentageSold);
                holding.setTotalCost(holding.getTotalCost().subtract(costReduction));
                
                holdingRepository.save(holding);
            }
            
            BigDecimal newBalance = user.get().getBalance().add(saleValue);
            userRepository.updateBalance(userId, newBalance);

            saveTransaction(userId, cryptoSymbol,TransactionType.SELL, quantity, holding.getPricePerUnit(), saleValue);
            
        } catch (Exception e) {
            log.error("Error completing sale: {}", e.getMessage());
            throw new RuntimeException("Failed to complete sale: " + e.getMessage(), e);
        }
    }


    private void saveTransaction(int userId, String cryptoSymbol,TransactionType transactionType, BigDecimal quantity, BigDecimal pricePerUnit, BigDecimal salePrice) {
        BigDecimal price = quantity.multiply(pricePerUnit);

        BigDecimal profitLoss = BigDecimal.ZERO;

        if(transactionType == TransactionType.BUY) {
            profitLoss = new BigDecimal("0.00");
        } else {
            profitLoss = salePrice.subtract(price);
        }

        Transaction transaction =new Transaction(null, userId, cryptoSymbol, transactionType, quantity, pricePerUnit, price, profitLoss, LocalDateTime.now());
        try {
            transactionRepository.save(transaction);
        } catch (Exception e) {
            log.error("Error saving transaction: {}", e.getMessage());
            throw new RuntimeException("Failed to save transaction: " + e.getMessage(), e);
        }
    }

} 