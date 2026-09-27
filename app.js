import exprs from 'express';
import cors from 'cors';

import authRoutes from "./src/routes/authRoute.js";
import userRoutes from "./src/routes/userRoute.js";
import roleRoutes from "./src/routes/roleRoute.js";
import departmentRoutes from "./src/routes/deptRoute.js";
import learnModRoutes from "./src/routes/learnModRoute.js";
import learnMatRoutes from "./src/routes/learnMatRoute.js";
import examRoutes from "./src/routes/examRoute.js";
import questionRoutes from "./src/routes/questionRoute.js";
import choiceRoutes from "./src/routes/choiceRoute.js";
import examAttemptRoutes from "./src/routes/examAttRoutes.js";
import examAttemptAnsRoutes from "./src/routes/examAttAnsRoute.js";
import userProgressRoutes from "./src/routes/userProgrsRoute.js";
import userMatProgressRoutes from "./src/routes/userMatProgrsRoute.js";
import certificateRoutes from "./src/routes/certsRoutes.js";
import notificationRoutes from "./src/routes/notifRoute.js";

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
app.use("/module", learnModRoutes);
app.use("/material", learnMatRoutes);
app.use("/exam", examRoutes);
app.use("/question", questionRoutes);
app.use("/choice", choiceRoutes);
app.use("/exam-attempt", examAttemptRoutes);
app.use("exam-att-ans", examAttemptAnsRoutes);
app.use("/user-progress", userProgressRoutes);
app.use("/user-mat-progress", userMatProgressRoutes);
app.use("/certificate", certificateRoutes);
app.use("/notification", notificationRoutes);

app.use(errorHandler);

// module.exports = app;
export default app;