import { Router } from "express";
import { createCertificate, } from "../controllers/certificate.controller";
import protectRoute from "../middleware/auth";
import { RoleEnum } from "../common";

const router = Router();

router.post("/create", protectRoute(RoleEnum), createCertificate);



export default router;