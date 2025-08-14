import axios from "axios";
const API_URL = "http://localhost:5000/api";

const getAuthConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const placeOrderFromCart = async () => {
  const { data } = await axios.post(`${API_URL}/orders/from-cart`, {}, getAuthConfig());
  return data;
};

export const getOrders = async () => {
  const { data } = await axios.get(`${API_URL}/orders`, getAuthConfig());
  return data;
};
