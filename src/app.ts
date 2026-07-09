// import express, { Application} from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import errorHandler from './middlewares/error.middleware';
// import authRoutes from './modules/auth/auth.routes';
// import categoryRoutes from './modules/categories/category.routes';
// import propertyRoutes from './modules/properties/property.routes'
// import rentalRoute from './modules/rentals/rental.routes'
// import paymentRoutes from './modules/payments/payment.routes';
// import router from './modules/reviews/review.routes';

// const app: Application = express();

// //middleware
// app.use(cors());
// app.use(express.json());
// app.use('/api/auth', authRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/properties', propertyRoutes);
// app.use('/api/rentals', rentalRoute);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/reviews', reviewRoutes);




// //test route
// app.get('/', (req, res) => {
//     res.send('RentNest Api is running');
// });


// //error handler middleware
// app.use(errorHandler);

// export default app;

import express, { Application } from 'express';
import cors from 'cors';
import errorHandler from './middlewares/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import categoryRoutes from './modules/categories/category.routes';
import propertyRoutes from './modules/properties/property.routes';
import rentalRoutes from './modules/rentals/rental.routes';
import paymentRoutes from './modules/payments/payment.routes';
import reviewRoutes from './modules/reviews/review.routes';
import adminRoutes from './modules/admin/admin.routes';



const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('RentNest API is running 🏠');
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use(errorHandler);

export default app;