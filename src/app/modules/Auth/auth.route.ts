import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post("/login", validateRequest(AuthValidation.loginValidationSchema));

router.post("/signup", validateRequest(AuthValidation.userValidationSchema));


export const AuthRoutes = router