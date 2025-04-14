import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header/Header";
import { UserProvider } from "@/providers/UserProvider/UserProvider";
import { fetchUser } from "@/actions/userActions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crypto Trading App",
  description: "A crypto trading app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await fetchUser();

  return (
    <html lang="en">
      <UserProvider initialUser={user}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div id="modal-root"></div>
          <Header />
          <main className="mt-16">{children}</main>
        </body>
      </UserProvider>
    </html>
  );
}
