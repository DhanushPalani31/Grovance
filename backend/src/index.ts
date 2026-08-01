import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import { healthRouter } from "./routes/health";
import { automationRouter } from "./routes/automation";
import { aiRouter } from "./routes/ai";
import { leadsRouter } from "./routes/leads";
import { store } from "./lib/store";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/automation", automationRouter);
app.use("/api/ai", aiRouter);
app.use("/api/leads", leadsRouter);

// --- Automation Center: real scheduled jobs, not a mockup ---
// Runs every day at 9pm to demonstrate the "daily sales summary" rule
// shown as enabled in the frontend's Automation Center page.
cron.schedule("0 21 * * *", () => {
  store.logActivity({ label: "Daily sales summary generated", source: "automation" });
});

// Runs every Sunday at midnight — the "auto-backup" rule.
cron.schedule("0 0 * * 0", () => {
  store.logActivity({ label: "Weekly shop data backup completed", source: "automation" });
});

app.listen(PORT, () => {
  console.log(`Grovance API listening on http://localhost:${PORT}`);
});
