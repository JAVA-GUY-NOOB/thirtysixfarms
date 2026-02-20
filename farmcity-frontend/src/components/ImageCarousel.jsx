import React from 'react';

const images = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
];

const ImageCarousel = () => {
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % images.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);
  return (
    <div style={{
      background: 'linear-gradient(120deg, #e3c770 0%, #4caf50 100%)',
      borderRadius: '16px',
      boxShadow: '0 2px 12px rgba(76,175,80,0.15)',
      padding: '1.5rem',
      margin: '2rem auto',
      maxWidth: '420px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <img src={images[index]} alt="carousel" style={{
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(76,175,80,0.12)',
        transition: 'opacity 0.7s'
      }} />
      <div style={{ marginTop: '1rem', color: '#fff', fontWeight: 'bold' }}>Featured Farm Images</div>
    </div>
  );
};

export default ImageCarousel;
