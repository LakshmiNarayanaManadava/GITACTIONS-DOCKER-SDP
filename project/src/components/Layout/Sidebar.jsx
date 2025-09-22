import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  UsersIcon,
  CubeIcon,
  TruckIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ExclamationTriangleIcon,
  UserIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, hasAnyRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      roles: ['ADMIN', 'MANAGER', 'STAFF'],
      description: 'Overview and analytics'
    },

    
    {
      name: 'User Management',
      href: '/users',
      icon: UsersIcon,
      roles: ['ADMIN'],
      description: 'Complete user lifecycle management'
    },
    {
      name: 'System Analytics',
      href: '/reports',
      icon: DocumentChartBarIcon,
      roles: ['ADMIN'],
      description: 'Business intelligence and system analytics'
    },
    {
      name: 'System Settings',
      href: '/settings',
      icon: Cog6ToothIcon,
      roles: ['ADMIN'],
      description: 'System configuration and administration'
    },

    
    {
      name: 'Inventory Management',
      href: '/inventory',
      icon: CubeIcon,
      roles: ['MANAGER'],
      description: 'Product catalog and inventory operations'
    },
    {
      name: 'Supplier Management',
      href: '/suppliers',
      icon: TruckIcon,
      roles: ['MANAGER'],
      description: 'Vendor relations and supplier operations'
    },
    {
      name: 'Task Management',
      href: '/task-management',
      icon: ClipboardDocumentListIcon,
      roles: ['MANAGER'],
      description: 'Assign and manage tasks for staff'
    },

   
    {
      name: 'Stock Management',
      href: '/stock',
      icon: CubeIcon,
      roles: ['STAFF'],
      description: 'Daily stock operations and updates',
      subItems: [
        { name: 'Stock Overview', href: '/stock' }
      ]
    },
    {
      name: 'My Tasks',
      href: '/tasks',
      icon: ClipboardDocumentListIcon,
      roles: ['STAFF'],
      description: 'Personal tasks and assignments',
      subItems: [
        { name: 'Assigned Tasks', href: '/tasks' },
        { name: 'Completed Tasks', href: '/tasks' },
        { name: 'Task History', href: '/tasks' }
      ]
    },

    
    {
      name: 'Profile Settings',
      href: '/profile',
      icon: UserIcon,
      roles: ['ADMIN', 'MANAGER', 'STAFF'],
      description: 'Personal settings'
    },
    {
      name: 'Notifications',
      href: '/notifications',
      icon: ExclamationTriangleIcon,
      roles: ['ADMIN', 'MANAGER', 'STAFF'],
      description: 'Alerts and notifications'
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    hasAnyRole(item.roles)
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">InventoryMS</h2>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.username}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          {filteredMenuItems.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <p>No menu items available for your role</p>
            </div>
          ) : (
            filteredMenuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            ))
          )}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition duration-200"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg"
      >
        <Bars3Icon className="h-6 w-6 text-gray-600" />
      </button>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <div className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <SidebarContent />
        </div>
      </div>
    </>
  );
};

export default Sidebar;