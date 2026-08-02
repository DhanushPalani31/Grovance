import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { healthRouter } from "./routes/health";
import { aiRouter } from "./routes/ai";
import { leadsRouter } from "./routes/leads";
import { auditRouter } from "./routes/audit";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// In production, set FRONTEND_URL to your deployed frontend's real origin
// (e.g. https://grovance.vercel.app) to restrict CORS to just that domain.
// Left permissive by default so local dev keeps working without any setup.
const allowedOrigin = process.env.FRONTEND_URL;
app.use(cors(allowedOrigin ? { origin: allowedOrigin } : {}));
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/ai", aiRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/audit", auditRouter);

app.listen(PORT, () => {
  console.log(`Grovance API listening on http://localhost:${PORT}`);
});
