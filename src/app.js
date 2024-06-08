import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());  // invoke as a function
app.use(urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());  // invoke as a function
app.use(express.static('public'));
app.set("view engine", "ejs")
// router importing
import userRoutes from "./routers/user.routes.js";
import ownerRoutes from "./routers/owner.routes.js";
import productRoutes from "./routers/product.routes.js";

// router defining
// app.use("/new", (req, res) => { res.send("Hey this is nothing working") });
app.use("/owner", ownerRoutes);
// app.use("/users", userRoutes);
// app.use("/product", productRoutes);

export { app };
