"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import { Chip } from "@heroui/chip";
import { Tabs, Tab } from "@heroui/tabs";
import { Divider } from "@heroui/divider";
import { Icon } from "@iconify/react";
import { EnquiryForm } from "@/components/enquiry-form";
import { useAllCourses } from "@/hooks/useAllCourses";
import { generateCountrySlug, generateUniversitySlug } from "@/lib/slug-utils";
import { ApplicationModal } from "@/components/application-modal";
import type { EnquiryFormHandle } from "@/components/enquiry-form";

interface CourseData {
  programName?: string;
  university?: string;
  universityId?: string;
  countryId?: string;
  country?: string;
  duration?: string;
  yearlyTuitionFees?: string;
  studyLevel?: string;
  openIntakes?: string;
  entryRequirements?: string;
  specializations?: string[];
  careerProspects?: string[];
  applicationDeadline?: string;
  scholarships?: string[];
  campus?: string;
  ieltsScore?: number;
  ieltsNoBandLessThan?: number;
  pteScore?: number | null;
  pteNoBandLessThan?: number | null;
  toeflScore?: number;
  gmatScore?: number | null;
  greScore?: number;
  workExperience?: string;
  intakeYear?: string;
}

interface CoursePageClientProps {
  countryId: string;
  universityId: string;
  courseId: string;
  countryName?: string;
  initialCourseData?: CourseData;
}

export const CoursePageClient: React.FC<CoursePageClientProps> = ({
  countryId,
  courseId,
  countryName: propCountryName,
  initialCourseData,
}) => {
  const [selected, setSelected] = React.useState("overview");
  const enquiryRef = React.useRef<EnquiryFormHandle | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] =
    React.useState(false);
  const { getCourseById, loading } = useAllCourses();

  const courseData = React.useMemo(() => {
    // Helper function to transform course data
    const transformCourse = (course: CourseData) => ({
      name: course.programName || "Course Name Not Available",
      university: course.university || "University Name Not Available",
      universityId: course.universityId || "",
      countryId: course.countryId || countryId,
      country: course.country || "Country Not Available",
      duration: course.duration || "Duration Not Specified",
      fee: course.yearlyTuitionFees || "Contact University",
      totalFee: course.yearlyTuitionFees || "Contact University",
      level: course.studyLevel || "Not Specified",
      intake: course.openIntakes
        ? course.openIntakes
            .split(/[,;]/)
            .map((s: string) => s.trim())
            .filter(Boolean)
        : ["Contact University"],
      description:
        course.entryRequirements ||
        "Contact university for detailed requirements",
      eligibility:
        course.entryRequirements ||
        "Contact university for eligibility requirements",
      curriculum:
        course.specializations && course.specializations.length > 0
          ? course.specializations
          : ["Contact university for curriculum details"],
      careerOutcomes:
        course.careerProspects && course.careerProspects.length > 0
          ? course.careerProspects
          : ["Contact university for career information"],
      applicationDeadline: course.applicationDeadline || "Contact University",
      scholarships:
        course.scholarships && course.scholarships.length > 0
          ? course.scholarships
          : ["Contact university for scholarship information"],
      campus: course.campus || "Main Campus",
      ieltsScore: course.ieltsScore || 6.5,
      ieltsNoBandLessThan: course.ieltsNoBandLessThan || 6.0,
      pteScore: course.pteScore,
      pteNoBandLessThan: course.pteNoBandLessThan,
      toeflScore: course.toeflScore,
      gmatScore: course.gmatScore,
      greScore: course.greScore,
      workExperience: course.workExperience,
      intakeYear: course.intakeYear || new Date().getFullYear().toString(),
    });

    // Use initial course data if available (from server-side)
    if (initialCourseData) {
      return transformCourse(initialCourseData);
    }

    // Fallback to client-side data fetching
    if (!loading) {
      const course = getCourseById(courseId);
      if (course) {
        return transformCourse(course);
      }
    }
    return null;
  }, [initialCourseData, courseId, getCourseById, loading, countryId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground-600">Loading course details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-danger mb-4">
            Course Not Found
          </h1>
          <p className="text-foreground-600 mb-6">
            The course you&apos;re looking for could not be found or may have
            been removed.
          </p>
          <Button as={Link} href="/study-abroad" color="primary" variant="flat">
            Browse All Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-50 to-white py-12 md:py-16">
        <div className="absolute inset-0 hero-pattern opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Breadcrumbs className="mb-6">
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/study-abroad">Study Abroad</BreadcrumbItem>
            <BreadcrumbItem
              href={`/study-abroad/${generateCountrySlug(
                propCountryName || courseData?.country || countryId
              )}`}
            >
              {propCountryName || courseData?.country || countryId}
            </BreadcrumbItem>
            <BreadcrumbItem
              href={`/study-abroad/${generateCountrySlug(
                propCountryName || courseData?.country || countryId
              )}/${generateUniversitySlug(courseData.university)}`}
            >
              {courseData.university}
            </BreadcrumbItem>
            <BreadcrumbItem>{courseData.name}</BreadcrumbItem>
          </Breadcrumbs>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Chip color="primary" variant="flat">
                {courseData.level}
              </Chip>
              <Chip variant="flat">{courseData.duration}</Chip>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {courseData.name}
            </h1>

            <div className="flex items-center gap-2 text-foreground-500 mb-6">
              <Icon icon="lucide:building" />
              <span>{courseData.university}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="border border-default-200">
                <CardBody className="p-0">
                  <Tabs
                    selectedKey={selected}
                    onSelectionChange={(key) => setSelected(String(key))}
                    variant="bordered"
                    color="primary"
                    classNames={{
                      tabList: "bg-default-50 p-0",
                      cursor: "bg-primary",
                      tab: "h-12",
                    }}
                    aria-label="Course tabs"
                  >
                    <Tab key="overview" title="Overview">
                      <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">
                          Course Overview
                        </h2>
                        <p className="text-foreground-600 mb-6">
                          {courseData.description}
                        </p>

                        <h3 className="text-lg font-semibold mb-3">
                          Key Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mt-1">
                              <Icon
                                icon="lucide:clock"
                                className="text-primary"
                              />
                            </div>
                            <div>
                              <p className="font-medium">Duration</p>
                              <p className="text-foreground-500">
                                {courseData.duration}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mt-1">
                              <Icon
                                icon="lucide:wallet"
                                className="text-primary"
                              />
                            </div>
                            <div>
                              <p className="font-medium">Tuition Fee</p>
                              <p className="text-foreground-500">
                                {courseData.fee}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mt-1">
                              <Icon
                                icon="lucide:calendar"
                                className="text-primary"
                              />
                            </div>
                            <div>
                              <p className="font-medium">Intake Months</p>
                              <p className="text-foreground-500">
                                {courseData.intake?.join(", ") ||
                                  "Contact for intake dates"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mt-1">
                              <Icon
                                icon="lucide:file-clock"
                                className="text-primary"
                              />
                            </div>
                            <div>
                              <p className="font-medium">
                                Application Deadline
                              </p>
                              <p className="text-foreground-500">
                                {courseData.applicationDeadline}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* English Requirements */}
                        {courseData.ieltsScore && (
                          <>
                            <h3 className="text-lg font-semibold mb-3">
                              English Language Requirements
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mt-1">
                                  <Icon
                                    icon="lucide:book-open"
                                    className="text-primary"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">IELTS</p>
                                  <p className="text-foreground-500">
                                    Overall: {courseData.ieltsScore}, No band
                                    less than: {courseData.ieltsNoBandLessThan}
                                  </p>
                                </div>
                              </div>
                              {courseData.pteScore && (
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mt-1">
                                    <Icon
                                      icon="lucide:book-open"
                                      className="text-primary"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium">PTE Academic</p>
                                    <p className="text-foreground-500">
                                      Overall: {courseData.pteScore}, No band
                                      less than:{" "}
                                      {courseData.pteNoBandLessThan || "N/A"}
                                    </p>
                                  </div>
                                </div>
                              )}
                              {courseData.toeflScore && (
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mt-1">
                                    <Icon
                                      icon="lucide:book-open"
                                      className="text-primary"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium">TOEFL</p>
                                    <p className="text-foreground-500">
                                      Overall: {courseData.toeflScore}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                            {courseData.campus && (
                              <>
                                <h3 className="text-lg font-semibold mb-3">
                                  Campus Location
                                </h3>
                                <p className="text-foreground-600 mb-6">
                                  📍 {courseData.campus}
                                </p>
                              </>
                            )}
                          </>
                        )}

                        <h3 className="text-lg font-semibold mb-3">
                          Eligibility Requirements
                        </h3>
                        <p className="text-foreground-600 mb-6">
                          {courseData.eligibility}
                        </p>
                      </div>
                    </Tab>
                    <Tab key="curriculum" title="Curriculum">
                      <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">
                          Course Curriculum
                        </h2>
                        <ul className="space-y-4">
                          {courseData.curriculum.map(
                            (item: string, index: number) => (
                              <li
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mt-1 flex-shrink-0">
                                  <span className="text-primary text-xs font-medium">
                                    {index + 1}
                                  </span>
                                </div>
                                <p className="text-foreground-600">{item}</p>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </Tab>
                    <Tab key="careers" title="Career Outcomes">
                      <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">
                          Career Outcomes
                        </h2>
                        <p className="text-foreground-600 mb-4">
                          Graduates of this program have pursued successful
                          careers in various sectors, including:
                        </p>
                        <ul className="space-y-2 mb-6">
                          {courseData.careerOutcomes.map(
                            (outcome: string, index: number) => (
                              <li
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mt-1 flex-shrink-0">
                                  <Icon
                                    icon="lucide:check"
                                    className="text-primary text-xs"
                                  />
                                </div>
                                <p className="text-foreground-600">{outcome}</p>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </Tab>
                    <Tab key="scholarships" title="Scholarships">
                      <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">
                          Available Scholarships
                        </h2>
                        <p className="text-foreground-600 mb-4">
                          Students may be eligible for the following
                          scholarships and financial aid options:
                        </p>
                        <ul className="space-y-2">
                          {courseData.scholarships.map(
                            (scholarship: string, index: number) => (
                              <li
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mt-1 flex-shrink-0">
                                  <Icon
                                    icon="lucide:award"
                                    className="text-primary text-xs"
                                  />
                                </div>
                                <p className="text-foreground-600">
                                  {scholarship}
                                </p>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </Tab>
                  </Tabs>
                </CardBody>
              </Card>
            </div>

            <div>
              <Card className="border border-default-200 sticky top-24">
                <CardBody className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Apply for this Course
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-foreground-500">Tuition Fee:</span>
                      <span className="font-medium">{courseData.fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground-500">Total Fee:</span>
                      <span className="font-medium">{courseData.totalFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground-500">Duration:</span>
                      <span className="font-medium">{courseData.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground-500">Next Intake:</span>
                      <span className="font-medium">
                        {courseData.intake[0] || "N/A"}
                      </span>
                    </div>
                    <Divider />
                    <div className="flex justify-between">
                      <span className="text-foreground-500">
                        Application Deadline:
                      </span>
                      <span className="font-medium text-danger">
                        {courseData?.applicationDeadline?.split(",")[0]}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      color="primary"
                      fullWidth
                      size="lg"
                      onPress={() => setIsApplicationModalOpen(true)}
                      startContent={<Icon icon="lucide:file-text" />}
                    >
                      Apply Now
                    </Button>
                    <Button
                      variant="flat"
                      color="primary"
                      fullWidth
                      onClick={() => {
                        enquiryRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                        setTimeout(() => enquiryRef.current?.focus(), 450);
                      }}
                      startContent={<Icon icon="lucide:calendar" />}
                    >
                      Book Consultation
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Ready to Apply for {courseData.name}?
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
                  href={`/study-abroad/${courseData.countryId}/${courseData.universityId}`}
                  variant="bordered"
                  size="lg"
                  className="font-medium text-white border-white"
                >
                  Explore More Courses
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
      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        courseDetails={{
          country: courseData.country || "Unknown",
          university: courseData.university || "Unknown",
          programName: courseData.name || "Unknown",
        }}
      />
    </>
  );
};
