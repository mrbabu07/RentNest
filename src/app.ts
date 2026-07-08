import express, { Application} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import errorHandler from './middlewares/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import categoryRoutes from './modules/categories/category.routes';
import propertyRoutes from './modules/properties/property.routes'
import rentalRoute from './modules/rentals/rental.routes'
import paymentRoutes from './modules/payments/payment.routes';


const app: Application = express();

//middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/rentals', rentalRoute);
app.use('/api/payments', paymentRoutes);


//test route
app.get('/', (req, res) => {
    res.send('RentNest Api is running');
});


//error handler middleware
app.use(errorHandler);

export default app;