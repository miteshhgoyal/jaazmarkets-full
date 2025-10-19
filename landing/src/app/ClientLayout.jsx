"use client";

import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // Jaha Navbar/Footer nahi chahiye
  const noLayoutRoutes = ["/login", "/register"];

  const hideLayout = noLayoutRoutes.includes(pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
