import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, IconButton } from '@mui/material';
import { Close, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { adsOffersAPI } from '../api/farmcityApi';

const AdsBanner = ({ position = 'HOME_BANNER' }) => {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchAds();
  }, [position]);

  const fetchAds = async () => {
    try {
      const data = await adsOffersAPI.getActiveAds(position);
      setAds(data || []);
      // Record impression for first ad
      if (data && data.length > 0) {
        recordImpression(data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch ads:', err);
    }
  };

  const recordImpression = async (adId) => {
    try {
      await adsOffersAPI.recordAdImpression(adId);
    } catch (err) {
      console.error('Failed to record impression:', err);
    }
  };

  const recordClick = async (adId) => {
    try {
      await adsOffersAPI.recordAdClick(adId);
    } catch (err) {
      console.error('Failed to record click:', err);
    }
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % ads.length;
    setCurrentIndex(nextIndex);
    recordImpression(ads[nextIndex].id);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + ads.length) % ads.length;
    setCurrentIndex(prevIndex);
    recordImpression(ads[prevIndex].id);
  };

  const handleClick = (ad) => {
    recordClick(ad.id);
    if (ad.targetUrl) {
      window.open(ad.targetUrl, '_blank');
    }
  };

  if (dismissed || ads.length === 0) return null;

  const currentAd = ads[currentIndex];

  return (
    <Box
      sx={{
        position: 'relative',
        background: currentAd.backgroundColor || '#4caf50',
        color: currentAd.textColor || '#fff',
        py: 2,
        overflow: 'hidden',
      }}
    >
      <Container>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          {ads.length > 1 && (
            <IconButton
              onClick={handlePrev}
              sx={{ color: currentAd.textColor || '#fff' }}
            >
              <ChevronLeft />
            </IconButton>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentAd.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ cursor: currentAd.targetUrl ? 'pointer' : 'default', textAlign: 'center' }}
              onClick={() => handleClick(currentAd)}
            >
              {currentAd.imageUrl && (
                <Box
                  component="img"
                  src={currentAd.imageUrl}
                  alt={currentAd.title}
                  sx={{
                    maxHeight: 100,
                    maxWidth: '100%',
                    objectFit: 'contain',
                    mb: 1,
                  }}
                />
              )}
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {currentAd.title}
              </Typography>
              {currentAd.description && (
                <Typography variant="body2">
                  {currentAd.description}
                </Typography>
              )}
            </motion.div>
          </AnimatePresence>

          {ads.length > 1 && (
            <IconButton
              onClick={handleNext}
              sx={{ color: currentAd.textColor || '#fff' }}
            >
              <ChevronRight />
            </IconButton>
          )}

          <IconButton
            onClick={() => setDismissed(true)}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              color: currentAd.textColor || '#fff',
            }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* Pagination dots */}
        {ads.length > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
            {ads.map((_, idx) => (
              <Box
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  recordImpression(ads[idx].id);
                }}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: idx === currentIndex ? 'currentColor' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AdsBanner;
