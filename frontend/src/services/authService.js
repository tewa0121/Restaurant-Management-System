import { http } from "./http";

export const authService = {
  login: (email, password) =>
    http("/auth/login", { method: "POST", body: { email, password } }),

  register: ({ fullName, email, phone, password }) =>
    http("/auth/register", {
      method: "POST",
      body: { fullName, email, phone, password },
    }),

  me: () => http("/auth/me"),
};

export default authService;