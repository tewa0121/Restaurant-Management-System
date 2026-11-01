/**
 * Safe scaffold: creates ONLY the folders/files that are missing.
 *  - never overwrites a file
 *  - never edits routes/index.js, server.js, config/database.js or the database
 *  - skips a file if one with the same meaning exists (authController.js == auth.controller.js)
 *
 * Usage (from the backend folder):
 *   node scripts/scaffold.js            -> DRY RUN: only shows what would be created
 *   node scripts/scaffold.js --write    -> creates the missing files
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const WRITE = process.argv.includes('--write');

const names = (suffix, list) => list.map((n) => `${n}${suffix}.js`);

const MODULES = [
  'auth', 'profile', 'user', 'role', 'restaurant', 'settings', 'menu', 'category', 'modifier',
  'favorite', 'table', 'reservation', 'order', 'kitchen', 'request', 'discount', 'invoice',
  'payment', 'refund', 'cashSession', 'customer', 'address', 'employee', 'attendance', 'shift',
  'review', 'inventory', 'supplier', 'purchaseOrder', 'delivery', 'notification', 'message',
  'feedback', 'log', 'dashboard', 'report', 'upload',
];

const MANIFEST = {
  config: ['constants.js', 'env.js'],
  middleware: ['permissionMiddleware.js', 'validateMiddleware.js', 'uploadMiddleware.js', 'rateLimiter.js', 'activityLogger.js'],
  utils: ['asyncHandler.js', 'jwt.js', 'hash.js', 'codes.js', 'money.js', 'pagination.js', 'dates.js'],
  validators: names('Validator', ['auth', 'user', 'menu', 'table', 'reservation', 'order', 'kitchen', 'payment', 'customer', 'employee', 'inventory', 'supplier', 'delivery']),
  mappers: names('Mapper', ['order', 'table', 'menu', 'user', 'invoice', 'dashboard']),
  models: names('Model', [
    'role', 'restaurant', 'settings', 'category', 'modifier', 'favorite', 'table', 'reservation', 'kitchen',
    'request', 'discount', 'invoice', 'payment', 'refund', 'cashSession', 'customer', 'address', 'employee',
    'attendance', 'shift', 'review', 'inventory', 'supplier', 'purchaseOrder', 'delivery', 'notification',
    'message', 'feedback', 'log', 'dashboard', 'report',
  ]),
  services: names('Service', [
    'user', 'pricing', 'loyalty', 'table', 'reservation', 'kitchen', 'billing', 'cashSession', 'inventory',
    'purchase', 'delivery', 'notification', 'audit', 'customer', 'employee', 'supplier', 'dashboard', 'report',
  ]),
  controllers: names('Controller', MODULES),
  routes: names('Routes', MODULES),
  scripts: ['seedCatalog.js', 'seedDemoOrders.js'],
  'integrations/oauth': ['googleOAuth.js', 'microsoftOAuth.js', 'appleOAuth.js'],
  'integrations/payments': ['telebirr.js', 'cbeBirr.js'],
  'integrations/mail': ['mailer.js'],
  sockets: ['index.js', 'orderSocket.js', 'kitchenSocket.js', 'waiterSocket.js', 'notificationSocket.js'],
  jobs: ['lowStockCheck.js', 'reservationNoShow.js', 'tableCleaningReset.js', 'sessionCleanup.js'],
  tests: ['auth.test.js', 'order.test.js', 'billing.test.js', 'inventory.test.js'],
  'uploads/menu': ['.gitkeep'],
  'uploads/avatars': ['.gitkeep'],
  'uploads/ingredients': ['.gitkeep'],
  'uploads/receipts': ['.gitkeep'],
};

// "authController.js", "auth.controller.js", "AuthController.js" all become "authcontroller"
const normalize = (file) => path.parse(file).name.replace(/[^a-z0-9]/gi, '').toLowerCase();

const stub = (dir, file) => {
  if (file === '.gitkeep') return '';
  if (dir === 'routes') {
    return `const router = require('express').Router();\n\n// TODO: add endpoints, then mount this file in routes/index.js\n\nmodule.exports = router;\n`;
  }
  return `// TODO: implement\nmodule.exports = {};\n`;
};

let created = 0;
let skipped = 0;

for (const [dir, files] of Object.entries(MANIFEST)) {
  const absDir = path.join(ROOT, dir);
  const existing = fs.existsSync(absDir) ? fs.readdirSync(absDir) : [];
  const existingKeys = new Set(existing.map(normalize));

  for (const file of files) {
    const exists = file === '.gitkeep' ? existing.includes(file) : existingKeys.has(normalize(file));
    if (exists) {
      skipped++;
      continue;
    }
    console.log(`${WRITE ? 'CREATE' : 'WOULD CREATE'}  ${dir}/${file}`);
    if (WRITE) {
      fs.mkdirSync(absDir, { recursive: true });
      fs.writeFileSync(path.join(absDir, file), stub(dir, file), { flag: 'wx' }); // 'wx' = fail instead of overwrite
    }
    created++;
  }
}

console.log(`\n${WRITE ? 'Created' : 'Would create'}: ${created}   Already existed (skipped): ${skipped}`);
if (!WRITE) console.log('Dry run only. Run again with --write to create the files.');