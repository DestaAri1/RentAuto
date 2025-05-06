import React from "react";
import {
  AuthAnother,
  AuthFormBox,
  AuthGoogle,
} from "../../components/Auth/Auth.tsx";
import LoginForm from "../../components/Auth/Login/LoginForm.tsx";
import AuthLayout from "../../layout/AuthLayout.tsx";

const Login: React.FC = () => {
  return (
    <AuthLayout title="Login">
      <AuthFormBox>
        <LoginForm />
        <AuthAnother>
          <AuthGoogle />
        </AuthAnother>
      </AuthFormBox>
    </AuthLayout>
  );
};

export default Login;
