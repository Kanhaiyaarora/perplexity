import "dotenv/config";
import app from "./src/app.js";
import connectToDb from "./src/config/database.js";
import { testAi } from "./src/services/ai.service.js";

connectToDb().catch((err) => {
  console.error("Failed to connect to MongoDB", err);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
