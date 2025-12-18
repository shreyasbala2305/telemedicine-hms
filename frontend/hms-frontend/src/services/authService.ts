import api from "./api";

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data; // expect { token: "..." }
};

export const registerUser = async (payload: { name: string; email: string; password: string; role: string }) => {
  const res = await api.post("/auth/register", payload);
  return res.data;
};
