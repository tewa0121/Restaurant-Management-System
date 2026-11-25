import http, { getErrorMessage } from './http';

const normalizeAuthError = (err, fallback) => {
  const message = getErrorMessage(err, fallback);
  const wrapped = new Error(message);
  wrapped.status = err?.response?.status;
  wrapped.code = err?.response?.data?.code;
  wrapped.errors = err?.response?.data?.errors;
  wrapped.original = err;
  return wrapped;
};

export async function loginRequest(email, password, remember = true) {
  try {
    const res = await http.post('/auth/login', {
      email: String(email || '').trim().toLowerCase(),
      password,
      remember: Boolean(remember),
    });
    return res.data;
  } catch (err) {
    throw normalizeAuthError(err, 'Login failed. Please check your credentials.');
  }
}

export async function registerRequest({ fullName, email, password, phone }) {
  try {
    const payload = {
      fullName: String(fullName || '').trim(),
      email: String(email || '').trim().toLowerCase(),
      password,
    };
    if (phone && String(phone).trim()) {
      payload.phone = String(phone).trim();
    }
    const res = await http.post('/auth/register', payload);
    return res.data;
  } catch (err) {
    throw normalizeAuthError(err, 'Registration failed. Please check your details.');
  }
}

export async function fetchMe() {
  try {
    const res = await http.get('/auth/me');
    return res.data?.user || res.data;
  } catch (err) {
    throw normalizeAuthError(err, 'Failed to load user profile.');
  }
}

export async function updateProfileRequest(profileData) {
  try {
    const res = await http.put('/auth/profile', profileData);
    return res.data;
  } catch (err) {
    throw normalizeAuthError(err, 'Failed to update profile.');
  }
}

export async function changePasswordRequest(currentPassword, newPassword) {
  try {
    const res = await http.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return res.data;
  } catch (err) {
    throw normalizeAuthError(err, 'Failed to change password.');
  }
}

export async function logoutRequest() {
  try {
    const res = await http.post('/auth/logout');
    return res.data;
  } catch {
    return { success: true };
  }
}

export async function forgotPasswordRequest(email) {
  try {
    const res = await http.post('/auth/forgot-password', {
      email: String(email || '').trim().toLowerCase(),
    });
    return res.data;
  } catch (err) {
    throw normalizeAuthError(err, 'Failed to send password reset request.');
  }
}

export async function resetPasswordRequest(token, password) {
  try {
    const res = await http.post('/auth/reset-password', {
      token: String(token || '').trim(),
      password,
    });
    return res.data;
  } catch (err) {
    throw normalizeAuthError(err, 'Failed to reset password.');
  }
}

const authService = {
  login: loginRequest,
  loginRequest,
  register: registerRequest,
  registerRequest,
  me: fetchMe,
  fetchMe,
  getProfile: fetchMe,
  updateProfile: updateProfileRequest,
  updateProfileRequest,
  changePassword: changePasswordRequest,
  changePasswordRequest,
  logout: logoutRequest,
  logoutRequest,
  forgotPassword: forgotPasswordRequest,
  forgotPasswordRequest,
  resetPassword: resetPasswordRequest,
  resetPasswordRequest,
};

export default authService;