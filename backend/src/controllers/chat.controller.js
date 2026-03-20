import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import { generateChatTitle, generateResponse } from "../services/ai.service.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, chat: chatId } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Message is required.",
      });
    }

    let title = null,
      chat = null;

    if (!chatId) {
      title = await generateChatTitle(message);
      chat = await chatModel.create({
        user: req.user.id,
        title,
      });
    } else {
      const existingChat = await chatModel.findById(chatId);
      if (!existingChat) {
        return res.status(404).json({
          message: "Chat not found",
        });
      }
    }

    const userMessage = await messageModel.create({
      chat: chatId || chat._id,
      content: message,
      role: "user",
    });

    const messages = await messageModel.find({
      chat: chatId || chat._id,
    });

    const result = await generateResponse(messages);

    const aiMessage = await messageModel.create({
      chat: chatId || chat._id,
      content: result,
      role: "ai",
    });

    res.status(201).json({
      title,
      chat,
      aiMessage,
    });
  } catch (error) {
    res.status(500).json({
      message: "error.message",
    });
  }
};

export const getChats = async (req, res) => {
  const chats = await chatModel.find({
    user: req.user.id,
  });

  if (!chats) {
    return res.status(404).json({
      message: "chats not found.",
    });
  }
  return res.status(200).json({
    message: "Chats fetched successfully.",
    chats,
  });
};

export const getMessages = async (req, res) => {
  const { chatId } = req.params;

  if (!chatId) {
    return res.status(404).json({
      message: "ChatId not found.",
    });
  }

  const chat = await chatModel.findOne({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(404).json({
      message: "chat not found.",
    });
  }

  const messages = await messageModel.find({ chat: chatId });

  if (!messages) {
    return res.status(404).json({
      message: "messages not found",
    });
  }

  return res.status(200).json({
    message: "message fetched successfully.",
    messages,
  });
};

export const deleteChat = async (req, res) => {
  const { chatId } = req.params;
  if (!chatId) {
    return res.status(404).json({
      message: "ChatId not found",
    });
  }

  const chat = await chatModel.findOneAndDelete({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(204).json({
      message: "Chat not found for delete",
    });
  }

  await messageModel.deleteMany({
    chat: chatId,
  });

  return res.status(200).json({
    success: true,
    message: "Chat deleted successfully.",
  });
};
