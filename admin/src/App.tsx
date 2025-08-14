// src/App.tsx or src/index.tsx (where your routes are defined)

import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/products";

import { AdminRoute } from "./components/private";
import AdminSignup from "./pages/Signup";
import AdminLogin from "./pages/login";
import { AuthProvider } from "./context/auth";
import AdminOrdersPage from "./pages/orders";
import AdminUsersPage from "./pages/users";
import AdminLayout from "./components/layout.tsx/layout";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />

          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<div>Admin Dashboard Home</div>} />
            <Route path="dashboard" element={<div>Admin Dashboard Home</div>} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
         <Route path="users" element={<AdminUsersPage/>} />
          </Route>

          {/* Your public routes */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
