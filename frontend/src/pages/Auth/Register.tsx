import React from 'react'
import RegisterForm from '../../components/Auth/Registration/RegistrationForm.tsx';
import AuthLayout from '../../layout/AuthLayout.tsx';
import { AuthFormBox } from '../../components/Auth/Auth.tsx';

export default function Register() {
    return (
    <AuthLayout title="Register">
      <AuthFormBox>
        <RegisterForm />
      </AuthFormBox>
    </AuthLayout>
  );
};
