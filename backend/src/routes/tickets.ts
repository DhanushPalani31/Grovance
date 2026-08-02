import { Router } from "express";
import { store } from "../lib/store";

export const ticketsRouter = Router();

ticketsRouter.get("/", async (_req, res) => {
  try {
    res.json(await store.listTickets());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load tickets" });
  }
});

ticketsRouter.post("/", async (req, res) => {
  try {
    const { title } = req.body as { title?: string };
    if (!title) return res.status(400).json({ error: "title is required" });

    const ticket = await store.createTicket(title);
    await store.logActivity({
      label: `Support ticket opened: ${ticket.id} — ${title}`,
      source: "maintenance",
    });

    res.status(201).json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create ticket" });
  }
});

ticketsRouter.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body as { status?: "Open" | "In Progress" | "Resolved" };
    if (!status) return res.status(400).json({ error: "status is required" });

    const ticket = await store.updateTicketStatus(req.params.id, status);
    if (!ticket) return res.status(404).json({ error: "ticket not found" });

    await store.logActivity({
      label: `Ticket ${ticket.id} marked ${status}`,
      source: "maintenance",
    });

    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update ticket" });
  }
});
