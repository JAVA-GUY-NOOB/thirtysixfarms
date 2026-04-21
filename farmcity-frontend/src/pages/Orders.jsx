import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  IconButton,
} from '@mui/material';
import {
  LocalShipping,
  CheckCircle,
  Pending,
  Cancel,
  Visibility,
  Receipt,
  LocationOn,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../api/farmcityApi';

const Orders = () => {
  useAuth(); // Verify authentication
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderAPI.getMyOrders();
      setOrders(data || []);
    } catch (err) {
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status) => {
    const config = {
      PENDING: { color: 'warning', icon: <Pending /> },
      PAID: { color: 'info', icon: <CheckCircle /> },
      PROCESSING: { color: 'primary', icon: <Pending /> },
      SHIPPED: { color: 'secondary', icon: <LocalShipping /> },
      DELIVERED: { color: 'success', icon: <CheckCircle /> },
      CANCELLED: { color: 'error', icon: <Cancel /> },
    };
    const { color, icon } = config[status] || config.PENDING;
    return (
      <Chip
        icon={icon}
        label={status}
        color={color}
        size="small"
        sx={{ fontWeight: 'bold' }}
      />
    );
  };

  const getPaymentStatusChip = (status) => {
    const colors = {
      PENDING: 'warning',
      PAID: 'success',
      FAILED: 'error',
    };
    return (
      <Chip
        label={status || 'PENDING'}
        color={colors[status] || 'default'}
        size="small"
        variant="outlined"
      />
    );
  };

  const getDeliveryStatusChip = (status) => {
    const colors = {
      PENDING: 'warning',
      PICKED_UP: 'info',
      IN_TRANSIT: 'primary',
      OUT_FOR_DELIVERY: 'secondary',
      DELIVERED: 'success',
      FAILED: 'error',
    };
    return (
      <Chip
        label={status || 'PENDING'}
        color={colors[status] || 'default'}
        size="small"
        variant="outlined"
      />
    );
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} sx={{ color: '#4caf50' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: '#4caf50' }}>
          My Orders
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Track and manage your orders
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {orders.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <CardContent>
              <Receipt sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                No orders yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                You haven't placed any orders. Start shopping to see your orders here.
              </Typography>
              <Button
                variant="contained"
                href="/products"
                sx={{
                  background: '#4caf50',
                  '&:hover': { background: '#388e3c' },
                }}
              >
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Order Statistics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                    {orders.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#e3c770' }}>
                    {orders.filter(o => o.status === 'DELIVERED').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Delivered
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff7043' }}>
                    {orders.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In Progress
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#42a5f5' }}>
                    KES {orders
                      .filter(o => o.status === 'PAID' || o.status === 'DELIVERED')
                      .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
                      .toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Spent
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Orders Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: '#f5f5f5' }}>
                    <TableCell><strong>Order ID</strong></TableCell>
                    <TableCell><strong>Amount</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Payment</strong></TableCell>
                    <TableCell><strong>Delivery</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {order.referenceCode}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                          KES {(order.totalAmount || 0).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>{getStatusChip(order.status)}</TableCell>
                      <TableCell>{getPaymentStatusChip(order.paymentStatus)}</TableCell>
                      <TableCell>{getDeliveryStatusChip(order.deliveryStatus)}</TableCell>
                      <TableCell>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleViewDetails(order)}
                          sx={{ color: '#4caf50' }}
                        >
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </motion.div>

      {/* Order Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              Order Details: {selectedOrder.referenceCode}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Order Summary */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                    {getStatusChip(selectedOrder.status)}
                    {getPaymentStatusChip(selectedOrder.paymentStatus)}
                    {getDeliveryStatusChip(selectedOrder.deliveryStatus)}
                  </Box>
                </Grid>

                {/* Order Items */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Order Items
                  </Typography>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, background: '#f5f5f5', borderRadius: 2 }}>
                        {item.imageUrl && (
                          <Box
                            component="img"
                            src={item.imageUrl}
                            alt={item.name}
                            sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1, mr: 2 }}
                          />
                        )}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Qty: {item.quantity} × KES {(item.unitPrice || 0).toLocaleString()}
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                          KES {((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString()}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography color="text.secondary">No items found</Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                {/* Delivery Information */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Delivery Information
                  </Typography>
                  <Box sx={{ p: 2, background: '#f5f5f5', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Address:</strong> {selectedOrder.deliveryAddress || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>City:</strong> {selectedOrder.deliveryCity || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>County:</strong> {selectedOrder.deliveryCounty || 'N/A'}
                    </Typography>
                    {selectedOrder.deliveryLatitude && selectedOrder.deliveryLongitude && (
                      <Typography variant="body2" color="primary">
                        <LocationOn sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                        GPS: {selectedOrder.deliveryLatitude.toFixed(4)}, {selectedOrder.deliveryLongitude.toFixed(4)}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Payment Summary */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Payment Summary
                  </Typography>
                  <Box sx={{ p: 2, background: '#f5f5f5', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Payment Method:</Typography>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {selectedOrder.paymentMethod || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Currency:</Typography>
                      <Typography>{selectedOrder.currency || 'KES'}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6">Total:</Typography>
                      <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                        KES {(selectedOrder.totalAmount || 0).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialogOpen(false)}>
                Close
              </Button>
              {selectedOrder.status === 'DELIVERED' && (
                <Button
                  variant="contained"
                  sx={{ background: '#4caf50', '&:hover': { background: '#388e3c' } }}
                >
                  Download Receipt
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Orders;
