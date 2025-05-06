import React, { ReactNode } from 'react'
import { AuthMain, AuthTitle } from '../components/Auth/Auth.tsx'
import { Helmet } from 'react-helmet-async';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
}

export default function AuthLayout({children, title}: AuthLayoutProps) {
  return (
    <AuthMain>
      <Helmet>
        <title>{title} - RentAuto</title>
      </Helmet>
      <AuthTitle />
      {children}
    </AuthMain>
  );
}
