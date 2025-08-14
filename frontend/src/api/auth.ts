import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const signup = async (name: string, email: string, password: string, role: string = "user") => {
  const { data } = await axios.post(`${API_URL}/auth/signup`, { name, email, password, role });
  return data;
};

export const login = async (email: string, password: string) => {
  const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
  return data;
};
