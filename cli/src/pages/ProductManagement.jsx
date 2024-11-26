import React, { useState, useEffect } from 'react';
import { ProductForm } from '../components/ProductForm';
import { ProductList } from '../components/ProductList';

const API_BASE_URL = 'http://localhost:3001/api';

export const ProductManagement = () => {
  const [mysqlProducts, setMysqlProducts] = useState([]);
  const [elasticProducts, setElasticProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('mysql');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const mysqlUrl = `${API_BASE_URL}/mysql/products`;
      const elasticUrl = `${API_BASE_URL}/elastic/products`;
      
      console.log('Fetching from MySQL:', mysqlUrl);
      console.log('Fetching from Elastic:', elasticUrl);

      const [mysqlResponse, elasticResponse] = await Promise.all([
        fetch(mysqlUrl),
        fetch(elasticUrl)
      ]);

      console.log('MySQL Response:', mysqlResponse.status);
      console.log('Elastic Response:', elasticResponse.status);

      if (!mysqlResponse.ok) {
        const mysqlError = await mysqlResponse.text();
        throw new Error(`MySQL Error: ${mysqlError}`);
      }

      if (!elasticResponse.ok) {
        const elasticError = await elasticResponse.text();
        throw new Error(`Elastic Error: ${elasticError}`);
      }

      const mysqlData = await mysqlResponse.json();
      const elasticData = await elasticResponse.json();

      console.log('MySQL Data:', mysqlData);
      console.log('Elastic Data:', elasticData);

      setMysqlProducts(mysqlData);
      setElasticProducts(elasticData);
    } catch (error) {
      const errorMessage = `Error loading products: ${error.message}`;
      console.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (productData) => {
    setError(null);
    try {
      const endpoint = `${API_BASE_URL}/${activeTab}/products${
        editingProduct ? `/${editingProduct.id}` : ''
      }`;
      
      const response = await fetch(endpoint, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error('Error saving product');
      }

      await fetchProducts();
      setEditingProduct(null);
    } catch (error) {
      setError('Error saving product. Please try again.');
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/${activeTab}/products/${id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Error deleting product');
      }

      await fetchProducts();
    } catch (error) {
      setError('Error deleting product. Please try again.');
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-8 flex justify-center space-x-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'mysql' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab('mysql')}
        >
          MySQL Products
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'elastic' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab('elastic')}
        >
          Elasticsearch Products
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <ProductForm
            onSubmit={handleSubmit}
            initialData={editingProduct}
          />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {activeTab === 'mysql' ? 'MySQL Products' : 'Elasticsearch Products'}
          </h2>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ProductList
              products={activeTab === 'mysql' ? mysqlProducts : elasticProducts}
              onDelete={handleDelete}
              onEdit={setEditingProduct}
            />
          )}
        </div>
      </div>
    </div>
  );
};