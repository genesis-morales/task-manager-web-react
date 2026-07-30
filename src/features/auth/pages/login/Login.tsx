import React from "react";
import AuthLayout from "../../../../shared/components/auth-layout/AuthLayout";
import LoginForm from "../../components/login-form/LoginForm";

const Login: React.FC = () => (
  <AuthLayout>
    <LoginForm />
  </AuthLayout>
);

export default Login;
