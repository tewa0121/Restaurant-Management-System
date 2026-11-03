const fs = require('fs');
const path = require('path');
const express = require('express');

const router = express.Router();

const toKebab = (value) => value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

router.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok', time: new Date().toISOString() });
});

fs.readdirSync(__dirname)
  .filter((file) => file.endsWith('Routes.js'))
  .sort()
  .forEach((file) => {
    const name = file.slice(0, -'Routes.js'.length);
    const mounted = require(path.join(__dirname, file));

    if (typeof mounted !== 'function') {
      throw new Error(
        `routes/${file} does not export an Express router. Make sure the file ends with "module.exports = router;" or delete it if it is an old file.`
      );
    }

    router.use(`/${toKebab(name)}`, mounted);
  });

module.exports = router;