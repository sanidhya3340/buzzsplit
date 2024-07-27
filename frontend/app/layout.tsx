import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Authenticate from "@/containers/Authenticate/authenticate";
import Header from "@/components/header";
import FloatingActionButton from "@/components/floation-action-button";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Buzzsplit",
  description: "A app to split your transactions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <Authenticate> <Header/>{children}
      {/* <FloatingActionButton /> */}
        
        </Authenticate>
      </body>
    </html>
  );
}
