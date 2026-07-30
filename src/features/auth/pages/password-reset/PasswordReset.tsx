import React from "react";
import AuthLayout from "../../../../shared/components/auth-layout/AuthLayout";
import PasswordResetForm from "../../components/password-reset-form/PasswordResetForm";

const PasswordReset: React.FC = () => (
  <AuthLayout>
    <PasswordResetForm />
  </AuthLayout>
);

export default PasswordReset;
