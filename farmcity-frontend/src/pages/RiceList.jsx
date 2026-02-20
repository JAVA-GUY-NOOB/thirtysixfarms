// Removed duplicate RiceList and React import

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import RiceCard from '../components/RiceCard';
import { riceAPI } from '../api/farmcityApi';

const recipes = [
  {
    title: 'Gen Z Basmati Pilaf',
    steps: [
      'Rinse 1 cup basmati rice until water runs clear.',
      'Add rice to pot with 2 cups water, pinch of salt, and 1 tsp olive oil.',
// Removed duplicate declaration of RiceList
    ]
  },
  {
    title: 'Brown Rice Power Bowl',
    steps: [
      'Cook 1 cup brown rice as per pack instructions.',
      'Layer with roasted veggies, chickpeas, and drizzle tahini.',
      'Finish with lemon zest and microgreens.'
    ]
  }
];

const RiceList = () => {
  const [riceProducts, setRiceProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiceProducts();
  }, []);

  const fetchRiceProducts = async () => {
    try {
      const products = await riceAPI.getAll();
      setRiceProducts(products);
    } catch (error) {
      setRiceProducts([
        { id: 1, name: 'Golden Basmati', price: 520, description: 'Premium aromatic basmati rice (1kg)', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
        { id: 2, name: 'Green Jasmine', price: 440, description: 'Fragrant Thai jasmine rice (1kg)', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
        { id: 3, name: 'Classic Long Grain', price: 380, description: 'Traditional long grain rice (1kg)', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem 0', background: 'linear-gradient(120deg, #f7f7f7 0%, #e3c770 100%)' }}>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ textAlign: 'center', fontSize: '2.7rem', fontWeight: 'bold', marginBottom: '2rem', color: '#4caf50', letterSpacing: '1px' }}
      >
        🛒 Explore Our Rice Selection
      </motion.h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', justifyContent: 'center', marginBottom: '2rem' }}>
        {loading ? <div>Loading...</div> : riceProducts.map(product => (
          <RiceCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            description={product.description}
            image={product.image || product.imageUrl}
          />
        ))}
      </div>
      <section style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(76,175,80,0.10)', padding: '2rem', margin: '2rem auto', maxWidth: '700px' }}>
        <h2 style={{ fontWeight: 'bold', fontSize: '2rem', marginBottom: '1rem', color: '#e3c770' }}>🍚 Easy Rice Recipes</h2>
        {recipes.map((recipe, idx) => (
          <div key={idx} style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#4caf50', marginBottom: '0.5rem' }}>{recipe.title}</h3>
            <ul style={{ textAlign: 'left', color: '#444', fontSize: '1rem', marginLeft: '1.5rem' }}>
              {recipe.steps.map((step, i) => (
                <li key={i} style={{ marginBottom: '0.5rem' }}>{step}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <div style={{ textAlign: 'center', marginTop: '2rem', color: '#666', fontSize: '1.1rem' }}>
        <span style={{ background: '#e3c770', color: '#fff', borderRadius: '8px', padding: '0.5rem 1rem', fontWeight: 'bold' }}>
          Gen Z Approved 🌱
        </span>
      </div>
    </div>
  );
};

export default RiceList;
