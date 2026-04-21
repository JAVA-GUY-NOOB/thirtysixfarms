import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  People,
  ShoppingCart,
  AttachMoney,
  TrendingUp,
  Edit,
  Delete,
  Add,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { adminAPI, adsOffersAPI } from '../api/farmcityApi';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [countyData, setCountyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  // Ads & Offers state
  const [ads, setAds] = useState([]);
  const [offers, setOffers] = useState([]);
  const [adStats, setAdStats] = useState(null);
  const [adDialogOpen, setAdDialogOpen] = useState(false);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [editingOffer, setEditingOffer] = useState(null);

  const COLORS = ['#4caf50', '#e3c770', '#ff7043', '#42a5f5', '#ab47bc', '#26a69a'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        statsRes,
        ordersRes,
        usersRes,
        revenueRes,
        countyRes,
        adsRes,
        offersRes,
        adStatsRes,
      ] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getOrders(),
        adminAPI.getUsers(),
        adminAPI.getRevenueData('month'),
        adminAPI.getOrdersByCounty(),
        adsOffersAPI.getAllAds().catch(() => []),
        adsOffersAPI.getAllOffers().catch(() => []),
        adsOffersAPI.getAdStats().catch(() => null),
      ]);

      setStats(statsRes);
      setOrders(ordersRes || []);
      setUsers(usersRes || []);
      setRevenueData(revenueRes || []);
      setCountyData(countyRes || []);
      setAds(adsRes || []);
      setOffers(offersRes || []);
      setAdStats(adStatsRes);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      await adminAPI.updateOrderStatus(selectedOrder.id, { status: newStatus });
      setStatusDialogOpen(false);
      fetchDashboardData();
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  // Ad Management
  const handleSaveAd = async (adData) => {
    try {
      if (editingAd) {
        await adsOffersAPI.updateAd(editingAd.id, adData);
      } else {
        await adsOffersAPI.createAd(adData);
      }
      setAdDialogOpen(false);
      setEditingAd(null);
      fetchDashboardData();
    } catch (err) {
      setError('Failed to save advertisement');
    }
  };

  const handleDeleteAd = async (id) => {
    if (!window.confirm('Are you sure you want to delete this advertisement?')) return;
    try {
      await adsOffersAPI.deleteAd(id);
      fetchDashboardData();
    } catch (err) {
      setError('Failed to delete advertisement');
    }
  };

  // Offer Management
  const handleSaveOffer = async (offerData) => {
    try {
      if (editingOffer) {
        await adsOffersAPI.updateOffer(editingOffer.id, offerData);
      } else {
        await adsOffersAPI.createOffer(offerData);
      }
      setOfferDialogOpen(false);
      setEditingOffer(null);
      fetchDashboardData();
    } catch (err) {
      setError('Failed to save offer');
    }
  };

  const handleDeleteOffer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    try {
      await adsOffersAPI.deleteOffer(id);
      fetchDashboardData();
    } catch (err) {
      setError('Failed to delete offer');
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                {title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color }}>
                {value}
              </Typography>
            </Box>
            <Box sx={{ color, fontSize: 40 }}>{icon}</Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const getStatusChip = (status) => {
    const colors = {
      PENDING: 'warning',
      PAID: 'success',
      PROCESSING: 'info',
      SHIPPED: 'primary',
      DELIVERED: 'success',
      CANCELLED: 'error',
    };
    return <Chip label={status} color={colors[status] || 'default'} size="small" />;
  };

  const getPaymentStatusChip = (status) => {
    const colors = {
      PENDING: 'warning',
      PAID: 'success',
      FAILED: 'error',
    };
    return <Chip label={status} color={colors[status] || 'default'} size="small" variant="outlined" />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress size={60} sx={{ color: '#4caf50' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: '#4caf50' }}>
        Admin Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={<People />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            icon={<ShoppingCart />}
            color="#e3c770"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`KES ${(stats?.totalRevenue || 0).toLocaleString()}`}
            icon={<AttachMoney />}
            color="#ff7043"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Orders"
            value={stats?.todayOrders || 0}
            icon={<TrendingUp />}
            color="#42a5f5"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Revenue Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <RechartsTooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4caf50"
                  strokeWidth={3}
                  dot={{ fill: '#4caf50' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Orders by County Pie Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Orders by County
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={countyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.county}: ${entry.orderCount}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="orderCount"
                >
                  {countyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Paper sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={`Orders (${orders.length})`} />
          <Tab label={`Users (${users.length})`} />
          <Tab label={`Ads (${ads.length})`} />
          <Tab label={`Offers (${offers.length})`} />
        </Tabs>

        {/* Orders Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Payment</TableCell>
                    <TableCell>County</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.referenceCode}</TableCell>
                      <TableCell>{order.user?.fullName || 'N/A'}</TableCell>
                      <TableCell>KES {order.totalAmount?.toLocaleString()}</TableCell>
                      <TableCell>{getStatusChip(order.status)}</TableCell>
                      <TableCell>{getPaymentStatusChip(order.paymentStatus)}</TableCell>
                      <TableCell>{order.deliveryCounty || 'N/A'}</TableCell>
                      <TableCell>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            setSelectedOrder(order);
                            setNewStatus(order.status);
                            setStatusDialogOpen(true);
                          }}
                          sx={{ color: '#4caf50' }}
                        >
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Users Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>County</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Orders</TableCell>
                    <TableCell>Joined</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography fontWeight="bold">{user.fullName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            ({user.username})
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phoneNumber || 'N/A'}</TableCell>
                      <TableCell>{user.county || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={user.role === 'ADMIN' ? 'primary' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{user.orderCount || 0}</TableCell>
                      <TableCell>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Ads Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Advertisements Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  setEditingAd(null);
                  setAdDialogOpen(true);
                }}
                sx={{ background: '#4caf50' }}
              >
                Add Advertisement
              </Button>
            </Box>

            {adStats && (
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} md={3}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                      {adStats.totalAds}
                    </Typography>
                    <Typography variant="body2">Total Ads</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#e3c770' }}>
                      {adStats.totalImpressions?.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">Impressions</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ff7043' }}>
                      {adStats.totalClicks?.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">Clicks</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#42a5f5' }}>
                      {adStats.clickThroughRate}%
                    </Typography>
                    <Typography variant="body2">CTR</Typography>
                  </Card>
                </Grid>
              </Grid>
            )}

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Impressions</TableCell>
                    <TableCell>Clicks</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ads.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell>
                        <Typography fontWeight="bold">{ad.title}</Typography>
                      </TableCell>
                      <TableCell>{ad.position}</TableCell>
                      <TableCell>
                        <Chip label={ad.adType} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ad.isActive ? 'Active' : 'Inactive'}
                          color={ad.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{ad.impressions?.toLocaleString() || 0}</TableCell>
                      <TableCell>{ad.clicks?.toLocaleString() || 0}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            setEditingAd(ad);
                            setAdDialogOpen(true);
                          }}
                          sx={{ color: '#4caf50' }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteAd(ad.id)}
                          sx={{ color: '#f44336' }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Offers Tab */}
        {activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Promotional Offers
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  setEditingOffer(null);
                  setOfferDialogOpen(true);
                }}
                sx={{ background: '#4caf50' }}
              >
                Create Offer
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Promo Code</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Discount</TableCell>
                    <TableCell>Usage</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {offers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell>
                        <Typography fontWeight="bold">{offer.title}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={offer.promoCode} color="primary" size="small" />
                      </TableCell>
                      <TableCell>{offer.offerType}</TableCell>
                      <TableCell>
                        {offer.discountPercentage
                          ? `${offer.discountPercentage}%`
                          : offer.discountAmount
                          ? `KES ${offer.discountAmount}`
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {offer.usageCount || 0}
                        {offer.usageLimit && ` / ${offer.usageLimit}`}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={offer.isActive ? 'Active' : 'Inactive'}
                          color={offer.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            setEditingOffer(offer);
                            setOfferDialogOpen(true);
                          }}
                          sx={{ color: '#4caf50' }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteOffer(offer.id)}
                          sx={{ color: '#f44336' }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="PROCESSING">Processing</MenuItem>
              <MenuItem value="SHIPPED">Shipped</MenuItem>
              <MenuItem value="DELIVERED">Delivered</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            sx={{ backgroundColor: '#4caf50' }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ad Dialog */}
      <AdDialog
        open={adDialogOpen}
        onClose={() => {
          setAdDialogOpen(false);
          setEditingAd(null);
        }}
        onSave={handleSaveAd}
        ad={editingAd}
      />

      {/* Offer Dialog */}
      <OfferDialog
        open={offerDialogOpen}
        onClose={() => {
          setOfferDialogOpen(false);
          setEditingOffer(null);
        }}
        onSave={handleSaveOffer}
        offer={editingOffer}
      />
    </Container>
  );
};

// Ad Dialog Component
const AdDialog = ({ open, onClose, onSave, ad }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    targetUrl: '',
    position: 'HOME_BANNER',
    adType: 'PROMOTIONAL',
    backgroundColor: '#4caf50',
    textColor: '#ffffff',
    isActive: true,
    priority: 0,
  });

  useEffect(() => {
    if (ad) {
      setFormData({
        title: ad.title || '',
        description: ad.description || '',
        imageUrl: ad.imageUrl || '',
        targetUrl: ad.targetUrl || '',
        position: ad.position || 'HOME_BANNER',
        adType: ad.adType || 'PROMOTIONAL',
        backgroundColor: ad.backgroundColor || '#4caf50',
        textColor: ad.textColor || '#ffffff',
        isActive: ad.isActive ?? true,
        priority: ad.priority || 0,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        targetUrl: '',
        position: 'HOME_BANNER',
        adType: 'PROMOTIONAL',
        backgroundColor: '#4caf50',
        textColor: '#ffffff',
        isActive: true,
        priority: 0,
      });
    }
  }, [ad, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{ad ? 'Edit Advertisement' : 'Create Advertisement'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Image URL"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Target URL"
                value={formData.targetUrl}
                onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Position</InputLabel>
                <Select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  label="Position"
                >
                  <MenuItem value="HOME_BANNER">Home Banner</MenuItem>
                  <MenuItem value="HOME_SIDEBAR">Home Sidebar</MenuItem>
                  <MenuItem value="PRODUCT_PAGE">Product Page</MenuItem>
                  <MenuItem value="CHECKOUT_PAGE">Checkout Page</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Ad Type</InputLabel>
                <Select
                  value={formData.adType}
                  onChange={(e) => setFormData({ ...formData, adType: e.target.value })}
                  label="Ad Type"
                >
                  <MenuItem value="PROMOTIONAL">Promotional</MenuItem>
                  <MenuItem value="EXTERNAL_AD">External Ad</MenuItem>
                  <MenuItem value="INTERNAL_FEATURE">Internal Feature</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="color"
                label="Background Color"
                value={formData.backgroundColor}
                onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="color"
                label="Text Color"
                value={formData.textColor}
                onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" sx={{ background: '#4caf50' }}>
            {ad ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Offer Dialog Component
const OfferDialog = ({ open, onClose, onSave, offer }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    promoCode: '',
    offerType: 'PERCENTAGE',
    discountPercentage: 10,
    discountAmount: 0,
    minimumOrderAmount: 0,
    maxDiscount: null,
    usageLimit: null,
    isActive: true,
    displayOnHomepage: true,
  });

  useEffect(() => {
    if (offer) {
      setFormData({
        title: offer.title || '',
        description: offer.description || '',
        promoCode: offer.promoCode || '',
        offerType: offer.offerType || 'PERCENTAGE',
        discountPercentage: offer.discountPercentage || 0,
        discountAmount: offer.discountAmount || 0,
        minimumOrderAmount: offer.minimumOrderAmount || 0,
        maxDiscount: offer.maxDiscount || '',
        usageLimit: offer.usageLimit || '',
        isActive: offer.isActive ?? true,
        displayOnHomepage: offer.displayOnHomepage ?? true,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        promoCode: '',
        offerType: 'PERCENTAGE',
        discountPercentage: 10,
        discountAmount: 0,
        minimumOrderAmount: 0,
        maxDiscount: '',
        usageLimit: '',
        isActive: true,
        displayOnHomepage: true,
      });
    }
  }, [offer, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
    };
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{offer ? 'Edit Offer' : 'Create Offer'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Promo Code"
                value={formData.promoCode}
                onChange={(e) => setFormData({ ...formData, promoCode: e.target.value.toUpperCase() })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Offer Type</InputLabel>
                <Select
                  value={formData.offerType}
                  onChange={(e) => setFormData({ ...formData, offerType: e.target.value })}
                  label="Offer Type"
                >
                  <MenuItem value="PERCENTAGE">Percentage Discount</MenuItem>
                  <MenuItem value="FIXED_AMOUNT">Fixed Amount</MenuItem>
                  <MenuItem value="FREE_SHIPPING">Free Shipping</MenuItem>
                  <MenuItem value="BUY_ONE_GET_ONE">Buy One Get One</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {formData.offerType === 'PERCENTAGE' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Discount Percentage"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: parseFloat(e.target.value) || 0 })}
                    InputProps={{ inputProps: { min: 0, max: 100 } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Maximum Discount (optional)"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    placeholder="No limit"
                  />
                </Grid>
              </>
            )}
            {formData.offerType === 'FIXED_AMOUNT' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Discount Amount (KES)"
                  value={formData.discountAmount}
                  onChange={(e) => setFormData({ ...formData, discountAmount: parseFloat(e.target.value) || 0 })}
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Minimum Order Amount (KES)"
                value={formData.minimumOrderAmount}
                onChange={(e) => setFormData({ ...formData, minimumOrderAmount: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Usage Limit (optional)"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                placeholder="Unlimited"
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                  }
                  label="Active"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.displayOnHomepage}
                      onChange={(e) => setFormData({ ...formData, displayOnHomepage: e.target.checked })}
                    />
                  }
                  label="Display on Homepage"
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" sx={{ background: '#4caf50' }}>
            {offer ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AdminDashboard;
