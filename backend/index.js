const express = require('express');
const cors = require('cors');
const { sequelize, Product, Department } = require('./database');
const { Op } = require('sequelize');

const app = express();
const PORT = 3001;

app.use(cors());

// API Endpoint: Get all departments
app.get('/api/departments', async (req, res) => {
  try {
    const departments = await Department.findAll({ order: [['name', 'ASC']] });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching departments' });
  }
});

// API Endpoint: Get all products (with department filtering)
app.get('/api/products', async (req, res) => {
  try {
    const { departmentId } = req.query;
    const whereClause = {};

    if (departmentId) {
      whereClause.DepartmentId = departmentId;
    }

    const products = await Product.findAll({
      where: whereClause,
      include: { // Include department info
        model: Department,
        attributes: ['name'] // Only send the department's name
      }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// API Endpoint: Get a single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: {
        model: Department,
        attributes: ['name']
      }
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
});