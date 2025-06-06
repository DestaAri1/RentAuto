import React, { ReactNode } from "react";
import { Main } from "../components/HomeComponents.tsx";
import Navbar from "../components/Navbar/Home/Navbar.tsx";
import Footer from "../components/Footer/Home/Footer.tsx";
import { Helmet } from "react-helmet-async";
import useValidateCarParent from "../hooks/useValidateCarParent.tsx";

interface HomeLayoutProps {
  title: string;
  children: ReactNode;
}

export default function HomeLayout({ children, title }: HomeLayoutProps) {
    useValidateCarParent();
  return (
    <Main>
      <Helmet>
        <title>{title} - RentAuto</title>
      </Helmet>
      <Navbar />
      {children}
      <Footer />
    </Main>
  );
}
