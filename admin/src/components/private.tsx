// src/components/PrivateRoute.tsx
import { AuthContext } from "@/context/auth";
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";


export const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);

  if (!auth?.user) {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
};

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);

  if (!auth?.user || auth.user.role !== "admin") {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
};
