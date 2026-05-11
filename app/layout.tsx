import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "Evently",
  description: "Cria e descobre eventos perto de ti.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-900 text-light">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
