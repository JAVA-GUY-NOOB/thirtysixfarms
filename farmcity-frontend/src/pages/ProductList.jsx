import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RiceCard from '../components/RiceCard';
import { riceAPI } from '../api/farmcityApi';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await riceAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to load products');
      // Fallback to mock data if API fails
      setProducts([
        {
          id: 1,
          name: "Premium Basmati Rice",
          price: 520,
          description: "Aromatic long-grain basmati rice (1kg)",
          image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
        },
        {
          id: 2,
          name: "Organic Brown Rice",
          price: 420,
          description: "Nutritious whole grain rice with natural fiber (1kg)",
          image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80"
        },
        {
          id: 3,
          name: "Jasmine Rice",
          price: 440,
          description: "Fragrant Thai jasmine rice (1kg)",
          image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=400&q=80"
        },
        {
          id: 4,
          name: "Wild Rice Blend",
          price: 650,
          description: "Premium mix of wild and brown rice varieties (1kg)",
          image: "https://images.unsplash.com/photo-1557909414-f3515f171cc1?auto=format&fit=crop&w=400&q=80"
        },
        {
          id: 5,
          name: "Sushi Rice",
          price: 560,
          description: "Short-grain rice perfect for sushi making (1kg)",
          image: "https://images.unsplash.com/photo-1575299398294-e67b3bbb65bb?auto=format&fit=crop&w=400&q=80"
        },
        {
          id: 6,
          name: "Arborio Rice",
          price: 540,
          description: "Italian rice ideal for creamy risottos (1kg)",
          image: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91b?auto=format&fit=crop&w=400&q=80"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    // Refresh any cart indicators or show notification
    console.log('Item added to cart');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        fontSize: '1.2rem',
        color: '#4caf50'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e3c770',
            borderTop: '4px solid #4caf50',
            borderRadius: '50%',
            marginRight: '1rem'
          }}
        />
        Loading products...
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          background: 'linear-gradient(120deg, #e3c770 0%, #4caf50 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          🌾 Premium Rice Collection
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#666',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Discover our carefully curated selection of premium rice varieties from around the world
        </p>
      </motion.div>

      {error && (
        <div style={{
          background: 'rgba(244, 67, 54, 0.1)',
          border: '1px solid rgba(244, 67, 54, 0.3)',
          borderRadius: '8px',
          padding: '1rem',
          margin: '1rem auto',
          maxWidth: '600px',
          textAlign: 'center',
          color: '#d32f2f'
        }}>
          {error} - Showing sample products
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem'
        }}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <RiceCard
              id={product.id}
              name={product.name}
              price={product.price}
              description={product.description}
              image={product.image || product.imageUrl}
              onAddToCart={handleAddToCart}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        style={{
          textAlign: 'center',
          marginTop: '3rem',
          padding: '2rem',
          background: 'linear-gradient(120deg, rgba(227, 199, 112, 0.1) 0%, rgba(76, 175, 80, 0.1) 100%)',
          borderRadius: '16px',
          maxWidth: '800px',
          margin: '3rem auto 0'
        }}
      >
        <h3 style={{
          fontSize: '1.5rem',
          color: '#4caf50',
          marginBottom: '1rem'
        }}>
          🚚 Free Delivery on Orders Over KSh 5,000
        </h3>
        <p style={{ color: '#666' }}>
          Premium quality rice delivered fresh to your doorstep. All our rice varieties are carefully sourced and quality tested.
        </p>
      </motion.div>
    </div>
  );
};

export default ProductList;