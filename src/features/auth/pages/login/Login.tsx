import React from "react";
import AppNavbar from "../../../../shared/components/nav-bar/HomeNavbar";
import AppFooter from "../../../../shared/components/footer/AppFooter";
import LoginForm from "../../pages/login/components/LoginForm";
import "./Login.scss";

const Login: React.FC = () => (
  <div className="login">
    <AppNavbar />
    <main className="login__main">
      <LoginForm />
    </main>
    <AppFooter />
  </div>
);

export default Login;
