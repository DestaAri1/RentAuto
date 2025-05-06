import React, { ReactNode } from 'react'

interface HomeProps {
    children: ReactNode;
}

const Main = ({children}: HomeProps) => {
  return <div className="min-h-screen bg-gray-50 font-sans">{children}</div>;
}

export {Main}
