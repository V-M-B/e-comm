import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:3001/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading details...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div>
      <Link to="/">&larr; Back to Products</Link>
      <h2>{product.name}</h2>
      <div className="product-detail">
        <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
        <p><strong>Department:</strong> {product.Department.name}</p>
      </div>
    </div>
  );
};

export default ProductDetailPage;