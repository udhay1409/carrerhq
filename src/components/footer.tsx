import React from "react";
import Link from "next/link";
import { Link as HeroLink } from "@heroui/link";
import { Divider } from "@heroui/divider";
import { Icon } from "@iconify/react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Study Abroad",
      links: [
        { name: "United States", path: "/study-abroad/usa" },
        { name: "United Kingdom", path: "/study-abroad/uk" },
        { name: "Canada", path: "/study-abroad/canada" },
        { name: "Australia", path: "/study-abroad/australia" },
        { name: "Germany", path: "/study-abroad/germany" },
        { name: "Ireland", path: "/study-abroad/ireland" },
        { name: "France", path: "/study-abroad/france" },
        { name: "New Zealand", path: "/study-abroad/new-zealand" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "All Courses", path: "/all-courses" },
        { name: "Blog", path: "/blog" },
        { name: "Scholarships", path: "/scholarships" },
        { name: "Visa Information", path: "/visa-info" },
        { name: "Success Stories", path: "/success-stories" },
        { name: "FAQ", path: "/faq" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Contact", path: "/contact" },
        { name: "Careers", path: "/careers" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Service", path: "/terms" },
      ],
    },
  ];

  const socialLinks = [
    { name: "Facebook", icon: "logos:facebook", url: "https://facebook.com" },
    { name: "Twitter", icon: "logos:twitter", url: "https://twitter.com" },
    {
      name: "Instagram",
      icon: "logos:instagram-icon",
      url: "https://instagram.com",
    },
    {
      name: "LinkedIn",
      icon: "logos:linkedin-icon",
      url: "https://linkedin.com",
    },
    { name: "YouTube", icon: "logos:youtube-icon", url: "https://youtube.com" },
  ];

  return (
    <footer className="bg-content1 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 w-fit">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-primary">
                <span className="text-white font-bold text-lg">CH</span>
              </div>
              <p className="font-bold text-xl">
                Career<span className="text-primary">HQ</span>
              </p>
            </Link>
            <p className="text-foreground-500 mb-6 max-w-md">
              Empowering students and professionals to achieve their
              international education and career goals through expert guidance
              and comprehensive resources.
            </p>
            <div className="flex gap-4 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-default-100 hover:bg-default-200 transition-colors"
                  aria-label={social.name}
                >
                  <Icon icon={social.icon} width={20} height={20} />
                </a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <HeroLink
                      as={Link}
                      href={link.path}
                      color="foreground"
                      className="text-foreground-500 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </HeroLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Divider className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-foreground-500 text-sm">
            © {currentYear} CareerHQ. All rights reserved.
          </p>
          <div className="flex gap-6">
            <HeroLink
              as={Link}
              href="/privacy"
              color="foreground"
              className="text-sm text-foreground-500 hover:text-primary transition-colors"
            >
              Privacy Policy
            </HeroLink>
            <HeroLink
              as={Link}
              href="/terms"
              color="foreground"
              className="text-sm text-foreground-500 hover:text-primary transition-colors"
            >
              Terms of Service
            </HeroLink>
            <HeroLink
              as={Link}
              href="/cookies"
              color="foreground"
              className="text-sm text-foreground-500 hover:text-primary transition-colors"
            >
              Cookie Policy
            </HeroLink>
          </div>
        </div>
      </div>
    </footer>
  );
};
