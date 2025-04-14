package com.trading_212.crypto_sim.controller;

import com.trading_212.crypto_sim.service.KrakenWebSocketClient;
import com.trading_212.crypto_sim.service.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cryptos")
@CrossOrigin(origins = "*")
public class CryptoController {

    @Autowired
    private KrakenWebSocketClient krakenWebSocketClient;
    @Autowired
    private WebSocketService webSocketService;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("connected", krakenWebSocketClient.isConnected());
        status.put("messageCount", krakenWebSocketClient.getLatestMessages(100).size());
        status.put("dataStreamActive", true);
        
        return ResponseEntity.ok(status);
    }
    
   
    @GetMapping("/broadcast")
    public ResponseEntity<Map<String, Object>> triggerBroadcast() {
        webSocketService.broadcastCryptoUpdates(krakenWebSocketClient.getLatestTickerData());
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Broadcast triggered successfully");
        return ResponseEntity.ok(response);
    }
} 