import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    name: "Amina O.",
    text: "Farmcity rice is the best quality I've ever tasted! Fast delivery and great service.",
  },
  {
    name: "John D.",
    text: "The golden-green packaging is beautiful and the rice is always fresh.",
  },
  {
    name: "Priya S.",
    text: "I love the variety and the easy checkout process. Highly recommended!",
  },
];

const TestimonialSection = () => {
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % testimonials.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);
  return (
    <section style={{
      background: 'linear-gradient(120deg, #e3c770 0%, #4caf50 100%)',
      color: '#fff',
      borderRadius: '16px',
      boxShadow: '0 2px 12px rgba(76,175,80,0.15)',
      padding: '2rem',
      margin: '2rem auto',
      maxWidth: '600px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <h3 style={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Testimonials</h3>
      <div style={{ minHeight: '100px', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.7 }}
            style={{ position: 'absolute', width: '100%' }}
          >
            <p style={{ fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '1rem' }}>
              "{testimonials[index].text}"
            </p>
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>- {testimonials[index].name}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{ marginTop: '1.5rem' }}>
        {testimonials.map((_, i) => (
          <span key={i} style={{
            display: 'inline-block',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: i === index ? '#fff' : 'rgba(255,255,255,0.4)',
            margin: '0 6px',
            transition: 'background 0.3s'
          }} />
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;
