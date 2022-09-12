import path from 'path'
import express from "express";
import dotenv from "dotenv";
// add color on console log to debug
import colors from "colors";
import connectDB from "./config/connection.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { errorHandler, notFound } from "./util/errorMiddleware.js";
const app = express();

dotenv.config();
const PORT = process.env.PORT || 3001;

connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
// paypal config routes
app.get('/api/config/paypal',(req,res)=>{res.send(process.env.PAYPAL_CLIENT_ID)})


const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/client/build")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running....");
    });
}

app.use(notFound);
app.use(errorHandler);

app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on Port ${PORT}`.yellow
            .bold
    )
);
