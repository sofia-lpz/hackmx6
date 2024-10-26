import express from 'express'
import bodyParser from 'body-parser';
import {router} from './abarrote.router.js'
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9090;

app.use(bodyParser.json());
app.use("/api", router);

app.use((req, res, next) => {
  console.log(`Request URL: ${req.originalUrl} - Method: ${req.method}`);
  next();
});

app.use((req, res) => {
  res.status(404).send("404 - Not Found");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("An error occurred:", err);
  res.status(500).send({ error: "An unexpected error occurred" });
});

app.use((req, res, next) => {
  console.log(`Handling request for ${req.url} with method ${req.method}`);
  next();
});

app.use((req, res, next) => {
  res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
  });
  next();
});

app.listen(PORT, () => {
  console.log(`pronostico escuchando en el puerto ${PORT}`);
});

