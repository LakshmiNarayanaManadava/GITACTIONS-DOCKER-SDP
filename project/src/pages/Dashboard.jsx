import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../utils/api';
import {
  UsersIcon,
  CubeIcon,
  TruckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    totalSuppliers: 0,
    totalUsers: 0
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(false); // Start with false for faster loading
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load data in background without blocking UI
    fetchStats();
    fetchLowStockProducts();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Set default stats if API fails
      setStats({
        totalProducts: 0,
        lowStockCount: 0,
        totalSuppliers: 0,
        totalUsers: 0
      });
    } finally {
      // Data loaded successfully
    }
  };

  const fetchLowStockProducts = async () => {
    try {
      const response = await apiService.getProducts();
      const lowStock = response.data.filter(product => product.stock <= product.lowStockThreshold);
      setLowStockProducts(lowStock);
    } catch (error) {
      console.error('Failed to fetch low stock products:', error);
      // Set empty array if API fails
      setLowStockProducts([]);
    }
  };

  // Remove loading spinner for faster display
  // if (loading) {
  //   return <LoadingSpinner text="Loading dashboard..." />;
  // }

  const getWelcomeMessage = () => {
    switch (user.role) {
      case 'Admin':
        return 'Welcome to the Admin Dashboard. Manage users, inventory, and view comprehensive reports.';
      case 'Manager':
        return 'Welcome to the Manager Dashboard. Oversee inventory and supplier management.';
      case 'Staff':
        return 'Welcome to the Staff Dashboard. View and update stock quantities.';
      default:
        return 'Welcome to your dashboard.';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Good morning, {user?.username || 'User'}!
        </h1>
        <p className="mt-2 text-gray-600">{getWelcomeMessage()}</p>
      </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
               <Card
                 title="Total Products"
                 value={stats.totalProducts}
                 icon={CubeIcon}
                 color="primary"
                 trend={{ positive: true, value: 12.5 }}
               />

               <Card
                 title="Low Stock Alerts"
                 value={stats.lowStockCount}
                 icon={ExclamationTriangleIcon}
                 color="red"
                 trend={{ positive: false, value: 2.3 }}
               />

               {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
                 <Card
                   title="Total Suppliers"
                   value={stats.totalSuppliers}
                   icon={TruckIcon}
                   color="secondary"
                   trend={{ positive: true, value: 5.8 }}
                 />
               )}

               {user?.role === 'Admin' && (
                 <Card
                   title="Total Users"
                   value={stats.totalUsers}
                   icon={UsersIcon}
                   color="accent"
                   trend={{ positive: true, value: 8.2 }}
                 />
               )}
             </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
            Low Stock Alerts
          </h3>
          <div className="space-y-4">
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ExclamationTriangleIcon className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-500">All products are well stocked!</p>
              </div>
            ) : (
              lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-red-600">
                      Only {product.stock} left (threshold: {product.lowStockThreshold})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{product.category}</p>
                    <p className="text-xs font-medium text-gray-900">${product.price}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

               <div className="card">
                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {/* Admin only actions */}
                   {user?.role === 'Admin' && (
                     <>
                       <button
                         onClick={() => navigate('/users')}
                         className="btn-primary text-sm py-3 hover:bg-blue-700 transition-colors"
                       >
                         Manage Users
                       </button>
                       <button
                         onClick={() => navigate('/reports')}
                         className="btn-primary text-sm py-3 hover:bg-blue-700 transition-colors"
                       >
                         View Reports
                       </button>
                     </>
                   )}

                   {/* Admin and Manager actions */}
                   {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
                     <>
                       <button
                         onClick={() => navigate('/inventory')}
                         className="btn-primary text-sm py-3 hover:bg-blue-700 transition-colors"
                       >
                         Manage Inventory
                       </button>
                       <button
                         onClick={() => navigate('/suppliers')}
                         className="btn-secondary text-sm py-3 hover:bg-gray-600 transition-colors"
                       >
                         Manage Suppliers
                       </button>
                     </>
                   )}

                   {/* All roles can access */}
                   <button
                     onClick={() => navigate('/stock')}
                     className="btn-secondary text-sm py-3 hover:bg-gray-600 transition-colors"
                   >
                     Update Stock
                   </button>
                   <button
                     onClick={() => navigate('/settings')}
                     className="btn-secondary text-sm py-3 hover:bg-gray-600 transition-colors"
                   >
                     Settings
                   </button>
                 </div>
               </div>
      </div>
    </div>
  );
};

export default Dashboard;