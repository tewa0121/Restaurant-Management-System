import { useAuth } from '../context/AuthContext';

export function useRole() {
  const { user } = useAuth();
  const userRole = String(user?.role || '').toLowerCase();

  return {
    isAdmin: userRole.includes('admin') || userRole.includes('super'),
    isManager: userRole.includes('manager'),
    isCashier: userRole.includes('cashier'),
    isKitchen: userRole.includes('kitchen'),
    isWaiter: userRole.includes('waiter'),
    isCustomer: userRole.includes('customer') || !userRole,
    role: user?.role || 'Customer'
  };
}