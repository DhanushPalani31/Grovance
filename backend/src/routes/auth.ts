import { Router } from "express";
import bcrypt from "bcryptjs";
import { store } from "../lib/store";
import { signToken, requireAuth, type AuthedRequest } from "../lib/auth";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body as { name?: string; email?: string; password?: string };

  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email, and password are required" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "password must be at least 8 characters" });
  }
  if (store.findUserByEmail(email)) {
    return res.status(409).json({ error: "an account with this email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = store.createUser({ name, email, passwordHash });

  store.logActivity({ label: `New account created: ${name}`, source: "system" });

  const token = signToken({ sub: user.id, email: user.email, name: user.name });
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const user = store.findUserByEmail(email);
  if (!user) return res.status(401).json({ error: "invalid email or password" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "invalid email or password" });

  const token = signToken({ sub: user.id, email: user.email, name: user.name });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

authRouter.get("/me", requireAuth, (req: AuthedRequest, res) => {
  const user = store.findUserById(req.user!.sub);
  if (!user) return res.status(404).json({ error: "user not found" });
  res.json({ id: user.id, name: user.name, email: user.email });
});
