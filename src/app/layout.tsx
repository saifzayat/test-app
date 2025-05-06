import { Inter, Calistoga } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { Metadata } from "next";
import Loading from "./loading/loading";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const calistoga = Calistoga({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
});

export const metadata: Metadata = {
  title: "SZ Web",
  description: "Welcome to SZ Web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="./favicon.png" />
        <title>SZ Web</title>
        <meta name="description" content="Welcome to SZ Web" />
      </head>
      <body className={`${inter.variable} ${calistoga.variable} antialiased`}>
        <Loading>
          <Header />
          {children}
        </Loading>
      </body>
    </html>
  );
}
