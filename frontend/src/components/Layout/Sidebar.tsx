// 📂 components/Layout/Sidebar.tsx
import React from 'react';
import {
  Home,
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  Settings,
  X,
  User,
  BarChart2,
  LifeBuoy,
  LogOut,
  Bell,
  Moon,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isOpen,
  onClose,
}) => {
  const { user, logout } = useAuth();
  const role = user?.user_type;
  const navigate = useNavigate();

  const commonItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const borrowerItems = [
    { id: 'borrow', label: 'Borrow Money', icon: DollarSign },
  ];

  const lenderItems = [
    { id: 'requests', label: 'Requests', icon: Users },
    { id: 'lending-stats', label: 'Lending Stats', icon: BarChart2 },
  ];

  const handleThemeToggle = () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const bonusItems = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'help', label: 'Help & Support', icon: LifeBuoy },
    { id: 'theme', label: 'Toggle Theme', icon: Moon, action: handleThemeToggle },
    { id: 'logout', label: 'Logout', icon: LogOut, action: handleLogout },
  ];

  const getMenuItems = () => {
    let items = [...commonItems];
    if (role === 'borrower') items = [...items, ...borrowerItems];
    if (role === 'lender') items = [...items, ...lenderItems];
    if (role === 'both') items = [...items, ...borrowerItems, ...lenderItems];
    return [...items, ...bonusItems];
  };

  const renderAvatar = () => {
    const name = user?.full_name || 'User';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return (
      <div className="flex items-center space-x-3 px-4 pt-4">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          {initials}
        </div>
        <div>
          <p className="font-medium text-sm text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{user?.user_type}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition-transform duration-300 ease-in-out
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 lg:hidden">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">LendConnect</h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {renderAvatar()}

        <nav className="mt-8">
          <div className="px-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Credit Score</p>
              <p className="text-2xl font-bold text-blue-600">
                {user?.credit_score || 'N/A'}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full"
                  style={{ width: `${((user?.credit_score || 0) / 850) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1 px-2">
            {getMenuItems().map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action ? item.action() : onTabChange(item.id);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors
                    ${activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'}
                  `}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
};
