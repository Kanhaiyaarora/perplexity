import "dotenv/config";
import app from "./src/app.js";
import connectToDb from "./src/config/database.js";
import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";

connectToDb().catch((err) => {
  console.error("Failed to connect to MongoDB", err);
});

const httpServer = http.createServer(app);

initSocket(httpServer);
httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
