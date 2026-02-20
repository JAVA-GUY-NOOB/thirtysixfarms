import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RiceCard from '../components/RiceCard';
import ImageCarousel from '../components/ImageCarousel';
import TestimonialSection from '../components/TestimonialSection';
import NewsletterSignup from '../components/NewsletterSignup';
import FAQSection from '../components/FAQSection';
import { riceAPI } from '../api/farmcityApi';

const recipes = [
  {
    title: 'Gen Z Basmati Pilaf',
    steps: [
      'Rinse 1 cup basmati rice until water runs clear.',
      'Add rice to pot with 2 cups water, pinch of salt, and 1 tsp olive oil.',
      'Bring to boil, cover, simmer 12 min. Fluff and top with avocado + sriracha.'
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

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const products = await riceAPI.getAll();
      setFeaturedProducts(products.slice(0, 3));
    } catch (error) {
      setFeaturedProducts([
        {
          id: 1,
          name: 'Golden Basmati',
          price: 520,
          description: 'Premium aromatic basmati rice (1kg)',
          image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'
        },
        {
          id: 2,
          name: 'Green Jasmine',
          price: 440,
          description: 'Fragrant Thai jasmine rice (1kg)',
          image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
        },
        {
          id: 3,
          name: 'Classic Long Grain',
          price: 380,
          description: 'Traditional long grain rice (1kg)',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem 0', background: 'linear-gradient(120deg, #f7f7f7 0%, #e3c770 100%)' }}>
      <ImageCarousel />
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(120deg, #e3c770 0%, #4caf50 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          🌾 Welcome to Farmcity
        </h1>
        <p style={{
          fontSize: '1.3rem',
          color: '#666',
          maxWidth: '700px',
          margin: '0 auto 2rem',
          lineHeight: '1.6'
        }}>
          Discover premium rice varieties, fresh from the farm. Organic, sustainable, and delivered with love. <span style={{ color: '#4caf50', fontWeight: 'bold' }}>Gen Z vibes only!</span>
        </p>
        <motion.a
          href="/products"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'inline-block',
            background: 'linear-gradient(120deg, #4caf50 0%, #e3c770 100%)',
            color: '#fff',
            fontWeight: 'bold',
            padding: '1rem 2.5rem',
            borderRadius: '12px',
            fontSize: '1.2rem',
            boxShadow: '0 2px 12px rgba(76,175,80,0.15)',
            textDecoration: 'none',
            marginTop: '1rem',
            marginBottom: '2rem',
            transition: 'all 0.3s'
          }}
        >
          Shop Rice ➡️
        </motion.a>
      </motion.div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
        {loading ? <div>Loading...</div> : featuredProducts.map(product => (
          <RiceCard key={product.id} {...product} />
        ))}
      </div>
      <section style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(76,175,80,0.10)', padding: '2rem', margin: '2rem auto', maxWidth: '700px' }}>
        <h2 style={{ fontWeight: 'bold', fontSize: '2rem', marginBottom: '1rem', color: '#4caf50' }}>🍚 Easy Rice Recipes</h2>
        {recipes.map((recipe, idx) => (
          <div key={idx} style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#e3c770', marginBottom: '0.5rem' }}>{recipe.title}</h3>
            <ul style={{ textAlign: 'left', color: '#444', fontSize: '1rem', marginLeft: '1.5rem' }}>
              {recipe.steps.map((step, i) => (
                <li key={i} style={{ marginBottom: '0.5rem' }}>{step}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <TestimonialSection />
      <NewsletterSignup />
      <FAQSection />
      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginTop: '4rem',
          maxWidth: '900px',
          margin: '4rem auto 0'
        }}
      >
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'rgba(76, 175, 80, 0.1)',
          borderRadius: '16px',
          border: '2px solid rgba(76, 175, 80, 0.2)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚚</div>
          <h3 style={{ color: '#4caf50', marginBottom: '1rem' }}>Free Delivery</h3>
          <p style={{ color: '#666' }}>Free delivery on all orders over KSh 5,000. Fast and reliable to your doorstep.</p>
        </div>
        
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'rgba(227, 199, 112, 0.1)',
          borderRadius: '16px',
          border: '2px solid rgba(227, 199, 112, 0.2)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
          <h3 style={{ color: '#e3c770', marginBottom: '1rem' }}>Organic Quality</h3>
          <p style={{ color: '#666' }}>100% organic rice varieties grown without harmful pesticides or chemicals.</p>
        </div>
        
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'rgba(76, 175, 80, 0.1)',
          borderRadius: '16px',
          border: '2px solid rgba(76, 175, 80, 0.2)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍🌾</div>
          <h3 style={{ color: '#4caf50', marginBottom: '1rem' }}>Direct from Farmers</h3>
          <p style={{ color: '#666' }}>Supporting local farmers by sourcing directly, ensuring freshness and fair prices.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
