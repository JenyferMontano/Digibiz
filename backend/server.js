import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
  res.json({ message: 'Digibiz backend server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

