// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Users & Roles
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.put('/users/:userId/status', adminController.updateUserStatus);
router.delete('/users/:userId', adminController.deleteUser);

// Restaurants
router.get('/restaurants', adminController.getRestaurants);
router.put('/restaurants/:id', adminController.updateRestaurant);

// Menu Management
router.get('/menu', adminController.getAdminMenu);
router.post('/menu', adminController.createMenuItem);
router.put('/menu/:id', adminController.updateMenuItem);
router.delete('/menu/:id', adminController.deleteMenuItem);

// Tables
router.get('/tables', adminController.getAdminTables);
router.post('/tables', adminController.createTable);
router.put('/tables/:id/status', adminController.updateTableStatus);

// Orders
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:orderId/status', adminController.updateOrderStatus);

// Reservations
router.get('/reservations', adminController.getAdminReservations);
router.put('/reservations/:id/status', adminController.updateReservationStatus);

// Customers
router.get('/customers', adminController.getCustomers);

// Employees
router.get('/employees', adminController.getEmployees);
router.post('/employees', adminController.createEmployee);

// Inventory
router.get('/inventory', adminController.getAdminInventory);
router.put('/inventory/:itemId', adminController.updateInventoryStock);

// Suppliers
router.get('/suppliers', adminController.getSuppliers);

// Delivery
router.get('/delivery', adminController.getDeliveries);

// Payments
router.get('/payments', adminController.getPayments);

// Reports
router.get('/reports', adminController.getReports);

// Logs
router.get('/logs', adminController.getSystemLogs);

// Settings
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

module.exports = router;