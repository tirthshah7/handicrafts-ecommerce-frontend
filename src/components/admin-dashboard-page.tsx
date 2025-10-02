import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { OrderService, type Order } from '../services/orderService';
import { NotificationService } from '../services/notificationService';
import { 
  ArrowLeft, 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  Clock,
  Check,
  X,
  Star,
  Tag,
  Image,
  Save,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  Target,
  Activity,
  LogOut
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner@2.0.3';

interface AdminDashboardPageProps {
  onBackToHome: () => void;
  onLogout?: () => void;
}

// Mock data for demonstration
const salesData = [
  { month: 'Jan', sales: 45000, orders: 120 },
  { month: 'Feb', sales: 52000, orders: 145 },
  { month: 'Mar', sales: 48000, orders: 132 },
  { month: 'Apr', sales: 61000, orders: 167 },
  { month: 'May', sales: 55000, orders: 154 },
  { month: 'Jun', sales: 67000, orders: 189 },
];

const categoryData = [
  { name: "Mahima's Jewellery", value: 45, color: '#d97706' },
  { name: "Mahima's Mandala Art", value: 30, color: '#f59e0b' },
  { name: 'Premium Collection', value: 15, color: '#fed7aa' },
  { name: 'Novelty Products', value: 10, color: '#fbbf24' },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'Priya Sharma', total: 15999, status: 'pending', date: '2024-10-01' },
  { id: 'ORD-002', customer: 'Rahul Kumar', total: 8499, status: 'processing', date: '2024-10-01' },
  { id: 'ORD-003', customer: 'Anjali Gupta', total: 12799, status: 'shipped', date: '2024-09-30' },
  { id: 'ORD-004', customer: 'Vikram Singh', total: 24999, status: 'delivered', date: '2024-09-30' },
  { id: 'ORD-005', customer: 'Meera Patel', total: 6799, status: 'cancelled', date: '2024-09-29' },
];

const productData = [
  { id: 'PRD-001', name: 'Golden Temple Necklace Set', category: "Mahima's Jewellery", price: 15999, stock: 12, status: 'active', isPremium: true, tags: ['sale'] },
  { id: 'PRD-002', name: 'Sacred Lotus Mandala Canvas', category: "Mahima's Mandala Art", price: 8499, stock: 3, status: 'active', isPremium: false, tags: ['limited'] },
  { id: 'PRD-003', name: 'Royal Peacock Earrings', category: "Mahima's Jewellery", price: 12799, stock: 8, status: 'active', isPremium: true, tags: ['new'] },
  { id: 'PRD-004', name: 'Handcrafted Wooden Box', category: 'Novelty Products', price: 2499, stock: 0, status: 'out_of_stock', isPremium: false, tags: [] },
];

const userData = [
  { id: 'USR-001', name: 'Priya Sharma', email: 'priya.sharma@email.com', phone: '+91 98765 43210', orders: 12, totalSpent: 45000, status: 'active', joinDate: '2024-01-15' },
  { id: 'USR-002', name: 'Rahul Kumar', email: 'rahul.kumar@email.com', phone: '+91 87654 32109', orders: 8, totalSpent: 28000, status: 'active', joinDate: '2024-02-20' },
  { id: 'USR-003', name: 'Anjali Gupta', email: 'anjali.gupta@email.com', phone: '+91 76543 21098', orders: 15, totalSpent: 67000, status: 'active', joinDate: '2023-11-10' },
  { id: 'USR-004', name: 'Vikram Singh', email: 'vikram.singh@email.com', phone: '+91 65432 10987', orders: 3, totalSpent: 12000, status: 'inactive', joinDate: '2024-08-05' },
];

export function AdminDashboardPage({ onBackToHome, onLogout }: AdminDashboardPageProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Backend state
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Order management state
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  // Load admin data on component mount
  useEffect(() => {
    const loadAdminData = async () => {
      setIsLoading(true);
      try {
        // Load products
        const productsResponse = await api.getProducts();
        if (productsResponse.success) {
          setProducts(productsResponse.data.products);
        }

        // Load analytics
        const analyticsResponse = await api.getAnalytics();
        if (analyticsResponse.success) {
          setAnalytics(analyticsResponse.data.analytics);
        }

        // Load orders
        const ordersResponse = await api.getAllOrders();
        if (ordersResponse.success) {
          setOrders(ordersResponse.data.orders);
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const handleUpdateProductStock = (productId: string, newStock: number) => {
    toast.success(`Stock updated for product ${productId}`, {
      description: `New stock level: ${newStock}`,
    });
  };

  // Order management functions
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status'], notes?: string) => {
    setIsUpdatingOrder(true);
    try {
      const response = await OrderService.updateOrderStatus(orderId, newStatus, notes);
      if (response.success && response.order) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? response.order! : order
        ));
        
        // Send appropriate notification email
        try {
          switch (newStatus) {
            case 'shipped':
              await NotificationService.sendOrderShipped(response.order);
              break;
            case 'delivered':
              await NotificationService.sendOrderDelivered(response.order);
              break;
          }
        } catch (error) {
          console.error('Failed to send notification email:', error);
        }
        
        toast.success(`Order status updated to ${OrderService.getStatusText(newStatus)}`);
      } else {
        toast.error(response.error || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                         order.customerDetails.name.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                         order.customerDetails.email.toLowerCase().includes(orderSearchTerm.toLowerCase());
    
    const matchesFilter = orderFilter === 'all' || order.status === orderFilter;
    
    return matchesSearch && matchesFilter;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };


  const handleDeleteUser = (userId: string) => {
    toast.success(`User ${userId} deleted successfully`);
  };

  const handleLogout = () => {
    // Remove admin auth from localStorage
    localStorage.removeItem('bhavyakavya-admin-auth');
    toast.success('Logged out successfully');
    if (onLogout) {
      onLogout();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'out_of_stock': return 'bg-red-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBackToHome}
                className="hover:bg-secondary"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Website
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">BhavyaKavya's Management Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Admin Access
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hover:bg-destructive hover:text-destructive-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">₹3,28,000</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">1,207</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +8% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">2,847</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +15% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">3.2%</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingDown className="inline h-3 w-3 mr-1" />
                    -2% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>Monthly sales and order trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(217, 119, 6, 0.1)" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#d97706" 
                        fill="#d97706" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                  <CardDescription>Sales by product category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>₹{order.total.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(order.status)} text-white`}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Product Management</h2>
                <p className="text-muted-foreground">Manage your product catalog, inventory, and tags</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>Create a new product in your catalog</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input id="name" placeholder="Enter product name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jewellery">Mahima's Jewellery</SelectItem>
                          <SelectItem value="mandala">Mahima's Mandala Art</SelectItem>
                          <SelectItem value="premium">Premium Collection</SelectItem>
                          <SelectItem value="novelty">Novelty Products</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input id="price" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input id="stock" type="number" placeholder="0" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Product description..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Premium Product</Label>
                      <Switch />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input id="tags" placeholder="sale, new, limited (comma separated)" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-primary hover:bg-primary/90">Create Product</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="premium">Premium Only</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Products Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productData.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">{product.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>₹{product.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{product.stock}</span>
                            {product.stock <= 3 && product.stock > 0 && (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                Low Stock
                              </Badge>
                            )}
                            {product.stock === 0 && (
                              <Badge variant="outline" className="text-red-600 border-red-600">
                                Out of Stock
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(product.status)} text-white`}>
                            {product.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {product.isPremium && (
                              <Badge variant="outline" className="text-primary border-primary">
                                Premium
                              </Badge>
                            )}
                            {product.tags.map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Product</DialogTitle>
                                  <DialogDescription>Update product information</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label>Stock Quantity</Label>
                                    <Input 
                                      type="number" 
                                      defaultValue={product.stock}
                                      onChange={(e) => handleUpdateProductStock(product.id, parseInt(e.target.value))}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Product Tags</Label>
                                    <div className="flex flex-wrap gap-2">
                                      <Button variant="outline" size="sm">
                                        <Tag className="h-3 w-3 mr-1" />
                                        Sale
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        <Star className="h-3 w-3 mr-1" />
                                        Premium
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        Limited
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline">Cancel</Button>
                                  <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this product? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Order Management</h2>
                <p className="text-muted-foreground">Process orders and manage fulfillment</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Orders
                </Button>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Order Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {orders.filter(o => o.status === 'pending').length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Processing</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {orders.filter(o => o.status === 'processing').length}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Shipped</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {orders.filter(o => o.status === 'shipped').length}
                      </p>
                    </div>
                    <Package className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Delivered</p>
                      <p className="text-2xl font-bold text-green-600">
                        {orders.filter(o => o.status === 'delivered').length}
                      </p>
                    </div>
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orders Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customerDetails.name}</div>
                            <div className="text-sm text-muted-foreground">{order.customerDetails.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell className="font-medium">{formatPrice(order.totalAmount)}</TableCell>
                        <TableCell>
                          <Select 
                            value={order.status} 
                            onValueChange={(value) => handleUpdateOrderStatus(order.id, value as Order['status'])}
                            disabled={isUpdatingOrder}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Badge className={OrderService.getPaymentStatusColor(order.paymentStatus)}>
                              {OrderService.getPaymentStatusText(order.paymentStatus)}
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">User Management</h2>
                <p className="text-muted-foreground">Manage customer accounts and data</p>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Users
              </Button>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold text-primary">2,847</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold text-green-600">2,654</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">New This Month</p>
                      <p className="text-2xl font-bold text-blue-600">193</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Users Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userData.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span className="text-sm">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span className="text-sm">{user.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.orders}</TableCell>
                        <TableCell>₹{user.totalSpent.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(user.status)} text-white`}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this user account? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => handleDeleteUser(user.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Inventory Management</h2>
                <p className="text-muted-foreground">Monitor stock levels and manage inventory alerts</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Import
                </Button>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Update Stock
                </Button>
              </div>
            </div>

            {/* Inventory Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600 dark:text-red-400">Out of Stock</p>
                      <p className="text-2xl font-bold text-red-700 dark:text-red-300">8</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">Low Stock</p>
                      <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">15</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 dark:text-green-400">Well Stocked</p>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-300">342</p>
                    </div>
                    <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stock Levels */}
            <Card>
              <CardHeader>
                <CardTitle>Stock Level Alerts</CardTitle>
                <CardDescription>Products requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productData.filter(p => p.stock <= 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${product.stock === 0 ? 'bg-red-500' : 'bg-yellow-500'}`} />
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">Stock: {product.stock}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.stock === 0 ? 'Out of stock' : 'Low stock'}
                          </p>
                        </div>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          Update Stock
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Site Settings</h2>
              <p className="text-muted-foreground">Configure website settings and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* General Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Basic website configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input id="siteName" defaultValue="BhavyaKavya's" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input id="tagline" defaultValue="Crafting a Poem of Splendid Living" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Site Description</Label>
                    <Textarea id="description" defaultValue="Premium handcrafted jewelry and traditional art pieces..." />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="maintenance" />
                    <Label htmlFor="maintenance">Maintenance Mode</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure admin notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="orderNotifs">New Order Notifications</Label>
                    <Switch id="orderNotifs" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="stockNotifs">Low Stock Alerts</Label>
                    <Switch id="stockNotifs" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="userNotifs">New User Registrations</Label>
                    <Switch id="userNotifs" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reviewNotifs">Product Reviews</Label>
                    <Switch id="reviewNotifs" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Configuration</CardTitle>
                  <CardDescription>Payment gateway settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="razorpay">Razorpay Key ID</Label>
                    <Input id="razorpay" placeholder="rzp_test_..." type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select defaultValue="INR">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="cod" defaultChecked />
                    <Label htmlFor="cod">Enable Cash on Delivery</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Configuration</CardTitle>
                  <CardDescription>Shipping rates and policies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="freeShipping">Free Shipping Threshold (₹)</Label>
                    <Input id="freeShipping" type="number" defaultValue="999" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingRate">Standard Shipping Rate (₹)</Label>
                    <Input id="shippingRate" type="number" defaultValue="99" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="processingTime">Processing Time (days)</Label>
                    <Input id="processingTime" type="number" defaultValue="2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Save Settings */}
            <div className="flex justify-end">
              <Button className="bg-primary hover:bg-primary/90">
                <Save className="h-4 w-4 mr-2" />
                Save All Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}