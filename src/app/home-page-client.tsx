"use client";
import * as React from "react";
import Link from "next/link";
import { Tabs, Tab } from "@heroui/tabs";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { BlogSlider } from "../components/blog-ticker";

import { Grid } from "../components/ui/feature-section";
import { EnquiryForm, EnquiryFormHandle } from "../components/enquiry-form";
import { SearchBar } from "../components/search-bar";
import { CountryCard } from "../components/country-card";
import { UniversityCard } from "../components/university-card";
import { BlogCard } from "../components/blog-card";
import { AnimatedTestimonials } from "../components/ui/animated-testimonials";
import { HeroVideoDialog } from "../components/hero-video-dialog";
import { AnimatedTooltip } from "../components/ui/animated-tooltip";
import { ColourfulText } from "../components/ui/colourful-text";
import VenomBeam from "../components/ui/venom-beam";
import { AnimatedLogosCanopy } from "../components/ui/animated-logos-canopy";
import type { BlogPost } from "@/types/blog";
import type { CountryWithCounts, University } from "@/types/education";
import { getImageUrl as getCloudinaryImageUrl } from "@/lib/cloudinary-utils";

interface HomePageClientProps {
  blogPosts: BlogPost[];
}

export function HomePageClient({ blogPosts }: HomePageClientProps) {
  const enquiryRef = React.useRef<EnquiryFormHandle | null>(null);
  const [selected, setSelected] = React.useState("popular");
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [countries, setCountries] = React.useState<CountryWithCounts[]>([]);
  const [universities, setUniversities] = React.useState<University[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoaded(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch countries and universities in parallel
      const [countriesRes, universitiesRes] = await Promise.all([
        fetch("/api/countries?includeCounts=true"),
        fetch("/api/universities?populate=true&limit=8"),
      ]);

      const [countriesData, universitiesData] = await Promise.all([
        countriesRes.json(),
        universitiesRes.json(),
      ]);

      // Set countries data (limit to top 4 for homepage)
      if (countriesData.countries) {
        setCountries(countriesData.countries);
      }

      // Set universities data
      if (universitiesData.universities) {
        setUniversities(universitiesData.universities);
      }
    } catch (error) {
      console.error("Error fetching homepage data:", error);
      // Keep empty arrays as fallback
    } finally {
      setLoading(false);
    }
  };

  // Data is now fetched from APIs in useEffect

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "MBA Student, Harvard Business School",
      content:
        "CareerHQ made my dream of studying at Harvard a reality. Their counselors provided personalized guidance throughout the application process, helping me secure a scholarship as well.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "James Wilson",
      role: "Engineering Student, University of Toronto",
      content:
        "I was overwhelmed by the options until I found CareerHQ. They simplified the process and helped me find the perfect engineering program that matched my career goals.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
    },
    {
      name: "Mei Lin",
      role: "Computer Science Student, University of Melbourne",
      content:
        "The visa application process seemed daunting, but CareerHQ's step-by-step guidance made it straightforward. I'm now thriving in my program in Australia!",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 4,
    },
  ];

  const services = [
    {
      title: "University Selection",
      description:
        "Get expert guidance on choosing the right university based on your academic profile, career goals, and preferences.",
      icon: "lucide:building",
    },
    {
      title: "Visa Assistance",
      description:
        "Navigate the complex visa application process with our step-by-step guidance and documentation support.",
      icon: "lucide:file-check",
    },
    {
      title: "Scholarship Guidance",
      description:
        "Discover and apply for scholarships that match your profile to make your education more affordable.",
      icon: "lucide:award",
    },
    {
      title: "Application Support",
      description:
        "Get comprehensive assistance with university applications, including SOP, LOR, and resume preparation.",
      icon: "lucide:clipboard-check",
    },
    {
      title: "Test Preparation",
      description:
        "Access resources and guidance for standardized tests like IELTS, TOEFL, GRE, GMAT, and more.",
      icon: "lucide:book-open",
    },
    {
      title: "Career Counseling",
      description:
        "Receive personalized career counseling to align your education with your long-term professional goals.",
      icon: "lucide:briefcase",
    },
    {
      title: "Student Accommodation",
      description:
        "Find safe and comfortable accommodation options near your university with our housing assistance service.",
      icon: "lucide:home",
    },
    {
      title: "Cultural Integration",
      description:
        "Get support for adapting to your new environment with cultural orientation and local community connections.",
      icon: "lucide:globe",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Students Placed", icon: "lucide:users" },
    { value: "95%", label: "Visa Success Rate", icon: "lucide:check-circle" },
    { value: "500+", label: "University Partners", icon: "lucide:building" },
    { value: "50+", label: "Countries Covered", icon: "lucide:globe" },
  ];

  // Convert blog posts to ticker format
  const blogTickerItems = blogPosts.map((post) => ({
    id: post.id,
    title: post.title,
    link: `/blog/${post.id}`,
    isActive: false,
  }));

  return (
    <>
      {/* Hero Section */}
      <VenomBeam className="relative z-10">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-400">
                  Your Gateway to <ColourfulText text="Global Education" />
                </h1>
                <p className="text-xl text-neutral-700 dark:text-neutral-300 mb-8">
                  Discover the perfect study abroad opportunities tailored to
                  your academic goals and career aspirations.
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                  <Link href="/study-abroad">
                    {" "}
                    <Button
                      color="primary"
                      size="lg"
                      endContent={<Icon icon="lucide:arrow-right" />}
                      className="font-medium"
                    >
                      Explore Programs
                    </Button>{" "}
                  </Link>
                  <Button
                    color="primary"
                    variant="flat"
                    size="lg"
                    startContent={<Icon icon="lucide:calendar" />}
                    className="font-medium"
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

                <div className="flex items-center justify-start gap-2 mb-8">
                  <p className="text-sm text-foreground-500 mr-4 ">
                    Popular Destinations:
                  </p>
                  {!loading && countries.length > 0 && (
                    <AnimatedTooltip
                      items={countries.map((country, index) => ({
                        id: index + 1,
                        name: country.name,
                        designation: `${
                          country.universities || 0
                        } Universities • ${country.courses || 0} Courses`,
                        image: country.flagImageId
                          ? getCloudinaryImageUrl(
                              country.flagImageId,
                              "thumbnail"
                            )
                          : ``,
                      }))}
                    />
                  )}
                </div>

                <div className="flex flex-wrap gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <Icon icon={stat.icon} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">{stat.value}</p>
                        <p className="text-xs text-foreground-500">
                          {stat.label}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative"
            >
              <div className="relative z-10">
                <HeroVideoDialog
                  videoSrc="https://www.youtube.com/embed/t5akgsQsOSk?si=zke8LcRhw_75zT4X"
                  thumbnailSrc="https://www.timeshighereducation.com/student/sites/default/files/harvard-university-campus.jpg"
                  thumbnailAlt="Watch our welcome video"
                  animationStyle="from-center"
                  className="w-full rounded-lg shadow-xl overflow-hidden aspect-video"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary-100 rounded-full blur-2xl opacity-60 z-0"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-100 rounded-full blur-2xl opacity-60 z-0"></div>
            </motion.div>
          </div>

          <div className="mt-12 md:mt-16">
            <SearchBar variant="hero" />
          </div>

          <div className="mt-8">
            <BlogSlider items={blogTickerItems} />
          </div>
        </div>
      </VenomBeam>

      {/* Popular Destinations Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Popular Study Destinations
              </h2>
              <p className="text-foreground-500">
                Explore top countries for international education
              </p>
            </div>
            <Link href="/study-abroad">
              {" "}
              <Button
                variant="light"
                color="primary"
                endContent={<Icon icon="lucide:arrow-right" />}
                className="mt-4 md:mt-0"
              >
                View All Destinations
              </Button>{" "}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
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
            ) : countries.length > 0 ? (
              countries
                .slice(0, 4)
                .map((country) => (
                  <CountryCard
                    key={country.id}
                    id={country.id}
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
                  No countries available at the moment.
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

      {/* Top Universities Section */}
      <section className="py-16 bg-default-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Top Universities</h2>
              <p className="text-foreground-500">
                Discover world-class educational institutions
              </p>
            </div>
            <Tabs
              selectedKey={selected}
              onSelectionChange={(key) => setSelected(key as string)}
              variant="light"
              color="primary"
              radius="full"
              className="mt-4 md:mt-0"
            >
              <Tab key="popular" title="Popular" />
              <Tab key="ranked" title="Top Ranked" />
              <Tab key="affordable" title="Affordable" />
            </Tabs>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))
            ) : universities.length > 0 ? (
              universities.map((university) => (
                <UniversityCard
                  key={university.id}
                  id={university.id}
                  name={university.name}
                  location={
                    university.location || university.country?.name || ""
                  }
                  imageId={university.imageId || ""}
                  country={university.country?.name || "Unknown"}
                  ranking={university.ranking}
                  courses={university.courses || 0}
                  tags={university.tags || []}
                />
              ))
            ) : (
              <div className="col-span-4 text-center py-12">
                <p className="text-foreground-500 mb-4">
                  No universities available at the moment.
                </p>
                <Link href="/admin/education">
                  <Button color="primary" variant="flat">
                    Add Universities
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="mt-10 text-center">
            <Link href="/study-abroad">
              {" "}
              <Button
                color="primary"
                variant="flat"
                size="lg"
                endContent={<Icon icon="lucide:arrow-right" />}
              >
                Explore All Universities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 lg:py-40 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Our Services
            </h2>
            <p className="text-foreground-600 max-w-2xl mx-auto text-lg">
              We provide comprehensive support for your international education
              journey, from university selection to visa processing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="relative bg-white dark:bg-gray-800 p-8 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <Grid size={20} />
                <div className="relative z-20 mb-6 transform transition-transform group-hover:scale-110 duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-800/30 flex items-center justify-center">
                    <Icon
                      icon={service.icon}
                      className="h-6 w-6 text-primary-600 dark:text-primary-400"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-primary-900 dark:text-primary-100 relative z-20 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-base font-normal relative z-20 leading-relaxed">
                  {service.description}
                </p>
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
                Ready to Start Your International Education Journey?
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
                  onPress={() => {
                    enquiryRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                    // focus after a short delay to allow smooth scroll to finish
                    setTimeout(() => enquiryRef.current?.focus(), 450);
                  }}
                >
                  Book Free Consultation
                </Button>
                <Link href="/about-us">
                  <Button
                    variant="bordered"
                    size="lg"
                    className="font-medium text-white border-white"
                  >
                    Learn More About Us
                  </Button>{" "}
                </Link>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <EnquiryForm
                ref={enquiryRef}
                title="Get Started Today"
                subtitle="Fill out this form and our education experts will get back to you within 24 hours."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
              radial-gradient(circle 500px at 20% 80%, rgba(59,130,246,0.3), transparent),
              radial-gradient(circle 500px at 80% 20%, rgba(59,130,246,0.3), transparent)
            `,
            backgroundSize: "48px 48px, 48px 48px, 100% 100%, 100% 100%",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Student Success Stories</h2>
            <p className="text-foreground-500 max-w-2xl mx-auto">
              Hear from our students who have successfully achieved their
              international education goals with our guidance.
            </p>
          </div>

          <AnimatedTestimonials
            data={testimonials}
            className="py-8"
            cardClassName="bg-white/90 dark:bg-gray-800/90 shadow-lg backdrop-blur-sm"
          />

          <div className="mt-10 text-center">
            <Link href="testimonials">
              {" "}
              <Button
                color="primary"
                variant="flat"
                endContent={<Icon icon="lucide:arrow-right" />}
              >
                View More Success Stories
              </Button>{" "}
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Latest from Our Blog</h2>
              <p className="text-foreground-500">
                Insights and guides for international students
              </p>
            </div>
            <Link href="/blog">
              {" "}
              <Button
                variant="light"
                color="primary"
                endContent={<Icon icon="lucide:arrow-right" />}
                className="mt-4 md:mt-0"
              >
                View All Articles
              </Button>{" "}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.length > 0 ? (
              blogPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  imageId={post.imageId}
                  date={post.date}
                  author={post.author}
                  category={post.category}
                  readTime={post.readTime || "5 min read"}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-foreground-500 mb-4">
                  No blog posts available at the moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-default-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Our University Partners</h2>
            <p className="text-foreground-500 max-w-2xl mx-auto">
              We collaborate with leading universities and institutions
              worldwide to provide you with the best opportunities.
            </p>
          </div>

          <AnimatedLogosCanopy
            data={[
              {
                name: "Berlin School of Business and Innovation (BSBI), Berlin and Hamburg",
                logo: "https://student-cms.prd.timeshighereducation.com/sites/default/files/inline-images/BSBI%20NEW%20LOGO.png",
              },
              {
                name: "Toi Ohomai Institute of Technology, New Zealand",
                logo: "https://www.toiohomai.ac.nz/sites/default/files/images/uploaded/TOI%20OHOMAI%20WM_Wordmark%20B%20LT_RGB.jpg",
              },
              {
                name: "University of Alberta",
                logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmn5W_r8FMOFOWPDiP92kGfPXmkxM1u6PY9A&s",
              },
              {
                name: "Equals International, Australia",
                logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ78kFjobut3y6CACKTJmLhsBe6Tyf_vrLYFA&s",
              },
              {
                name: "University of New Haven, USA",
                logo: "https://upload.wikimedia.org/wikipedia/en/5/55/University_of_New_Haven_seal.png",
              },
              {
                name: "NEOMA Business School, France",
                logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/NEOMA_LOGOTYPE_RVB.jpg/1200px-NEOMA_LOGOTYPE_RVB.jpg",
              },
            ]}
            className="py-8"
            cardClassName="bg-white/90 dark:bg-gray-800/90"
            repeat={4}
          />

          <div className="mt-10 text-center">
            <Link href="/study-abroad">
              {" "}
              <Button
                color="primary"
                variant="flat"
                endContent={<Icon icon="lucide:arrow-right" />}
              >
                Explore All Partner Universities
              </Button>{" "}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
