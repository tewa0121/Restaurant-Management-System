const ok = (res, data, extra = {}, status = 200) => res.status(status).json({ success: true, data, ...extra });

const list = (res, data, pagination) => res.status(200).json({ success: true, data, pagination });

module.exports = { ok, list };