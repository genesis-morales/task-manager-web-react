import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Spin } from "antd";

const Home = lazy(() => import("../features/auth/pages/home/Home"));
//const Login = lazy(() => import("../pages/Login/Login"));
//const Register = lazy(() => import("../pages/Register/Register"));
//const PasswordReset = lazy(() => import("../pages/PasswordReset/PasswordReset"));
//const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));

const LoadingFallback: React.FC = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <Spin size="large" />
  </div>
);

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;