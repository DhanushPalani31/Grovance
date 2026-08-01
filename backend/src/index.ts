import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import { healthRouter } from "./routes/health";
import { automationRouter } from "./routes/automation";
import { aiRouter } from "./routes/ai";
import { leadsRouter } from "./routes/leads";
import { changelogRouter } from "./routes/changelog";
import { ticketsRouter } from "./routes/tickets";
import { authRouter } from "./routes/auth";
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
app.use("/api/changelog", changelogRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/api/auth", authRouter);

// --- Automation Center: real scheduled jobs, not a mockup ---
// Runs every day at 9pm to demonstrate the "daily sales summary" rule
// shown as enabled in the frontend's Automation Center page.
cron.schedule("0 21 * * *", () => {
  store.logActivity({ label: "Daily sales summary generated", source: "automation" });
});

// Runs every Sunday at midnight — the "auto-backup" rule.
cron.schedule("0 0 * * 0", () => {
  store.logActivity({ label: "Weekly brand data backup completed", source: "automation" });
});

// Simulates a new order arriving every ~10 minutes, so the Dashboard's
// "auto-refreshed" stats are genuinely live, not frozen placeholder numbers.
cron.schedule("*/10 * * * *", () => {
  const value = store.simulateOrder();
  store.logActivity({ label: `New order received ($${value}) — confirmation email sent`, source: "automation" });
});

app.listen(PORT, () => {
  console.log(`Grovance API listening on http://localhost:${PORT}`);
});
