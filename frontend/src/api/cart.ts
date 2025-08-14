import axios from "axios";
const API_URL = "http://localhost:5000/api";

const getAuthConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const getCart = async () => {
  const { data } = await axios.get(`${API_URL}/cart`, getAuthConfig());
  return data;
};

export const addToCart = async (productId: string, quantity: number, size: string, color: string) => {
  const { data } = await axios.post(`${API_URL}/cart/add`, { productId, quantity, size, color }, getAuthConfig());
  return data;
};

export const removeFromCart = async (productId: string) => {
  const { data } = await axios.delete(`${API_URL}/cart/remove/${productId}`, getAuthConfig());
  return data;
};

export const updateCartItem = async (productId: string, quantity: number) => {
  const { data } = await axios.put(`${API_URL}/cart/update`, { productId, quantity }, getAuthConfig());
  return data;
};
