import React from "react";
import "../styles/Footer.css"

const Footer = () => {
  return (
    <footer className=" w-full bg-dark text-light text-center p-4">
      <p>© {new Date().getFullYear()} GameZone. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
