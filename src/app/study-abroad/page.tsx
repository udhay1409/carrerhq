"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Tabs, Tab } from "@heroui/tabs";
import { CountryCard } from "@/components/country-card";
import { SearchBar } from "@/components/search-bar";
import { EnquiryForm, EnquiryFormHandle } from "@/components/enquiry-form";
import type { Country } from "@/types/education";
import {
  logDataFetchError,
  logNetworkError,
  logApiError,
} from "@/utils/errorUtils";

// Extended Country interface for API response with counts
interface CountryWithCounts extends Country {
  universities?: number;
  courses?: number;
}

export default function StudyAbroadPage() {
  const enquiryRef = React.useRef<EnquiryFormHandle | null>(null);
  const [selected, setSelected] = React.useState("all");
  const [countries, setCountries] = React.useState<CountryWithCounts[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch countries data from API
  React.useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/countries?includeCounts=true");

        if (!response.ok) {
          logApiError(
            `Failed to fetch countries for study-abroad page: ${response.status}`,
            "/api/countries",
            { includeCounts: true },
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
          logNetworkError(error, "/api/countries", { includeCounts: true });
        } else {
          logDataFetchError(
            error instanceof Error ? error : String(error),
            "study_abroad_countries",
            undefined,
            { includeCounts: true }
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const regions = [
    { id: "all", name: "All Regions" },
    { id: "north-america", name: "North America" },
    { id: "europe", name: "Europe" },
    { id: "asia-pacific", name: "Asia Pacific" },
    { id: "middle-east", name: "Middle East" },
  ];

  const filteredCountries = React.useMemo(() => {
    if (selected === "all") return countries;

    // Region mapping based on country codes
    const regionMap: Record<string, string[]> = {
      "north-america": ["US", "CA"],
      europe: ["GB", "UK", "DE", "FR", "IE"],
      "asia-pacific": ["AU", "NZ"],
      "middle-east": [],
    };

    return countries.filter((country) => {
      const countryCode =
        country.code?.toUpperCase() || country.id?.toUpperCase();
      return regionMap[selected]?.includes(countryCode);
    });
  }, [selected, countries]);

  const benefits = [
    {
      title: "Global Recognition",
      description:
        "Degrees from international universities are recognized worldwide, opening doors to global career opportunities.",
      icon: "lucide:award",
    },
    {
      title: "Cultural Exposure",
      description:
        "Experience diverse cultures, perspectives, and lifestyles that broaden your worldview and personal growth.",
      icon: "lucide:globe",
    },
    {
      title: "Career Advancement",
      description:
        "Gain a competitive edge in the job market with international experience and specialized knowledge.",
      icon: "lucide:briefcase",
    },
    {
      title: "Language Proficiency",
      description:
        "Immerse yourself in a foreign language environment, enhancing your communication skills and employability.",
      icon: "lucide:message-square",
    },
    {
      title: "Research Opportunities",
      description:
        "Access cutting-edge research facilities and collaborate with leading experts in your field of study.",
      icon: "lucide:microscope",
    },
    {
      title: "Networking",
      description:
        "Build a global network of peers, professors, and industry professionals that can benefit your future career.",
      icon: "lucide:users",
    },
  ];

  // wrapper to adapt Tabs onSelectionChange typing (Key can be number|string) -> we store string keys
  const handleTabChange = (key: React.Key) => {
    setSelected(String(key));
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-50 to-white py-16 md:py-24">
        <div className="absolute inset-0 hero-pattern opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Study <span className="text-gradient-primary">Abroad</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xl text-foreground-600 mb-8"
            >
              Explore top destinations, universities, and courses for your
              international education journey.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex justify-center"
            >
              <SearchBar variant="hero" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Study Destinations</h2>
              <p className="text-foreground-500">
                Explore top countries for international education
              </p>
            </div>
            <Tabs
              selectedKey={selected}
              onSelectionChange={handleTabChange}
              variant="light"
              color="primary"
              radius="full"
              className="mt-4 md:mt-0"
            >
              {regions.map((region) => (
                <Tab key={region.id} title={region.name} />
              ))}
            </Tabs>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            ) : filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <CountryCard
                  key={country.id}
                  id={country.code || country.id}
                  name={country.name}
                  imageId={country.imageId || ""}
                  flagImageId={country.flagImageId || ""}
                  universities={country.universities || 0}
                  courses={country.courses || 0}
                  code={country.code}
                />
              ))
            ) : (
              <div className="col-span-4 text-center py-12">
                <p className="text-foreground-500 mb-4">
                  No countries available for the selected region.
                </p>
                <Link href="/admin/education">
                  <Button color="primary" variant="flat">
                    Add Countries
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-default-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              Benefits of Studying Abroad
            </h2>
            <p className="text-foreground-500 max-w-2xl mx-auto">
              Discover how international education can transform your personal
              and professional growth
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
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
                      <Icon
                        icon={benefit.icon}
                        className="text-primary text-xl"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-foreground-500">{benefit.description}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Our Process</h2>
            <p className="text-foreground-500 max-w-2xl mx-auto">
              We guide you through every step of your international education
              journey
            </p>
          </div>

          <div className="relative">
            {/* Process line */}
            {/* <div className="hidden md:block absolute top-1/4 left-0 w-full h-0.5 bg-primary-200 transform -translate-y-1/2"></div> */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: 1,
                  title: "Consultation",
                  description:
                    "Meet with our expert counselors to discuss your academic background, career goals, and preferences.",
                  icon: "lucide:users",
                },
                {
                  step: 2,
                  title: "University & Course Selection",
                  description:
                    "Based on your profile, we help you select the right universities and courses that match your aspirations.",
                  icon: "lucide:building",
                },
                {
                  step: 3,
                  title: "Application Support",
                  description:
                    "We assist with application preparation, including SOP, LOR, resume, and other required documents.",
                  icon: "lucide:file-text",
                },
                {
                  step: 4,
                  title: "Visa & Pre-Departure",
                  description:
                    "Get comprehensive visa guidance and pre-departure orientation to ensure a smooth transition.",
                  icon: "lucide:plane-takeoff",
                },
              ].map((process, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative z-10"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-6 shadow-lg">
                      <span className="text-white font-bold text-xl">
                        {process.step}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-center">
                      {process.title}
                    </h3>
                    <p className="text-foreground-500 text-center">
                      {process.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-default-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-foreground-500 max-w-2xl mx-auto">
              Find answers to common questions about studying abroad
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {[
              {
                question:
                  "What are the general requirements for studying abroad?",
                answer:
                  "Requirements vary by country and university, but generally include academic transcripts, standardized test scores (like IELTS/TOEFL for English proficiency, GRE/GMAT for graduate programs), statement of purpose, letters of recommendation, and proof of financial support.",
              },
              {
                question: "How much does it cost to study abroad?",
                answer:
                  "Costs vary significantly depending on the country, university, and program. They include tuition fees, living expenses, health insurance, travel costs, and visa fees. Many countries offer scholarships and financial aid options for international students.",
              },
              {
                question: "When should I start the application process?",
                answer:
                  "Its recommended to start at least 12-18 months before your intended start date. This gives you enough time for research, standardized tests, application preparation, visa processing, and pre-departure arrangements.",
              },
              {
                question: "Can I work while studying abroad?",
                answer:
                  "Work regulations for international students vary by country. Many countries allow students to work part-time during the academic year and full-time during breaks, but there are usually restrictions on the number of hours.",
              },
              {
                question: "How can CareerHQ help with my study abroad journey?",
                answer:
                  "We provide comprehensive support including university selection, application guidance, scholarship information, visa assistance, pre-departure orientation, and post-arrival support to ensure a smooth transition to studying abroad.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="mb-6"
              >
                <Card className="border border-default-200">
                  <CardBody className="p-6">
                    <h3 className="text-lg font-semibold mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-foreground-500">{faq.answer}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Ready to Begin Your International Education Journey?
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
                  href="/blog"
                  variant="bordered"
                  size="lg"
                  className="font-medium text-white border-white"
                >
                  Read Our Blog
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
}
