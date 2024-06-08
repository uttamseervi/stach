import { Router } from "express";

const router = Router();
router.route("/")
    .get((req, res) => {
        res.send("HELLO FROM THE product");
    });

export default router;
