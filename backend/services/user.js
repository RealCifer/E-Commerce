import User from "../models/user.js";

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

export const getAllUsers = async () => {
  return await User.find().select("-password");
};

export const deleteUserById = async (id) => {
  return await User.findByIdAndDelete(id);
};
