import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { ToastProvider } from "@heroui/toast";
import { ConditionalLayout } from "@/components/conditional-layout";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Career HQ - Study Abroad Platform",
    template: "%s | Career HQ",
  },
  description:
    "Find the perfect university and course for your international education journey. Explore programs in Australia, Canada, UK, USA, Germany, Ireland, France, and New Zealand.",
  keywords: [
    "study abroad",
    "international education",
    "universities",
    "courses",
    "student visa",
    "education consultancy",
    "overseas education",
  ],
  authors: [{ name: "Career HQ" }],
  creator: "Career HQ",
  publisher: "Career HQ",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://career-hq.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://career-hq.com",
    title: "Career HQ - Study Abroad Platform",
    description:
      "Find the perfect university and course for your international education journey",
    siteName: "Career HQ",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Career HQ - Study Abroad Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career HQ - Study Abroad Platform",
    description:
      "Find the perfect university and course for your international education journey",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="font-sans antialiased">
        <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
        <ToastProvider
          placement="top-right"
          maxVisibleToasts={5}
          toastProps={{
            timeout: 5000,
            classNames: {
              base: "rounded-lg",
            },
          }}
        />
      </body>
    </html>
  );
}

// Component to conditionally render header/footer based on route
function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <ConditionalLayout>{children}</ConditionalLayout>;
}
