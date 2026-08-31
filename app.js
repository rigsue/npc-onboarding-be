import exprs from 'express';
import cors from 'cors';

import authRoutes from "./src/routes/authRoute.js";
import userRoutes from "./src/routes/userRoute.js";
import roleRoutes from "./src/routes/roleRoute.js";

import errorHandler from "./src/middlewares/errorHandler.js";

const app = exprs();
const corsOPtions = {
    origin: [
        'http://localhost:3002',
        'http://localhost:4002',
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOPtions));
app.use(exprs.json());
app.use(exprs.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/role", roleRoutes);

app.use(errorHandler);

// module.exports = app;
export default app;