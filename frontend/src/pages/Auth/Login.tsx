import React from "react";
import {
  AuthAnother,
  AuthFormBox,
  AuthGoogle,
  AuthMain,
  AuthTitle,
} from "../../components/Auth/Auth.tsx";
import LoginForm from "../../components/Auth/Login/LoginForm.tsx";
import { Helmet } from "react-helmet-async";

const Login: React.FC = () => {
  return (
    <AuthMain>
      <Helmet>
        <title>Login - RentAuto</title>
      </Helmet>
      <AuthTitle />
      <AuthFormBox>
        <LoginForm />
        <AuthAnother>
          <AuthGoogle />
        </AuthAnother>
      </AuthFormBox>
    </AuthMain>
  );
};

export default Login;
