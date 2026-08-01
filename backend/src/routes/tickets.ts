import { Router } from "express";
import { store } from "../lib/store";

export const ticketsRouter = Router();

ticketsRouter.get("/", (_req, res) => {
  res.json(store.listTickets());
});

ticketsRouter.post("/", (req, res) => {
  const { title } = req.body as { title?: string };
  if (!title) return res.status(400).json({ error: "title is required" });

  const ticket = store.createTicket(title);
  store.logActivity({
    label: `Support ticket opened: ${ticket.id} — ${title}`,
    source: "maintenance",
  });

  res.status(201).json(ticket);
});

ticketsRouter.patch("/:id/status", (req, res) => {
  const { status } = req.body as { status?: "Open" | "In Progress" | "Resolved" };
  if (!status) return res.status(400).json({ error: "status is required" });

  const ticket = store.updateTicketStatus(req.params.id, status);
  if (!ticket) return res.status(404).json({ error: "ticket not found" });

  store.logActivity({
    label: `Ticket ${ticket.id} marked ${status}`,
    source: "maintenance",
  });

  res.json(ticket);
});
