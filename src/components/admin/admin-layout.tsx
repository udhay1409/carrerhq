"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar, SidebarLink } from "@/components/ui/sidebar";
import { FileText, GraduationCap } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Define sidebar links with proper routing and active states
  const sidebarLinks: SidebarLink[] = [
    {
      label: "Education",
      href: "/admin/education",
      icon: <GraduationCap className="w-5 h-5" />,
      isActive: pathname.startsWith("/admin/education"),
    },
    {
      label: "Blog Posts",
      href: "/admin/blog",
      icon: <FileText className="w-5 h-5" />,
      isActive: pathname.startsWith("/admin/blog"),
    },
    {
      label: "Lead Management",
      href: "/admin/leads",
      icon: <FileText className="w-5 h-5" />,
      isActive: pathname.startsWith("/admin/leads"),
    },
  ];

  // Handle navigation
  const handleLinkClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        links={sidebarLinks}
        onLinkClick={handleLinkClick}
        className="flex-shrink-0"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
