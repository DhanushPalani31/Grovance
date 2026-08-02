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

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/ai", aiRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/audit", auditRouter);

app.listen(PORT, () => {
  console.log(`Grovance API listening on http://localhost:${PORT}`);
});
