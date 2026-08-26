import exprs from 'express';
import cors from 'cors';

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

// module.exports = app;
export default app;