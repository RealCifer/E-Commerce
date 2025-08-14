import axios from "axios";

const API_URL = "http://localhost:5000/api/wishlist";

export const getWishlist = async (token: string) => {
  const { data } = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export const addToWishlist = async (productId: string, token: string) => {
  const { data } = await axios.post(`${API_URL}/add/${productId}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export const removeFromWishlist = async (productId: string, token: string) => {
  const { data } = await axios.delete(`${API_URL}/remove/${productId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};
