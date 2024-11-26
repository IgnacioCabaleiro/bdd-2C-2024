import React, { useState, useEffect } from 'react';

export const ProductForm = ({ onSubmit, initialData = null }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setProduct(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(product);
      if (!initialData) {
        setProduct({ name: '', description: '', price: '' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
      <div className="space-y-2">
        <label 
          htmlFor="name" 
          className="block text-sm font-medium text-gray-700"
        >
          Product Name
        </label>
        <input
          id="name"
          type="text"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          className="block w-full rounded-md border-gray-300 shadow-sm 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   bg-gray-50 p-2.5 text-sm text-gray-900"
          placeholder="Enter product name"
          required
        />
      </div>

      <div className="space-y-2">
        <label 
          htmlFor="description" 
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          className="block w-full rounded-md border-gray-300 shadow-sm 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   bg-gray-50 p-2.5 text-sm text-gray-900"
          rows="4"
          placeholder="Enter product description"
          required
        />
      </div>

      <div className="space-y-2">
        <label 
          htmlFor="price" 
          className="block text-sm font-medium text-gray-700"
        >
          Price
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            $
          </span>
          <input
            id="price"
            type="number"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) || '' })}
            className="block w-full rounded-md border-gray-300 shadow-sm 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-gray-50 p-2.5 pl-6 text-sm text-gray-900"
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex justify-center py-2.5 px-4 border border-transparent 
                   rounded-md shadow-sm text-sm font-medium text-white 
                   ${isSubmitting 
                     ? 'bg-blue-400 cursor-not-allowed' 
                     : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                   }`}
      >
        {isSubmitting ? (
          <span className="inline-flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          <span>{initialData ? 'Update Product' : 'Add Product'}</span>
        )}
      </button>
    </form>
  );
};