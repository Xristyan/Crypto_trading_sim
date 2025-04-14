package com.trading_212.crypto_sim.controller;

import com.trading_212.crypto_sim.service.KrakenWebSocketClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/websocket")
@CrossOrigin(origins = "*")
public class WebSocketStatusController {

    @Autowired
    private KrakenWebSocketClient krakenWebSocketClient;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> getWebSocketStatus() {
        boolean isConnected = krakenWebSocketClient.isConnected();
        return ResponseEntity.ok(Map.of("connected", isConnected));
    }
    
    @GetMapping("/connect")
    public ResponseEntity<Map<String, String>> connectWebSocket() {
        krakenWebSocketClient.connectWebSocket();
        return ResponseEntity.ok(Map.of("status", "Connection initiated. Check logs for details."));
    }
    
    @GetMapping("/disconnect")
    public ResponseEntity<Map<String, String>> disconnectWebSocket() {
        krakenWebSocketClient.closeWebSocket();
        return ResponseEntity.ok(Map.of("status", "WebSocket disconnected"));
    }
} 