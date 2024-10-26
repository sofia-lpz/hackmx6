import express from 'express'
import bodyParser from 'body-parser';
import {router} from './abarrote.router.js'
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9090;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const corsOptions = {
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
};

app.use(cors(corsOptions));  // Apply CORS middleware
app.use(bodyParser.json());
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`pronostico escuchando en el puerto ${PORT}`);
});