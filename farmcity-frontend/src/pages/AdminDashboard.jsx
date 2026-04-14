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
} from '@mui/material';
import {
  People,
  ShoppingCart,
  AttachMoney,
  TrendingUp,
  Visibility,
  Edit,
  CheckCircle,
  LocalShipping,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { adminAPI } from '../api/farmcityApi';

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

  const COLORS = ['#4caf50', '#e3c770', '#ff7043', '#42a5f5', '#ab47bc', '#26a69a'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes, usersRes, revenueRes, countyRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getOrders(),
        adminAPI.getUsers(),
        adminAPI.getRevenueData('month'),
        adminAPI.getOrdersByCounty(),
      ]);

      setStats(statsRes);
      setOrders(ordersRes || []);
      setUsers(usersRes || []);
      setRevenueData(revenueRes || []);
      setCountyData(countyRes || []);
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
        <Alert severity="error" sx={{ mb: 3 }}>
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
                <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
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
                <Tooltip />
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
    </Container>
  );
};

export default AdminDashboard;
