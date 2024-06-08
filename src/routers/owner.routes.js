import { Router } from "express";
import { changeOwnerPassword, createOwner, loginOwner, logoutOwner } from "../controllers/owner.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/registerOwner").post(
    upload.single(
        'avatar'
    ),
    createOwner
);
router.route("/login").post(loginOwner);
router.route("/logout").post(verifyJwt, logoutOwner);
router.route("/change-password").post(verifyJwt, changeOwnerPassword)

export default router;
