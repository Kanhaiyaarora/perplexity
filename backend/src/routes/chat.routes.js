import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { deleteChat, getChats, getMessages, sendMessage } from "../controllers/chat.controller.js";

const chatRouter = Router();

// prefix -> /api/chats
chatRouter.post("/message", authUser, sendMessage);

chatRouter.get("/messages/:chatId",authUser,getMessages)

chatRouter.get("/",authUser,getChats)

chatRouter.delete("/delete/:chatId",authUser,deleteChat)






export default chatRouter;
