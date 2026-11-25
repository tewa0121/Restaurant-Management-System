import http from './http';

export async function loginRequest(email, password, remember = true) {
  const res = await http.post('/auth/login', { email: email.trim(), password, remember });
  return res.data; // { success, token, expiresIn, user }
}

export async function registerRequest({ fullName, email, password, phone }) {
  const res = await http.post('/auth/register', { fullName, email, password, phone });
  return res.data;
}

export async function fetchMe() {
  const res = await http.get('/auth/me');
  return res.data.user;
}

export async function logoutRequest() {
  try { await http.post('/auth/logout'); } catch (e) { /* ignore */ }
}

export async function forgotPasswordRequest(email) {
  const res = await http.post('/auth/forgot-password', { email: email.trim() });
  return res.data; // { success, message, resetToken? (dev only) }
}

export async function resetPasswordRequest(token, password) {
  const res = await http.post('/auth/reset-password', { token, password });
  return res.data;
}

// Default export so `import authService from '.../authService'` also works.
const authService = {
  login: loginRequest,
  loginRequest,
  register: registerRequest,
  registerRequest,
  me: fetchMe,
  fetchMe,
  getProfile: fetchMe,
  logout: logoutRequest,
  logoutRequest,
  forgotPassword: forgotPasswordRequest,
  forgotPasswordRequest,
  resetPassword: resetPasswordRequest,
  resetPasswordRequest,
};

export default authService;