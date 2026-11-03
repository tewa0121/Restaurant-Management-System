
const DeliveryModel = require('../models/deliveryModel');
const OrderModel = require('../models/orderModel');
const EmployeeModel = require('../models/employeeModel');
const CustomerModel = require('../models/customerModel');
const AppError = require('../utils/AppError');
const { withTransaction } = require('../utils/transaction');
const { logActivity } = require('../utils/activityLog');
const { notifyUsers, notifyRoles } = require('../utils/notify');
const { toOffset, pageMeta } = require('../utils/pagination');
const { normalizeEnum } = require('../utils/enums');
const { hasRole } = require('../middleware/roleMiddleware');
const { ROLES, STAFF_ROLES, DELIVERY_STATUSES } = require('../utils/constants');

const isStaff = (user) => hasRole(user, STAFF_ROLES);

const UI_STATUS = {
  unassigned: 'Unassigned',
  assigned: 'Assigned',
  picked_up: 'Picked Up',
  on_the_way: 'In Transit',
  delivered: 'Delivered',
  failed: 'Failed',
};

const TRANSITIONS = {
  assigned: ['picked_up', 'failed'],
  picked_up: ['on_the_way', 'delivered', 'failed'],
  on_the_way: ['delivered', 'failed'],
  delivered: [],
  failed: [],
};

const cleanName = (value) =>
  value && value.trim() ? value.trim() : null;

function statusOf(row) {
  if (row.tracking_status) return row.tracking_status;
  return row.assigned_driver_id ? 'assigned' : 'unassigned';
}

function toDto(row, tracking) {
  const status = statusOf(row);
  const driverName = cleanName(row.driver_name);
  const customerName = cleanName(row.customer_name);

  const dto = {
    id: row.order_id,
    delivery_id: `DEL-${String(row.order_id).padStart(4, '0')}`,
    deliveryId: `DEL-${String(row.order_id).padStart(4, '0')}`,
    order_id: row.order_id,
    orderId: row.order_id,
    order_number: row.order_number,
    orderNumber: row.order_number,
    order_status: row.order_status,
    customer_id: row.customer_id,
    customer_name: customerName,
    customer: customerName,
    customer_phone: row.customer_phone,
    address: row.delivery_address,
    delivery_address: row.delivery_address,
    phone: row.delivery_contact_phone,
    delivery_contact_phone: row.delivery_contact_phone,
    instructions: row.delivery_instructions,
    driver_id: row.assigned_driver_id,
    driverId: row.assigned_driver_id,
    driver_name: driverName,
    driver: driverName,
    driver_phone: row.driver_phone,
    estimated_time: row.estimated_time,
    estimatedTime: row.estimated_time,
    delivered_at: row.actual_delivered_at || null,
    deliveredAt: row.actual_delivered_at || null,
    delivery_fee: Number(row.delivery_fee),
    deliveryFee: Number(row.delivery_fee),
    total: Number(row.total_amount),
    status,
    statusLabel: UI_STATUS[status],
    updated_at: row.tracking_updated_at || row.ordered_at,
    ordered_at: row.ordered_at,
  };

  if (tracking) {
    dto.tracking = tracking.map((entry) => ({
      id: entry.id,
      status: entry.status,
      statusLabel: UI_STATUS[entry.status],
      lat: entry.location_lat === null
        ? null
        : Number(entry.location_lat),
      lng: entry.location_lng === null
        ? null
        : Number(entry.location_lng),
      at: entry.updated_at,
    }));
  }

  return dto;
}

const requireDelivery = async (orderId) => {
  const row = await DeliveryModel.findByOrder(orderId);

  if (!row) {
    throw new AppError(
      'Delivery not found.',
      404,
      'DELIVERY_NOT_FOUND'
    );
  }

  return row;
};

const DeliveryService = {
  async list({ status, driverId, date, search, page, limit }) {
    const filters = {
      status: status
        ? (
            status.toLowerCase() === 'unassigned'
              ? 'unassigned'
              : normalizeEnum(status, DELIVERY_STATUSES, 'Status')
          )
        : undefined,
      driverId,
      date,
      search,
    };

    const { rows, total } = await DeliveryModel.list(
      filters,
      {
        limit,
        offset: toOffset(page, limit),
      }
    );

    return {
      rows: rows.map((row) => toDto(row)),
      pagination: pageMeta(page, limit, total),
    };
  },

  async drivers() {
    const rows = await DeliveryModel.drivers();

    return rows.map((row) => ({
      id: row.id,
      employee_code: row.employee_code,
      name: cleanName(row.name),
      phone: row.phone,
      position: row.position,
      activeDeliveries: Number(row.active_deliveries),
      available: Number(row.active_deliveries) === 0,
    }));
  },

  async get(orderId, user) {
    const row = await requireDelivery(orderId);

    if (!isStaff(user)) {
      const customer = await CustomerModel.findByUserId(user.id);

      if (!customer || row.customer_id !== customer.id) {
        throw new AppError(
          'Delivery not found.',
          404,
          'DELIVERY_NOT_FOUND'
        );
      }
    }

    const tracking = await DeliveryModel.tracking(orderId);

    return toDto(row, tracking);
  },

  // PERMANENT DRIVER ASSIGNMENT VALIDATION
  async assign(orderId, { driverId, estimatedTime }, actor) {
    const row = await requireDelivery(orderId);

    if (['completed', 'cancelled'].includes(row.order_status)) {
      throw new AppError(
        `This order is ${row.order_status}.`,
        409,
        'INVALID_STATE'
      );
    }

    if (['delivered', 'failed'].includes(statusOf(row))) {
      throw new AppError(
        'This delivery is already finished.',
        409,
        'INVALID_STATE'
      );
    }

    // Validate driver ID.
    const id = Number(driverId);

    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(
        'A valid driver ID is required.',
        422,
        'INVALID_DRIVER'
      );
    }

    // Find employee.
    const driver = await EmployeeModel.findById(id);

    if (!driver || !driver.is_active) {
      throw new AppError(
        'Driver not found or inactive.',
        422,
        'EMPLOYEE_NOT_FOUND'
      );
    }

    // Verify driver position.
    const position = String(driver.position || '').toLowerCase();

    const isDeliveryDriver = [
      'driver',
      'delivery',
      'rider',
    ].some((word) => position.includes(word));

    if (!isDeliveryDriver) {
      throw new AppError(
        'This employee is not registered as a delivery driver.',
        422,
        'INVALID_DRIVER_ROLE'
      );
    }

    // Verify restaurant ownership when available.
    if (
      driver.restaurant_id !== undefined &&
      row.restaurant_id !== undefined &&
      Number(driver.restaurant_id) !== Number(row.restaurant_id)
    ) {
      throw new AppError(
        'Driver belongs to another restaurant.',
        403,
        'INVALID_DRIVER'
      );
    }

    // Avoid assigning a driver already handling another delivery.
    const availableDrivers = await DeliveryModel.drivers();

    const selectedDriver = availableDrivers.find(
      (item) => Number(item.id) === id
    );

    if (!selectedDriver) {
      throw new AppError(
        'This employee is not an eligible delivery driver.',
        422,
        'INVALID_DRIVER'
      );
    }

    if (
      Number(selectedDriver.active_deliveries) > 0 &&
      Number(row.assigned_driver_id) !== id
    ) {
      throw new AppError(
        'This driver already has an active delivery.',
        409,
        'DRIVER_BUSY'
      );
    }

    await withTransaction(async (conn) => {
      await DeliveryModel.assign(
        orderId,
        id,
        estimatedTime,
        conn
      );

      await DeliveryModel.insertTracking(
        {
          orderId,
          status: 'assigned',
        },
        conn
      );
    });

    logActivity({
      userId: actor.id,
      action: `Assigned driver ${driver.first_name} ${driver.last_name} to delivery of ${row.order_number}`,
      activityType: 'delivery',
      entityType: 'delivery',
      entityId: orderId,
    });

    return DeliveryService.get(orderId, actor);
  },

  async updateStatus(orderId, body, actor) {
    const row = await requireDelivery(orderId);

    const next = normalizeEnum(
      body.status,
      DELIVERY_STATUSES,
      'Status'
    );

    const current = statusOf(row);

    if (current === 'unassigned') {
      throw new AppError(
        'Assign a driver before updating the delivery.',
        409,
        'NO_DRIVER'
      );
    }

    if (!TRANSITIONS[current]) {
      throw new AppError(
        'Invalid current delivery status.',
        409,
        'INVALID_STATE'
      );
    }

    if (!TRANSITIONS[current].includes(next)) {
      throw new AppError(
        `A delivery that is ${current.replace('_', ' ')} cannot become ${next.replace('_', ' ')}.`,
        409,
        'INVALID_TRANSITION'
      );
    }

    if (
      next === 'picked_up' &&
      !['ready', 'served', 'completed'].includes(row.order_status)
    ) {
      throw new AppError(
        'The order is not ready for pickup yet.',
        409,
        'ORDER_NOT_READY'
      );
    }

    await withTransaction(async (conn) => {
      await DeliveryModel.insertTracking(
        {
          orderId,
          status: next,
          lat: body.lat,
          lng: body.lng,
        },
        conn
      );

      if (next === 'delivered') {
        await DeliveryModel.markDelivered(orderId, conn);

        if (row.order_status === 'ready') {
          await OrderModel.setStatus(
            orderId,
            'served',
            conn
          );
        }
      }
    });

    const messages = {
      picked_up: `Your order ${row.order_number} has been picked up by the driver.`,
      on_the_way: `Your order ${row.order_number} is on its way.`,
      delivered: `Your order ${row.order_number} has been delivered. Enjoy your meal!`,
    };

    if (messages[next] && row.customer_user_id) {
      await notifyUsers(
        [row.customer_user_id],
        {
          title: 'Delivery update',
          message: messages[next],
          type: 'order',
        }
      );
    }

    if (next === 'failed') {
      await notifyRoles(
        [ROLES.MANAGER],
        {
          title: 'Delivery failed',
          message: `Delivery of order ${row.order_number} failed.`,
          type: 'order',
        }
      );
    }

    logActivity({
      userId: actor.id,
      action: `Delivery of ${row.order_number} marked ${next}`,
      activityType: 'delivery',
      entityType: 'delivery',
      entityId: orderId,
      oldValue: { status: current },
      newValue: { status: next },
    });

    return DeliveryService.get(orderId, actor);
  },
};

module.exports = DeliveryService;
