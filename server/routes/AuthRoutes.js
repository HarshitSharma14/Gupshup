import { Router } from "express"
import { getUserInfo, login, signup } from "../controllers/AuthController.js";

const authRoutes = Router();

authRoutes.post("/signup", signup)
authRoutes.post("/login", login)
authRoutes.get("/user-info", getUserInfo)

export default authRoutes;