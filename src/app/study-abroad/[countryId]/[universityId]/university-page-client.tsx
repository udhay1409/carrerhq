"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import { Tabs, Tab } from "@heroui/tabs";
import { Chip } from "@heroui/chip";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { CourseCard } from "@/components/course-card";
import { EnquiryForm } from "@/components/enquiry-form";
import { useAllCourses } from "@/hooks/useAllCourses";
import { generateCountrySlug } from "@/lib/slug-utils";
import { getImageUrl as getCloudinaryImageUrl } from "@/lib/cloudinary-utils";

import type { EnquiryFormHandle } from "@/components/enquiry-form";

interface UniversityData {
  name: string;
  location: string;
  imageId: string;
  description: string;
  ranking: number | string;
  established: number | string;
  type: string;
  campusSize: string;
  studentPopulation: string;
  internationalStudents: string;
  accommodation: string;
  facilities: string[];
  website: string;
  country?: { name: string };
  countryName?: string;
}

interface Course {
  serialNo?: string;
  id?: string;
  university: string;
  programName?: string;
  campus?: string;
  duration?: string;
  openIntakes?: string;
  intakeYear?: string;
  entryRequirements?: string;
  ieltsScore?: number;
  ieltsNoBandLessThan?: number;
  pteScore?: number;
  pteNoBandLessThan?: number;
  yearlyTuitionFees?: string;
  countryId?: string;
  universityId?: string;
  studyLevel?: string;
  intake?: string[];
  fee?: string;
  level?: string;
}

interface UniversityPageClientProps {
  universityData: UniversityData;
  countryId: string;
  universityId: string;
  countryName: string;
  courses?: Course[];
}

export const UniversityPageClient: React.FC<UniversityPageClientProps> = ({
  universityData,
  countryId,
  universityId,
  countryName,
  courses: propsCourses = [],
}) => {
  const [selected, setSelected] = React.useState("all");
  const enquiryRef = React.useRef<EnquiryFormHandle | null>(null);

  // Prefix unused parameter with underscore
  const _universityId = universityId;

  // Use courses from props if available, otherwise fallback to hook
  const { getCoursesByUniversity, loading } = useAllCourses();

  const courses = React.useMemo(() => {
    if (propsCourses.length > 0) {
      return propsCourses;
    }
    if (!loading) {
      return getCoursesByUniversity(countryId, universityData.name);
    }
    return [];
  }, [
    propsCourses,
    countryId,
    universityData.name,
    getCoursesByUniversity,
    loading,
  ]);

  const filteredCourses = React.useMemo(() => {
    if (selected === "all") return courses;

    // For New Zealand courses, all are Master's level
    if (countryId === "new-zealand") {
      if (selected === "postgraduate") return courses;
      if (selected === "undergraduate" || selected === "doctorate") return [];
      return courses;
    }

    // For German courses, all are Postgraduate level
    if (countryId === "germany") {
      if (selected === "postgraduate") return courses;
      if (selected === "undergraduate" || selected === "doctorate") return [];
      return courses;
    }

    if (selected === "undergraduate") {
      return courses.filter((course) => course.studyLevel === "Undergraduate");
    }

    if (selected === "postgraduate") {
      return courses.filter((course) => course.studyLevel === "Postgraduate");
    }

    if (selected === "doctorate") {
      return courses.filter((course) => course.studyLevel === "Doctorate");
    }

    return courses;
  }, [selected, courses, countryId]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-50 to-white py-12 md:py-16">
        <div className="absolute inset-0 hero-pattern opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Breadcrumbs className="mb-6" underline="hover">
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/study-abroad">Study Abroad</BreadcrumbItem>
            <BreadcrumbItem
              href={`/study-abroad/${generateCountrySlug(countryName)}`}
            >
              {countryName}
            </BreadcrumbItem>
            <BreadcrumbItem>{universityData.name}</BreadcrumbItem>
          </Breadcrumbs>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                {universityData.ranking !== "N/A" && (
                  <Chip
                    color="primary"
                    variant="flat"
                    startContent={
                      <Icon icon="lucide:award" className="text-xs" />
                    }
                  >
                    Rank #{universityData.ranking}
                  </Chip>
                )}
                <Chip variant="flat">{universityData.type}</Chip>
                <Chip variant="flat">Est. {universityData.established}</Chip>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {universityData.name}
              </h1>

              <div className="flex items-center gap-2 text-foreground-500 mb-6">
                <Icon icon="lucide:map-pin" />
                <span>{universityData.location}</span>
              </div>

              <p className="text-foreground-600 mb-8">
                {universityData.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  color="primary"
                  endContent={<Icon icon="lucide:arrow-right" />}
                  as={Link}
                  href="#courses"
                >
                  Explore Courses
                </Button>
                <Button
                  variant="flat"
                  color="primary"
                  onClick={() => {
                    enquiryRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                    setTimeout(() => enquiryRef.current?.focus(), 450);
                  }}
                  startContent={<Icon icon="lucide:calendar" />}
                >
                  Free Consultation
                </Button>
                <Button
                  variant="light"
                  as="a"
                  href={`https://${universityData.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  startContent={<Icon icon="lucide:external-link" />}
                >
                  Visit Website
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
                {universityData.imageId ? (
                  <Image
                    src={getCloudinaryImageUrl(universityData.imageId, "card")}
                    alt={`${universityData.name} campus and facilities`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <div className="text-center">
                      <Icon
                        icon="lucide:building"
                        className="w-16 h-16 text-primary-500 mx-auto mb-2"
                      />
                      <p className="text-primary-700 font-medium">
                        {universityData.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-6 -right-4 w-32 h-32 bg-secondary-100 rounded-full z-0"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-100 rounded-full z-0"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* University Information Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">University Information</h2>
            <p className="text-foreground-500 max-w-2xl mx-auto">
              Key details about {universityData.name}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Student Population",
                value: universityData.studentPopulation,
                icon: "lucide:users",
              },
              {
                title: "International Students",
                value: universityData.internationalStudents,
                icon: "lucide:globe",
              },
              {
                title: "Campus Size",
                value: universityData.campusSize,
                icon: "lucide:map",
              },
              {
                title: "Accommodation",
                value: universityData.accommodation,
                icon: "lucide:home",
              },
              {
                title: "Facilities",
                value: universityData.facilities.join(", "),
                icon: "lucide:building",
              },
              {
                title: "Website",
                value: universityData.website,
                icon: "lucide:link",
                isLink: true,
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
                    {info.isLink ? (
                      <a
                        href={`https://${info.value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-foreground-500">{info.value}</p>
                    )}
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-16 bg-default-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Courses at {universityData.name}
              </h2>
              <p className="text-foreground-500">Explore available programs</p>
            </div>
            <Tabs
              selectedKey={selected}
              onSelectionChange={(key) => setSelected(String(key))}
              variant="light"
              color="primary"
              radius="full"
              className="mt-4 md:mt-0 "
              classNames={{
                base: "d-flex gap-[2px] sm-w-[300px] ",
              }}
            >
              <Tab key="all" title="All" />
              <Tab key="undergraduate" title="Undergraduate" />
              <Tab key="postgraduate" title="Postgraduate" />
              <Tab key="doctorate" title="Doctorate" />
            </Tabs>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses
              .filter((course) => {
                // Filter out courses with invalid data
                const universityName =
                  typeof course.university === "string"
                    ? course.university
                    : (course.university as { name?: string })?.name;

                const hasValidUniversity =
                  universityName && universityName.trim().length > 0;
                const hasValidProgram =
                  course.programName ||
                  (course as Course & { name?: string }).name;

                if (!hasValidUniversity || !hasValidProgram) {
                  console.warn(`Filtering out invalid course:`, {
                    id: course.serialNo || course.id,
                    university: course.university,
                    universityName: universityName,
                    programName:
                      course.programName ||
                      (course as Course & { name?: string }).name,
                  });
                  return false;
                }

                return true;
              })
              .map((course) => (
                <CourseCard
                  key={course.serialNo || course.id}
                  course={{
                    id: course.id || course.serialNo,
                    serialNo: parseInt(
                      String(course.serialNo || course.id || "0")
                    ),
                    university:
                      typeof course.university === "string"
                        ? course.university
                        : (course.university as { name?: string })?.name ||
                          "University Name Not Available",
                    programName:
                      course.programName ||
                      (course as Course & { name?: string }).name ||
                      "Program Name Not Available",
                    campus: course.campus || "Main Campus",
                    duration: course.duration || "Duration Not Specified",
                    openIntakes:
                      course.openIntakes ||
                      (course as Course & { intake?: string[] }).intake?.join(
                        ", "
                      ) ||
                      "Contact University",
                    intakeYear: course.intakeYear || "2025",
                    entryRequirements:
                      course.entryRequirements ||
                      "Contact University for Requirements",
                    ieltsScore: course.ieltsScore || 0,
                    ieltsNoBandLessThan: course.ieltsNoBandLessThan || 0,
                    pteScore: course.pteScore || 0,
                    pteNoBandLessThan: course.pteNoBandLessThan || 0,
                    yearlyTuitionFees:
                      course.yearlyTuitionFees ||
                      (course as Course & { fee?: string }).fee ||
                      "Contact University",
                    country: countryId,
                    studyLevel: course.studyLevel || "",
                  }}
                  countryName={
                    universityData?.country?.name ||
                    universityData?.countryName ||
                    countryName ||
                    "Unknown"
                  }
                  universityName={universityData?.name || "Unknown"}
                  onApply={() => {
                    enquiryRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                    setTimeout(() => enquiryRef.current?.focus(), 450);
                  }}
                />
              ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground-500">
                No courses found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Ready to Apply to {universityData.name}?
              </h2>
              <p className="text-white/90 mb-6">
                Our expert counselors are ready to guide you through every step
                of the application process. Schedule a free consultation today.
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
                  href="#courses"
                  variant="bordered"
                  size="lg"
                  className="font-medium text-white border-white"
                >
                  Explore Courses
                </Button>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <EnquiryForm
                ref={enquiryRef}
                title="Get Application Guidance"
                subtitle="Fill out this form and our education experts will get back to you within 24 hours."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
