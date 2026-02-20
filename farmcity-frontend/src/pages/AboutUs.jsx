import React from 'react';
import { motion } from 'framer-motion';

const team = [
  {
    name: 'Ava',
    role: 'Founder & CEO',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Rice lover, Gen Z dreamer, and community builder.'
  },
  {
    name: 'Jayden',
    role: 'Head of Tech',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Code, coffee, and sustainable farming advocate.'
  },
  {
    name: 'Mia',
    role: 'Marketing Lead',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    bio: 'Spreading rice vibes and eco love.'
  }
];

const AboutUs = () => {
  return (
    <div style={{ padding: '2rem 0', maxWidth: '900px', margin: '0 auto', background: 'linear-gradient(120deg, #f7f7f7 0%, #e3c770 100%)', borderRadius: '18px' }}>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ fontSize: '2.8rem', fontWeight: 'bold', color: '#4caf50', marginBottom: '1.5rem', textAlign: 'center', letterSpacing: '1px' }}
      >
        🌾 About Farmcity
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ fontSize: '1.3rem', color: '#555', lineHeight: '1.7', marginBottom: '2rem', textAlign: 'center' }}
      >
        Farmcity is a Gen Z-powered movement to connect you with the freshest, highest quality rice—straight from local farmers. We’re all about sustainability, community, and making healthy food fun and accessible.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        style={{ background: '#e3c770', borderRadius: '14px', padding: '2rem', color: '#fff', marginBottom: '2rem', boxShadow: '0 2px 12px rgba(76,175,80,0.10)' }}
      >
        <h3 style={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Our Mission</h3>
        <p style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>
          To empower farmers, delight customers, and make rice the hero of every meal.
        </p>
        <h3 style={{ fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Our Values</h3>
        <ul style={{ fontSize: '1.1rem', lineHeight: '1.6', marginLeft: '1.5rem' }}>
          <li>🌱 Sustainability</li>
          <li>💎 Quality</li>
          <li>🤝 Community</li>
          <li>🔍 Transparency</li>
        </ul>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ background: '#fff', borderRadius: '14px', padding: '2rem', boxShadow: '0 2px 12px rgba(76,175,80,0.10)', marginBottom: '2rem' }}
      >
        <h3 style={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '1rem', color: '#4caf50', textAlign: 'center' }}>Meet the Team</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {team.map((member, idx) => (
            <div key={idx} style={{ textAlign: 'center', maxWidth: '180px' }}>
              <img src={member.avatar} alt={member.name} style={{ width: '90px', height: '90px', borderRadius: '50%', marginBottom: '0.7rem', boxShadow: '0 2px 8px rgba(76,175,80,0.10)' }} />
              <div style={{ fontWeight: 'bold', color: '#e3c770', fontSize: '1.1rem' }}>{member.name}</div>
              <div style={{ color: '#4caf50', fontSize: '1rem', marginBottom: '0.5rem' }}>{member.role}</div>
              <div style={{ color: '#555', fontSize: '0.95rem' }}>{member.bio}</div>
            </div>
          ))}
        </div>
      </motion.div>
      <div style={{ textAlign: 'center', marginTop: '2rem', color: '#666', fontSize: '1.1rem' }}>
        <span style={{ background: '#4caf50', color: '#fff', borderRadius: '8px', padding: '0.5rem 1rem', fontWeight: 'bold' }}>
          Gen Z Powered 🚀
        </span>
      </div>
    </div>
  );
};

export default AboutUs;
// Removed stray export
