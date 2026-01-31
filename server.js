import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import processRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
      "http://localhost:5173",
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
  res.json({ message: 'Digibiz backend server is running' });
});

app.use('/api', processRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

