import { Router } from "express"
import { login, signup } from "../controllers/AuthController.js";

const authRoutes = Router();

authRoutes.post("/signup", signup)
authRoutes.post("/signup", login)

export default authRoutes;