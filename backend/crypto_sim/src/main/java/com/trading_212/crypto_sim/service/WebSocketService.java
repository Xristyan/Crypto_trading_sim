package com.trading_212.crypto_sim.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WebSocketService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
 
    public void broadcastCryptoUpdates(List<JsonNode> cryptoData) {
       
        messagingTemplate.convertAndSend("/topic/cryptos", cryptoData);
    }
} 