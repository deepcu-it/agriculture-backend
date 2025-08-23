import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import cors from 'cors';
import connectToMongoDB from "./databases/MongoDBConnection.js";

connectToMongoDB();

const app = express();


// Security middlewares
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(cors());

// Application routes
import userRoutes from './routes/userRoutes.js';
app.use("/user", userRoutes);
import geminiRoutes from './routes/geminiRoutes.js';
app.use("/gemini", geminiRoutes);


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});