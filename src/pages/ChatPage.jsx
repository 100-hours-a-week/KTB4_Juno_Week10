import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createChatClient } from "@/api/chatSocket";
import { chatApi } from "@/api";

const ChatPage = () => {
  const { chatRoomId } = useParams();

  const clientRef = useRef(null);

  const lastReceivedMessageIdRef = useRef(null);
  const hasConnectedOnceRef = useRef(false);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [messages, setMessages] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    lastReceivedMessageIdRef.current = null;
    hasConnectedOnceRef.current = false;
    const client = createChatClient({
      onConnect: async () => {
        console.log("STOMP 연결 성공");

        setConnectionStatus("connected");

        client.subscribe("/user/queue/chat", (message) => {
          const receivedMessage = JSON.parse(message.body);

          console.log("채팅 메시지 수신:", receivedMessage);

          lastReceivedMessageIdRef.current = Math.max(
            lastReceivedMessageIdRef.current ?? 0,
            receivedMessage.messageId,
          );

          setMessages((prevMessages) => {
            const isDuplicate = prevMessages.some(
              (item) => item.messageId === receivedMessage.messageId,
            );

            if (isDuplicate) {
              return prevMessages;
            }

            return [...prevMessages, receivedMessage];
          });
        });

        if (
          hasConnectedOnceRef.current &&
          lastReceivedMessageIdRef.current !== null
        ) {
          try {
            const response = await chatApi.getChatMessagesAfter({
              chatRoomId,
              lastMessageId: lastReceivedMessageIdRef.current,
            });

            const recoveredMessages = response.data;

            setMessages((prevMessages) => {
              const existingIds = new Set(
                prevMessages.map((message) => message.messageId),
              );

              const newMessages = recoveredMessages.filter(
                (message) => !existingIds.has(message.messageId),
              );

              return [...prevMessages, ...newMessages];
            });

            if (recoveredMessages.length > 0) {
              lastReceivedMessageIdRef.current =
                recoveredMessages[recoveredMessages.length - 1].messageId;
            }

            console.log("재연결 누락 메시지 복구:", recoveredMessages);
          } catch (error) {
            console.error("누락 메시지 복구 실패:", error);
          }
        }

        hasConnectedOnceRef.current = true;
      },

      onDisconnect: () => {
        console.log("STOMP 연결 해제");

        setConnectionStatus("disconnected");
      },

      onStompError: () => {
        setConnectionStatus("error");
      },

      onWebSocketError: () => {
        setConnectionStatus("error");
      },
    });

    clientRef.current = client;

    client.activate();

    return () => {
      clientRef.current = null;

      client.deactivate();
    };
  }, [chatRoomId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoadingMessages(true);

        const response = await chatApi.getChatMessages({
          chatRoomId,
          size: 30,
        });

        const fetchedMessages = response.data.messages;

        setMessages(fetchedMessages);
        setNextCursor(response.data.nextCursor);
        setHasNext(response.data.hasNext);

        if (fetchedMessages.length > 0) {
          lastReceivedMessageIdRef.current =
            fetchedMessages[fetchedMessages.length - 1].messageId;
        }
      } catch (error) {
        console.error("채팅 메시지 조회 실패:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [chatRoomId]);

  const handleSendMessage = () => {
    const content = messageInput.trim();

    if (!content) {
      return;
    }

    const client = clientRef.current;

    if (!client?.connected) {
      console.error("STOMP가 연결되어 있지 않습니다.");
      return;
    }

    client.publish({
      destination: "/app/chat/messages",
      body: JSON.stringify({
        chatRoomId: Number(chatRoomId),
        content,
      }),
    });

    setMessageInput("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSendMessage();
  };

  return (
    <section className="mt-4 space-y-2">
      {isLoadingMessages ? (
        <p className="text-sm text-gray-500">메시지를 불러오는 중...</p>
      ) : (
        messages.map((message) => (
          <div key={message.messageId} className="rounded-lg bg-white p-3">
            <p className="text-xs text-gray-500">{message.senderNickname}</p>

            <p className="mt-1 text-sm">{message.content}</p>
          </div>
        ))
      )}
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={messageInput}
          onChange={(event) => setMessageInput(event.target.value)}
          placeholder="메시지를 입력해주세요."
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
        />

        <button
          type="submit"
          disabled={connectionStatus !== "connected" || !messageInput.trim()}
          className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          전송
        </button>
      </form>
    </section>
  );
};

export default ChatPage;
