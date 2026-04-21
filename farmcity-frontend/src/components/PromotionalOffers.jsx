import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, Chip, Grid, Button } from '@mui/material';
import { LocalOffer, AccessTime, ContentCopy } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { adsOffersAPI } from '../api/farmcityApi';

const PromotionalOffers = () => {
  const [offers, setOffers] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const data = await adsOffersAPI.getHomepageOffers();
      setOffers(data || []);
    } catch (err) {
      console.error('Failed to fetch offers:', err);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDiscount = (offer) => {
    if (offer.offerType === 'PERCENTAGE' && offer.discountPercentage) {
      return `${offer.discountPercentage}% OFF`;
    } else if (offer.offerType === 'FIXED_AMOUNT' && offer.discountAmount) {
      return `KES ${offer.discountAmount} OFF`;
    } else if (offer.offerType === 'FREE_SHIPPING') {
      return 'FREE SHIPPING';
    } else if (offer.offerType === 'BUY_ONE_GET_ONE') {
      return 'BUY 1 GET 1';
    }
    return 'SPECIAL OFFER';
  };

  if (offers.length === 0) return null;

  return (
    <Box sx={{ py: 6, background: '#f5f5f5' }}>
      <Container>
        <Typography
          variant="h4"
          textAlign="center"
          sx={{ fontWeight: 'bold', mb: 1, color: '#4caf50' }}
        >
          Special Offers
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          sx={{ color: 'text.secondary', mb: 4 }}
        >
          Use these promo codes at checkout to save
        </Typography>

        <Grid container spacing={3}>
          {offers.map((offer, index) => (
            <Grid item xs={12} sm={6} md={4} key={offer.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: 3,
                    overflow: 'hidden',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Discount Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      background: 'linear-gradient(45deg, #ff6f00, #ff8f00)',
                      color: '#fff',
                      px: 2,
                      py: 0.5,
                      borderBottomLeftRadius: 16,
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                    }}
                  >
                    {formatDiscount(offer)}
                  </Box>

                  <CardContent sx={{ pt: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocalOffer sx={{ color: '#4caf50', mr: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {offer.title}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {offer.description}
                    </Typography>

                    {/* Promo Code */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        background: '#f5f5f5',
                        borderRadius: 2,
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          PROMO CODE
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            fontFamily: 'monospace',
                            color: '#4caf50',
                            letterSpacing: 1,
                          }}
                        >
                          {offer.promoCode}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ContentCopy />}
                        onClick={() => copyToClipboard(offer.promoCode)}
                        sx={{ minWidth: 80 }}
                      >
                        {copiedCode === offer.promoCode ? 'Copied!' : 'Copy'}
                      </Button>
                    </Box>

                    {/* Terms */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {offer.minimumOrderAmount > 0 && (
                        <Chip
                          label={`Min: KES ${offer.minimumOrderAmount}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {offer.usageLimit && (
                        <Chip
                          icon={<AccessTime fontSize="small" />}
                          label={`${offer.usageLimit - (offer.usageCount || 0)} left`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default PromotionalOffers;
