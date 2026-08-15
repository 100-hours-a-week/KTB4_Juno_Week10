import { Client } from "@stomp/stompjs";
import { getAccessToken } from "@/api/storage";

const WS_URL = "ws://localhost:8080/ws";

export const createChatClient = ({
  onConnect,
  onDisconnect,
  onStompError,
  onWebSocketError,
}) => {
  const accessToken = getAccessToken();

  const client = new Client({
    brokerURL: WS_URL,

    connectHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },

    reconnectDelay: 5000,

    onConnect,
    onDisconnect,

    onStompError: (frame) => {
      console.error("STOMP 오류:", frame);

      onStompError?.(frame);
    },

    onWebSocketError: (error) => {
      console.error("WebSocket 오류:", error);

      onWebSocketError?.(error);
    },
  });

  return client;
};
