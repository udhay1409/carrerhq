"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { UniversityCard } from "@/components/university-card";
import { EnquiryForm, type EnquiryFormHandle } from "@/components/enquiry-form";
import { getImageUrl } from "@/lib/cloudinary-utils";

interface CountryData {
  name: string;
  imageId: string;
  description: string;
  universities: number;
  courses: number;
  avgTuition: string;
  costOfLiving: string;
  workRights: string;
  visaInfo: string;
  scholarships: string;
  intakes: string;
}

interface University {
  id: string;
  name: string;
  location: string;
  imageId: string;
  countryId: string;
  ranking: number;
  courses: number;
  tags: string[];
}

interface CountryPageClientProps {
  countryData: CountryData;
  universities: University[];
  countryId: string;
}

export const CountryPageClient: React.FC<CountryPageClientProps> = ({
  countryData,
  universities,
  countryId: _countryId,
}) => {
  const enquiryRef = React.useRef<EnquiryFormHandle | null>(null);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-50 to-white py-12 md:py-16">
        <div className="absolute inset-0 hero-pattern opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Breadcrumbs underline="hover" className="mb-6">
            {" "}
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/study-abroad">
              Study Abroad
            </BreadcrumbItem>{" "}
            <BreadcrumbItem>{countryData.name}</BreadcrumbItem>
          </Breadcrumbs>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Study in{" "}
                <span className="text-gradient-primary">
                  {countryData.name}
                </span>
              </h1>
              <p className="text-xl text-foreground-600 mb-8">
                {countryData.description}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <Icon icon="lucide:building" className="text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">
                      {countryData.universities}
                    </p>
                    <p className="text-xs text-foreground-500">Universities</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <Icon icon="lucide:book-open" className="text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{countryData.courses}</p>
                    <p className="text-xs text-foreground-500">Courses</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button
                  color="primary"
                  endContent={<Icon icon="lucide:arrow-right" />}
                  as={Link}
                  href="#universities"
                >
                  Explore Universities
                </Button>
                <Button
                  variant="flat"
                  color="primary"
                  startContent={<Icon icon="lucide:calendar" />}
                  onPress={() =>
                    enquiryRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    })
                  }
                >
                  Free Consultation
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative"
            >
              <div className="relative z-10 rounded-lg overflow-hidden shadow-xl h-96">
                <Image
                  src={
                    getImageUrl(countryData.imageId, "hero") ||
                    "/images/country-placeholder.svg"
                  }
                  alt={`Study in ${countryData.name} - Universities and educational opportunities`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/country-placeholder.svg";
                  }}
                />
              </div>
              <div className="absolute -bottom-6 -right-4 w-32 h-32 bg-secondary-100 rounded-full z-0"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-100 rounded-full z-0"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Information Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Key Information</h2>
            <p className="text-foreground-500 max-w-2xl mx-auto">
              Essential details about studying in {countryData.name}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Average Tuition",
                value: countryData.avgTuition,
                icon: "lucide:wallet",
              },
              {
                title: "Cost of Living",
                value: countryData.costOfLiving,
                icon: "lucide:home",
              },
              {
                title: "Work Rights",
                value: countryData.workRights,
                icon: "lucide:briefcase",
              },
              {
                title: "Intakes",
                value: countryData.intakes,
                icon: "lucide:calendar",
              },
            ].map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="border border-default-200 h-full">
                  <CardBody className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                      <Icon icon={info.icon} className="text-primary text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{info.title}</h3>
                    <p className="text-foreground-500">{info.value}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Universities Section */}
      <section id="universities" className="py-16 bg-default-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Universities in {countryData.name}
              </h2>
              <p className="text-foreground-500">
                Explore top educational institutions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {universities.map((university) => (
              <UniversityCard
                key={university.id}
                id={university.id}
                name={university.name}
                location={university.location}
                imageId={university.imageId}
                country={countryData.name}
                ranking={university.ranking}
                courses={university.courses}
                tags={university.tags || []}
              />
            ))}
          </div>

          {universities.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground-500">
                No universities found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Visa & Scholarships Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <Icon
                    icon="lucide:file-check"
                    className="text-primary text-xl"
                  />
                </div>
                <h2 className="text-2xl font-bold">Visa Information</h2>
              </div>
              <p className="text-foreground-600 mb-6">{countryData.visaInfo}</p>
              <Button
                as={Link}
                href="/contact"
                variant="flat"
                color="primary"
                endContent={<Icon icon="lucide:arrow-right" />}
              >
                Get Visa Assistance
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <Icon icon="lucide:award" className="text-primary text-xl" />
                </div>
                <h2 className="text-2xl font-bold">Scholarships</h2>
              </div>
              <p className="text-foreground-600 mb-6">
                {countryData.scholarships}
              </p>
              <Button
                as={Link}
                href="/contact"
                variant="flat"
                color="primary"
                endContent={<Icon icon="lucide:arrow-right" />}
              >
                Scholarship Guidance
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Ready to Study in {countryData.name}?
              </h2>
              <p className="text-white/90 mb-6">
                Our expert counselors are ready to guide you through every step
                of the process. Schedule a free consultation today.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  color="default"
                  variant="solid"
                  size="lg"
                  startContent={<Icon icon="lucide:calendar" />}
                  className="font-medium bg-white text-primary"
                  onClick={() => {
                    enquiryRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                    setTimeout(() => enquiryRef.current?.focus(), 450);
                  }}
                >
                  Book Free Consultation
                </Button>
                <Button
                  as={Link}
                  href="#universities"
                  variant="bordered"
                  size="lg"
                  className="font-medium text-white border-white"
                >
                  Explore Universities
                </Button>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <EnquiryForm
                ref={enquiryRef}
                title="Get Expert Guidance"
                subtitle="Fill out this form and our education experts will get back to you within 24 hours."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
