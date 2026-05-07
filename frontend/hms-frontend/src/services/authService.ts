import api from "./api";

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth-service/auth/login", { email, password });
  return res.data; // expect { token: "..." }
};

export const registerUser = async (payload: { name: string; email: string; password: string; role: string }) => {
  const res = await api.post("/auth-service/auth/register", payload);
  return res.data;
};

export const getUsersByRole = async (role: string) => {
  const res = await api.get(`/auth-service/auth/users/by-role?role=${role}`);
  return res.data;
};