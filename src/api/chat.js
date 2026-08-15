import { request } from "@/api/client";

export const createOrGetChatRoom = ({ receiverId }) => {
  return request("/chat/rooms", {
    method: "POST",
    body: JSON.stringify({ receiverId }),
  });
};

export const getChatMessages = ({ chatRoomId, cursor, size = 30 }) => {
  const params = new URLSearchParams();

  params.set("size", String(size));

  if (cursor !== undefined && cursor !== null) {
    params.set("cursor", String(cursor));
  }

  return request(`/chat/rooms/${chatRoomId}/messages?${params.toString()}`);
};

export const getChatMessagesAfter = ({ chatRoomId, lastMessageId }) => {
  const params = new URLSearchParams({
    lastMessageId: String(lastMessageId),
  });

  return request(
    `/chat/rooms/${chatRoomId}/messages/after?${params.toString()}`,
  );
};
