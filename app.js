import express from 'express';
import mongoose from "mongoose";
import env from 'dotenv';
import userRouter from "./routes/user-routes.js";
import blogRouter from "./routes/blog-routes.js";


const app = express();
env.config();

app.use(express.json());
app.use("/api/user", userRouter) //http://localhost:5000/api/user/
app.use("/api/blog", blogRouter)

mongoose.connect(process.env.MONGODB)
    .then(()=>
        app.listen(process.env.PORT))
    .then(()=>
    console.log(`Connected ot Database and Listening to Localhost ${process.env.PORT}`))
    .catch((err)=>console.log(err));
