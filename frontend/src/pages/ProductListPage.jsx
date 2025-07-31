import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await axios.get('http://localhost:3001/api/departments');
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch products whenever selectedDept changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (selectedDept) {
          params.departmentId = selectedDept;
        }
        const { data } = await axios.get('http://localhost:3001/api/products', { params });
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedDept]);

  return (
    <div>
      <div className="filter-container">
        <label htmlFor="department-select">Filter by Department: </label>
        <select 
          id="department-select"
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
      </div>

      <h2>Products</h2>
      {loading ? <p>Loading products...</p> : (
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <h3>
                <Link to={`/products/${product.id}`}>{product.name}</Link>
              </h3>
              <p>${product.price.toFixed(2)}</p>
              {/* Access department name through the nested object */}
              <p><em>{product.Department.name}</em></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListPage;