import { Client } from "@stomp/stompjs";
import { getAccessToken } from "@/api/storage";

const WS_URL = "ws://localhost:8080/ws";

export const createChatClient = ({
  onConnect,
  onDisconnect,
  onStompError,
  onWebSocketError,
  onWebSocketClose,
  onHeartbeatLost,
}) => {
  const accessToken = getAccessToken();

  const client = new Client({
    brokerURL: WS_URL,

    connectHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },

    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

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

    onWebSocketClose: (event) => {
      console.log("WebSocket 연결 종료:", event);

      onWebSocketClose?.(event);
    },

    onHeartbeatLost: () => {
      console.log("STOMP heartbeat 손실");

      onHeartbeatLost?.();
    },
  });

  return client;
};
