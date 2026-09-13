import exprs from 'express';
import cors from 'cors';

import authRoutes from "./src/routes/authRoute.js";
import userRoutes from "./src/routes/userRoute.js";
import roleRoutes from "./src/routes/roleRoute.js";
import departmentRoutes from "./src/routes/departmentRoute.js";

import { errorHandler } from "./src/middlewares/errorHandler.js";

const app = exprs();
const corsOPtions = {
    origin: [
        'http://localhost:3002',
        'http://localhost:4002',
        'http://localhost:5173',
        'http://192.168.60.48:5173',
        'http://192.168.1.176:5173',
        'http://10.110.198.217:5173',
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
app.use("/department", departmentRoutes);

app.use(errorHandler);

// module.exports = app;
export default app;