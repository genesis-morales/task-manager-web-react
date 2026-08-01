import React from "react";
import AuthLayout from "../../../../shared/components/auth-layout/AuthLayout";
import RegisterForm from "../../components/register-form/RegisterForm";

const Register: React.FC = () => (
  <AuthLayout>
    <RegisterForm />
  </AuthLayout>
);

export default Register;
