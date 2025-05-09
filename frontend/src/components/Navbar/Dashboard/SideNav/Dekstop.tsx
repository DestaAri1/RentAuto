import React, { JSX } from "react";
import { NavItemProps } from "../../../../types";
import NavItem from "./NavItem.tsx";

export default function Dekstop({ navItem }: NavItemProps): JSX.Element {
  return (
    <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
      <NavItem navItem={navItem}/>
    </nav>
  );
}
