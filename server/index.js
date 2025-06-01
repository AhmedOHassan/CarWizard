import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import geminiRoute from "./routes/gemini.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/gemini", geminiRoute);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
