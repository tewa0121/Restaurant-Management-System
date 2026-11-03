const paginationQuery = {
  page: { type: 'integer', min: 1, default: 1 },
  limit: { type: 'integer', min: 1, max: 200, default: 50 },
};

const toOffset = (page, limit) => (page - 1) * limit;

const pageMeta = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});

module.exports = { paginationQuery, toOffset, pageMeta };