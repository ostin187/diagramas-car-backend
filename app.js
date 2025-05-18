import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';

import { AppError } from './utils/AppError.js';
import { globalErrorHandler } from './controllers/error.controllers.js';

import { usersRouter } from './modules/user/users.routes.js';
import { yearCarRouter } from './routes/yearCar.routes.js';
import { carBrandRouter } from './routes/carBrand.routes.js';
import { carModelRouter } from './routes/carModel.routes.js';
import { bannersRouter } from './modules/banners/banners.routes.js';
import { videoRouter } from './modules/videos/video.routes.js';

const app = express();

app.set('trust proxy', 1);
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in one hour.',
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(cors());
app.use(xss());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(hpp());
app.use('/api/v1', limiter);
app.use('/api/v1/user', usersRouter);
app.use('/api/v1/year-car', yearCarRouter);
app.use('/api/v1/car-brand', carBrandRouter);
app.use('/api/v1/car-model', carModelRouter);
app.use('/api/v1/banners', bannersRouter);
app.use('/api/v1/video', videoRouter);

app.all('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server! 💀`, 404)
  );
});

app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    next(err);
  }
});

app.use(globalErrorHandler);

export { app };
