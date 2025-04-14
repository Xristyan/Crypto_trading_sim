package com.trading_212.crypto_sim.service.impl;

import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


import com.trading_212.crypto_sim.model.Holding;
import com.trading_212.crypto_sim.model.User;
import com.trading_212.crypto_sim.repository.HoldingRepository;
import com.trading_212.crypto_sim.repository.TransactionRepository;
import com.trading_212.crypto_sim.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class TradingServiceImplTest {

    @Mock
    private UserRepository userRepository;
    
    @Mock
    private HoldingRepository holdingRepository;
    
    @Mock
    private TransactionRepository transactionRepository;
    
    @InjectMocks
    private TradingServiceImpl tradingService;
    
    private User testUser;
    private List<Holding> testHoldings;
    
    @BeforeEach
    void setUp() {
        // Create test user
        testUser = new User();
        testUser.setId(1);
        testUser.setUsername("testUser");
        testUser.setBalance(new BigDecimal("10000.00"));
        testUser.setCreatedAt(LocalDateTime.now());
        
        testHoldings = new ArrayList<>();
        Holding holding1 = new Holding();
        holding1.setId(1);
        holding1.setUserId(1);
        holding1.setCryptoSymbol("BTC/USD");
        holding1.setQuantity(new BigDecimal("0.5"));
        holding1.setPricePerUnit(new BigDecimal("80000.00"));
        holding1.setTotalCost(new BigDecimal("40000.00"));
        
        Holding holding2 = new Holding();
        holding2.setId(2);
        holding2.setUserId(1);
        holding2.setCryptoSymbol("ETH/USD");
        holding2.setQuantity(new BigDecimal("5.0"));
        holding2.setPricePerUnit(new BigDecimal("3000.00"));
        holding2.setTotalCost(new BigDecimal("15000.00"));
        
        testHoldings.add(holding1);
        testHoldings.add(holding2);
        
        lenient().when(transactionRepository.findAllByUserId(anyInt())).thenReturn(Optional.of(new ArrayList<>()));
    }
    
} 