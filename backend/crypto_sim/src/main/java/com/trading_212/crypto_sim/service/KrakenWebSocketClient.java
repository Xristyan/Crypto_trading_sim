package com.trading_212.crypto_sim.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;


@Service
@Slf4j
public class KrakenWebSocketClient {

    private static final String KRAKEN_WSS_URL = "wss://ws.kraken.com/v2";
    
    private static final String[] TOP_CRYPTO_PAIRS = {
            "BTC/USD", "ETH/USD", "SOL/USD", "XRP/USD", "ADA/USD", 
            "DOGE/USD", "TRX/USD", "AVAX/USD", "LINK/USD", "DOT/USD",
            "SHIB/USD", "LTC/USD", "MATIC/USD", "BCH/USD", "UNI/USD",
            "ATOM/USD", "XMR/USD", "ETC/USD", "FIL/USD", "NEAR/USD"
    };
    
    private WebSocketClient webSocketClient;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private boolean connected = false;
    
    private final List<String> recentMessages = new ArrayList<>();
    
    private final Map<String, JsonNode> latestTickerData = new ConcurrentHashMap<>();


    @Autowired
    private WebSocketService webSocketService;

    @PostConstruct
    public void init() {
        connectWebSocket();
    }

    @PreDestroy
    public void cleanup() {
        closeWebSocket();
    }
  
    public boolean isConnected() {
        return connected;
    }
    
    public List<String> getRawMessages() {
        return new ArrayList<>(recentMessages);
    }
 
    public List<String> getLatestMessages(int count) {
        if (recentMessages.isEmpty()) {
            return recentMessages;
        }
        
        int start = Math.max(0, recentMessages.size() - count);
        return recentMessages.subList(start, recentMessages.size());
    }
    
    public List<JsonNode> getLatestTickerData() {
        return new ArrayList<>(latestTickerData.values());
    }
   
    public List<JsonNode> getTop20TickerData() {
        List<JsonNode> result = new ArrayList<>();
        for (String symbol : TOP_CRYPTO_PAIRS) {
            if (latestTickerData.containsKey(symbol)) {
                result.add(latestTickerData.get(symbol));
            }
        }
        return result;
    }
    
    public void connectWebSocket() {
        try {
            webSocketClient = new WebSocketClient(new URI(KRAKEN_WSS_URL)) {
                @Override
                public void onOpen(ServerHandshake handshake) {
                    log.info("WebSocket connection opened to Kraken");
                    connected = true;
                    subscribeToTickers();
                }

                @Override
                public void onMessage(String message) {
                    if (recentMessages.size() >= 100) {
                        recentMessages.remove(0);
                    }
                    recentMessages.add(message);
                    
                    processTickerMessage(message);
                }

                @Override
                public void onClose(int code, String reason, boolean remote) {
                    log.info("WebSocket connection closed: {}", reason);
                    connected = false;
                    
                    if (remote) {
                        new Timer().schedule(new TimerTask() {
                            @Override
                            public void run() {
                                connectWebSocket();
                            }
                        }, 5000);
                    }
                }

                @Override
                public void onError(Exception ex) {
                    log.error("WebSocket error: {}", ex.getMessage());
                }
            };

            webSocketClient.connect();
        } catch (URISyntaxException e) {
            log.error("Invalid WebSocket URI: {}", e.getMessage());
        }
    }

    public void closeWebSocket() {
        if (webSocketClient != null && webSocketClient.isOpen()) {
            webSocketClient.close();
            connected = false;
        }
    }

    private void subscribeToTickers() {
        try {
            Map<String, Object> subscribeMsg = new HashMap<>();
            subscribeMsg.put("method", "subscribe");
            
            Map<String, Object> params = new HashMap<>();
            params.put("channel", "ticker");
            params.put("symbol", Arrays.asList(TOP_CRYPTO_PAIRS));
            
            subscribeMsg.put("params", params);
            
            String subscribePayload = objectMapper.writeValueAsString(subscribeMsg);
            webSocketClient.send(subscribePayload);
            
        } catch (JsonProcessingException e) {
            log.error("Error creating subscription message: {}", e.getMessage());
        }
    }

    private void processTickerMessage(String message) {
        try {
            JsonNode jsonNode = objectMapper.readTree(message);
            
            if (jsonNode.has("channel") && "ticker".equals(jsonNode.get("channel").asText()) && jsonNode.has("data")) {
                JsonNode dataNode = jsonNode.get("data");
                
                if (dataNode.isArray()) {
                    boolean dataUpdated = false;
                    for (JsonNode item : dataNode) {
                        if (item.has("symbol")) {
                            String symbol = item.get("symbol").asText();
                            latestTickerData.put(symbol, item);
                            dataUpdated = true;
                        }
                    }
                    
                    if (dataUpdated) {
                        List<JsonNode> cryptoList = getTop20TickerData();
                        cryptoList.sort((a, b) -> {
                            String symbolA = a.has("symbol") ? a.get("symbol").asText() : "";
                            String symbolB = b.has("symbol") ? b.get("symbol").asText() : "";
                            return symbolA.compareTo(symbolB);
                        });
                        
                        webSocketService.broadcastCryptoUpdates(cryptoList);
                        
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error processing ticker message: {}", e.getMessage());
        }
    }
} 