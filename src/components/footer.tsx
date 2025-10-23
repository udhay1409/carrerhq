"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Link as HeroLink } from "@heroui/link";
import { Divider } from "@heroui/divider";
import { Icon } from "@iconify/react";
import type { Country } from "@/types/education";
import { generateCountrySlug } from "@/lib/slug-utils";
import {
  logDataFetchError,
  logNetworkError,
  logApiError,
} from "@/utils/errorUtils";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [countries, setCountries] = React.useState<Country[]>([]);

  const footerSections = [
    {
      title: "Study Abroad",
      links: countries.map((country) => ({
        name: country.name,
        path: `/study-abroad/${
          generateCountrySlug(country.name) || country.id
        }`,
      })),
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", path: "/blog" },
        { name: "Career Test", path: "/career-test" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "Home", path: "/" },

        { name: "About Us", path: "/about" },
        { name: "Study Abroad", path: "/study-abroad" },

        { name: "Contact", path: "/contact" },
      ],
    },
  ];

  const socialLinks = [
    { name: "Facebook", icon: "logos:facebook", url: "https://facebook.com" },
    { name: "Twitter", icon: "logos:x", url: "https://twitter.com" },
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

  const fetchCountries = async () => {
    try {
      const response = await fetch("/api/countries?limit=8");

      if (!response.ok) {
        logApiError(
          `Failed to fetch countries for footer: ${response.status}`,
          "/api/countries",
          { limit: 8 },
          response.status
        );
        return;
      }

      const data = await response.json();

      if (data.countries) {
        setCountries(data.countries);
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        logNetworkError(error, "/api/countries", { limit: 8 });
      } else {
        logDataFetchError(
          error instanceof Error ? error : String(error),
          "footer_countries",
          undefined,
          { limit: 8 }
        );
      }
    }
  };

  React.useEffect(() => {
    fetchCountries();
  }, []);

  return (
    <footer className="bg-content1 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/images/career-hq-logo.png"
                alt="CareerHQ Logo"
                width={200}
                height={67}
                className="h-16 w-auto object-contain"
              />
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

        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <p className="text-foreground-500 text-sm text-center">
            © {currentYear} CareerHQ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
