import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// send new message if chatId not given and also takes follow up if chatId given
export const sendMessage = async ({ message, chatId }) => {
  const response = await api.post("/api/chats/message", {
    message,
    chat: chatId,
  });
  return response.data;
};

// get all chats
export const getChats = async () => {
  const response = await api.get("/api/chats/");
  return response.data;
};

// get all messages on the basis of given chatId
export const getMessages = async ({ chatId }) => {
  const response = await api.get(`/api/chats/messages/${chatId}`);
  return response.data;
};

// delete chat on the basis of given chatId
export const deleteChat = async ({ chatId }) => {
  const response = await api.delete(`/api/chats/delete/${chatId}`);
  return response.data;
};
