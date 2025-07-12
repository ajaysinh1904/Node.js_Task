
import express from 'express';
import usersRouter from './routes/users.route.js';
import connectDB from './config/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(usersRouter);

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});