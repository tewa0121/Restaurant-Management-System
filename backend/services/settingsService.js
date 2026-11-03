const SettingsModel = require('../models/settingsModel');
const RestaurantModel = require('../models/restaurantModel');
const { withTransaction } = require('../utils/transaction');
const { updateById } = require('../utils/sql');
const { logActivity } = require('../utils/activityLog');
const { restaurantId } = require('../config/auth');
const AppError = require('../utils/AppError');

const SETTING_KEYS = {
  currency: 'currency',
  taxRate: 'tax_rate',
  deliveryFee: 'delivery_fee',
  openingTime: 'opening_time',
  closingTime: 'closing_time',
  receiptFooter: 'receipt_footer',
  notificationsEnabled: 'notifications_enabled',
};

const RESTAURANT_KEYS = { restaurantName: 'name', address: 'address', phone: 'phone' };

async function buildSettings() {
  const [restaurant, stored] = await Promise.all([RestaurantModel.get(), SettingsModel.getAll()]);
  const number = (key, fallback) => {
    const parsed = Number(stored[key]);
    return stored[key] === undefined || stored[key] === '' || Number.isNaN(parsed) ? fallback : parsed;
  };

  return {
    restaurantName: restaurant ? restaurant.name : null,
    address: restaurant ? restaurant.address : null,
    phone: restaurant ? restaurant.phone : null,
    currency: stored.currency || 'ETB',
    taxRate: number('tax_rate', 15),
    deliveryFee: number('delivery_fee', 0),
    openingTime: stored.opening_time || null,
    closingTime: stored.closing_time || null,
    receiptFooter: stored.receipt_footer || null,
    notificationsEnabled: stored.notifications_enabled === undefined ? true : stored.notifications_enabled === 'true',
  };
}

const SettingsService = {
  async get() {
    return buildSettings();
  },

  async getPublic() {
    const settings = await buildSettings();
    return {
      restaurantName: settings.restaurantName,
      address: settings.address,
      phone: settings.phone,
      currency: settings.currency,
      taxRate: settings.taxRate,
      deliveryFee: settings.deliveryFee,
      openingTime: settings.openingTime,
      closingTime: settings.closingTime,
    };
  },

  async update(body, actor) {
    const settingFields = Object.keys(SETTING_KEYS).filter((key) => body[key] !== undefined);
    const restaurantFields = Object.keys(RESTAURANT_KEYS).filter((key) => body[key] !== undefined);
    if (!settingFields.length && !restaurantFields.length) throw new AppError('Nothing to update.', 400, 'NOTHING_TO_UPDATE');

    await withTransaction(async (conn) => {
      for (const key of settingFields) await SettingsModel.set(SETTING_KEYS[key], body[key], conn);
      if (restaurantFields.length) {
        const columns = {};
        restaurantFields.forEach((key) => {
          columns[RESTAURANT_KEYS[key]] = body[key];
        });
        await updateById('restaurants', restaurantId, columns, conn);
      }
    });

    logActivity({
      userId: actor.id,
      action: 'Updated restaurant settings',
      activityType: 'settings',
      entityType: 'settings',
      newValue: Object.fromEntries([...settingFields, ...restaurantFields].map((key) => [key, body[key]])),
    });
    return buildSettings();
  },
};

module.exports = SettingsService;