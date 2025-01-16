import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { MainLayout } from "@/layouts/MainLayout";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

export const metadata = {
  title: "Bali Compass",
  description: "It's a simple progressive web application made with NextJS",
  manifest: "/manifest.json",
  icons:{
    icon:'/favicon.png'
  },
  formatDetection: {
    telephone: "no",
  },
  appleWebApp: {
    capable: "yes",
    statusBarStyle: "black-translucent",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  viewportFit: "cover",
  userScalable: false,
  maximumScale: 1,
  "mobile-web-app-capable": "yes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${poppins.className} antialiased overflow-hidden h-screen w-screen`}
      >
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
