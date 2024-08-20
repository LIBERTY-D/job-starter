
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UserProvider } from "@/context/usercontext/UserContext";






const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Job Starter",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
  
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  return (
    <html lang="en">
   
      <body className={inter.className}>
      <UserProvider>
       <Header/>
       {children}
       <Footer/>
       </UserProvider>
      </body>
    </html>
  );
}
