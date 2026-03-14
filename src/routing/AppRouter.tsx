import { Spin } from "antd";
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const Home = lazy(() => import("../features/home/pages/Home"));
const Login = lazy(() => import("../features/auth/pages/login/Login"));
const Register = lazy(() => import("../features/auth/pages/register/Register"));  
const PasswordReset = lazy(() => import("../features/auth/pages/password-reset/PasswordReset"));

const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Suspense fallback={<Spin size="large" fullscreen />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;