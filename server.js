// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// TODO: Implement custom middleware for:
// - Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
// - Authentication
app.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== 'Bearer mysecrettoken') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
});
// - Error handling
// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});
// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});
// POST /api/products - Create a new product
app.post('/api/products', (req, res) =>{
  const {name, description, price, category, inStock } = req.body

  if (!name || !description|| typeof price !== 'number'){
    return res.status(400).json({message: 'Invalid product data'});

  }

  const newProduct = {id: uuidv4(), 
    name, description, price, category, inStock
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
  console.log('Received:', req.body);


});
// PUT /api/products/:id - Update a product

app.patch('/api/products/:id', (req, res) =>{
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found'});
  }

  // Corrected typo in 'description' and ensured correct update logic
  const allowedFields = ['name', 'description', 'price', 'category', 'inStock'];
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field]; // <--- FIX: Update the specific 'product' object, not the 'products' array
    }
  });

  res.json(product); // This 'product' object now contains the updated values.
});
// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const deleted = products.splice(index, 1);
  res.json({ message: 'Product deleted', product: deleted[0] });
});

// Example route implementation for GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
});




// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 