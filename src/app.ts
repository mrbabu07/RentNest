import express, { Application} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import errorHandler from './middlewares/error.middleware';
import authRoutes from './modules/auth/auth.routes';


const app: Application = express();

//middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
//test route
app.get('/', (req, res) => {
    res.send('RentNest Api is running');
});


//error handler middleware
app.use(errorHandler);

export default app;