"use client";

import { usePathname } from "next/navigation";
import { MainNavbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Check if current route is an admin page
  const isAdminPage = pathname.startsWith("/admin");

  if (isAdminPage) {
    // Admin pages: no header/footer, full height
    return <div className="h-screen overflow-hidden">{children}</div>;
  }

  // Regular pages: with header and footer
  return (
    <>
      <MainNavbar />
      <div className="min-h-screen flex flex-col pt-20">
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
}
