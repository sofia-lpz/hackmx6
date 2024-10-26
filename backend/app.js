import express from 'express'
import bodyParser from 'body-parser';
import {router} from './abarrote.router.js'
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9090;

app.use(bodyParser.json());
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`pronostico escuchando en el puerto ${PORT}`);
});