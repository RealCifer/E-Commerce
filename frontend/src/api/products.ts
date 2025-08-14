import axios from "axios";
const API_URL = "http://localhost:5000/api";

export const getProducts = async () => {
  const { data } = await axios.get(`${API_URL}/products`);
  return data;
};

export const getProduct = async (id: string) => {
  const { data } = await axios.get(`${API_URL}/products/${id}`);
  return data;
};
