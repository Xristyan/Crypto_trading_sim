"use client";
import { CryptoData } from "@/types/cryptoTypes";
import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";

import { useRef } from "react";
import SockJS from "sockjs-client";

export const useCrypto = () => {
  const stompClient = useRef<Client | null>(null);
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        if (stompClient.current) {
          stompClient.current.deactivate();
        }

        const socket = new SockJS("http://localhost:8080/ws-crypto", null, {
          transports: ["websocket", "xhr-streaming", "xhr-polling"],
        });

        const client = new Client({
          webSocketFactory: () => socket,
          debug: (str) => {
            console.debug(str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
          client.subscribe("/topic/cryptos", (message) => {
            try {
              const data = JSON.parse(message.body);
              setCryptos(data);
              setLoading(false);
            } catch (err) {
              console.error("Error parsing WebSocket message:", err);
            }
          });
        };

        client.onStompError = (frame) => {
          console.error("WebSocket error:", frame);
          setError(
            "Error connecting to real-time data. Please try again later."
          );
        };

        client.activate();
        stompClient.current = client;
      } catch (err) {
        console.error("Error setting up WebSocket:", err);
        setError(
          "Failed to connect to real-time data. Please try again later."
        );
      }
    };

    connectWebSocket();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  return { cryptos, loading, error };
};
