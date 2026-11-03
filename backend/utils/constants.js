const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  WAITER: 'Waiter',
  CASHIER: 'Cashier',
  KITCHEN: 'Kitchen',
  CUSTOMER: 'Customer',
};

const ROLE_PRIORITY = ['admin', 'manager', 'cashier', 'kitchen', 'waiter', 'customer'];

const getPrimaryRoleKey = (roleNames = []) => {
  const keys = roleNames.map((name) => String(name).toLowerCase());
  return ROLE_PRIORITY.find((key) => keys.includes(key)) || keys[0] || 'customer';
};

const STAFF_ROLES = [ROLES.ADMIN, ROLES.MANAGER, ROLES.WAITER, ROLES.CASHIER, ROLES.KITCHEN];

const ORDER_TYPES = ['dine_in', 'takeaway', 'delivery', 'online'];
const ORDER_STATUSES = ['pending', 'preparing', 'ready', 'served', 'completed', 'cancelled'];
const ITEM_STATUSES = ['pending', 'preparing', 'ready'];
const TABLE_STATUSES = ['available', 'reserved', 'occupied', 'cleaning', 'out_of_order'];
const TABLE_SHAPES = ['square', 'round', 'rectangle'];
const RESERVATION_STATUSES = ['pending', 'confirmed', 'seated', 'cancelled', 'no_show'];
const REQUEST_STATUSES = ['new', 'in_progress', 'done'];
const INVOICE_STATUSES = ['unpaid', 'held', 'partially_paid', 'paid', 'refunded'];
const PAYMENT_METHODS = ['cash', 'card', 'mobile_banking', 'telebirr', 'cbe_birr', 'paypal', 'apple_pay', 'other'];
const PAYMENT_STATUSES = ['pending', 'completed', 'failed', 'refunded'];
const REFUND_STATUSES = ['pending', 'approved', 'rejected'];
const DELIVERY_STATUSES = ['assigned', 'picked_up', 'on_the_way', 'delivered', 'failed'];
const PURCHASE_ORDER_STATUSES = ['draft', 'sent', 'received', 'cancelled'];
const MOVEMENT_TYPES = ['purchase', 'usage', 'adjustment', 'return'];
const NOTIFICATION_TYPES = ['order', 'reservation', 'inventory', 'payment', 'system'];
const DISCOUNT_TYPES = ['percentage', 'fixed_amount'];
const ATTENDANCE_STATUSES = ['present', 'absent', 'late', 'half_day'];
const SHIFT_ROLES = ['waiter', 'cashier', 'kitchen', 'manager'];

module.exports = {
  ROLES,
  ROLE_PRIORITY,
  STAFF_ROLES,
  getPrimaryRoleKey,
  ORDER_TYPES,
  ORDER_STATUSES,
  ITEM_STATUSES,
  TABLE_STATUSES,
  TABLE_SHAPES,
  RESERVATION_STATUSES,
  REQUEST_STATUSES,
  INVOICE_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  REFUND_STATUSES,
  DELIVERY_STATUSES,
  PURCHASE_ORDER_STATUSES,
  MOVEMENT_TYPES,
  NOTIFICATION_TYPES,
  DISCOUNT_TYPES,
  ATTENDANCE_STATUSES,
  SHIFT_ROLES,
};