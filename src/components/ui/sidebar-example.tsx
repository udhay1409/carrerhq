import React from "react";
import { Sidebar, SidebarLink } from "./sidebar";
import { LayoutDashboard, FileText, Tags, Settings } from "lucide-react";

// Example usage of the Sidebar component
export function SidebarExample() {
  const adminLinks: SidebarLink[] = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      isActive: true,
    },
    {
      label: "Blog Posts",
      href: "/admin/blog",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: "Categories",
      href: "/admin/categories",
      icon: <Tags className="w-5 h-5" />,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const handleLinkClick = (href: string) => {
    console.log("Navigating to:", href);
    // In a real app, you would use Next.js router here
    // router.push(href);
  };

  return (
    <div className="h-screen">
      <Sidebar
        links={adminLinks}
        onLinkClick={handleLinkClick}
        className="border-r-2 border-gray-100"
      />
    </div>
  );
}
