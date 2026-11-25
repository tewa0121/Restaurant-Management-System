const BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).replace(/\/$/, '');

export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';

const AUTH_ERROR_CODES = ['TOKEN_EXPIRED', 'SESSION_REVOKED', 'INVALID_TOKEN', 'NO_TOKEN'];

export class ApiError extends Error {
  constructor(message, status = 0, code = null, errors = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

const readStorage = (key) => {
  try {
    return localStorage.getItem(key) ?? sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

export const getToken = () => readStorage(TOKEN_KEY);

export const getStoredUser = () => {
  try {
    return JSON.parse(readStorage(USER_KEY) || 'null');
  } catch {
    return null;
  }
};

export const saveSession = (token, user, remember = true) => {
  clearSession();
  const store = remember ? localStorage : sessionStorage;
  if (token) store.setItem(TOKEN_KEY, token);
  if (user !== undefined && user !== null) {
    store.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const updateStoredUser = (user) => {
  const hasLocalToken = Boolean(localStorage.getItem(TOKEN_KEY) || localStorage.getItem(USER_KEY));
  const store = hasLocalToken ? localStorage : sessionStorage;
  store.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  [localStorage, sessionStorage].forEach((store) => {
    try {
      store.removeItem(TOKEN_KEY);
      store.removeItem(USER_KEY);
    } catch {
      // ignore storage errors
    }
  });
};

const buildUrl = (path, params) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${BASE_URL}${cleanPath}`);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
};

async function request(method, path, { params, body, auth = true, raw = false } = {}) {
  const headers = {};
  const token = getToken();
  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    credentials: 'include',
  };

  if (body !== undefined) {
    if (body instanceof FormData) {
      options.body = body;
    } else {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
  }

  let response;
  try {
    response = await fetch(buildUrl(path, params), options);
  } catch {
    throw new ApiError(
      'Cannot reach the server. Please check that the backend is running.',
      0,
      'NETWORK_ERROR'
    );
  }

  if (raw && response.ok) {
    return response;
  }

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message =
      (payload && payload.message) ||
      (Array.isArray(payload?.errors) && payload.errors[0]?.message) ||
      `Request failed (${response.status})`;
    const error = new ApiError(
      message,
      response.status,
      payload && payload.code,
      payload && payload.errors
    );
    if (auth && response.status === 401 && AUTH_ERROR_CODES.includes(error.code)) {
      clearSession();
      window.dispatchEvent(new Event('auth:expired'));
    }
    throw error;
  }

  return payload;
}

async function download(path, params, filename) {
  const response = await request('GET', path, { params, raw: true });
  const blob = await response.blob();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename || 'download';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

export const api = {
  get: (path, params, options) => request('GET', path, { params, ...options }),
  post: (path, body, options) =>
    request('POST', path, { body: body === undefined ? {} : body, ...options }),
  put: (path, body, options) =>
    request('PUT', path, { body: body === undefined ? {} : body, ...options }),
  patch: (path, body, options) =>
    request('PATCH', path, { body: body === undefined ? {} : body, ...options }),
  delete: (path, options) => request('DELETE', path, options),
  download,
};

export default api;