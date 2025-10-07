import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Icon } from "@iconify/react";

import { TestimonialCard } from "@/components/testimonial-card";
import { EnquiryForm } from "@/components/enquiry-form";

export const metadata: Metadata = {
  title: "About Us - Career HQ",
  description:
    "Learn about CareerHQ's mission to empower students with international education opportunities. Founded in 2005, we've helped 10,000+ students achieve their study abroad dreams.",
  keywords: [
    "about career hq",
    "study abroad consultancy",
    "international education",
    "education counselors",
  ],
  openGraph: {
    title: "About CareerHQ - Your Study Abroad Partner",
    description:
      "Empowering students to achieve their international education and career aspirations since 2005.",
    images: ["/images/about-hero.jpg"],
  },
};

export default function AboutPage() {
  const values = [
    {
      title: "Student-Centric Approach",
      description:
        "We prioritize the unique needs and goals of each student, providing personalized guidance throughout their journey.",
      icon: "lucide:users",
    },
    {
      title: "Integrity & Transparency",
      description:
        "We provide honest advice and maintain complete transparency in our processes and fee structures.",
      icon: "lucide:shield",
    },
    {
      title: "Excellence",
      description:
        "We strive for excellence in all our services, continuously improving to deliver the best outcomes for our students.",
      icon: "lucide:award",
    },
    {
      title: "Global Perspective",
      description:
        "We embrace diversity and foster a global mindset, helping students become successful global citizens.",
      icon: "lucide:globe",
    },
  ];
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "MBA Student, Harvard Business School",
      content:
        "CareerHQ made my dream of studying at Harvard a reality. Their counselors provided personalized guidance throughout the application process, helping me secure a scholarship as well.",
      avatarId:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      rating: 5,
    },
    {
      name: "James Wilson",
      role: "Engineering Student, University of Toronto",
      content:
        "I was overwhelmed by the options until I found CareerHQ. They simplified the process and helped me find the perfect engineering program that matched my career goals.",
      avatarId:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
    },
    {
      name: "Mei Lin",
      role: "Computer Science Student, University of Melbourne",
      content:
        "The visa application process seemed daunting, but CareerHQ&apos;s step-by-step guidance made it straightforward. I&apos;m now thriving in my program in Australia!",
      avatarId:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 4,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-50 to-white py-16 ">
        <div className="absolute inset-0 hero-pattern opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-gradient-primary">CareerHQ</span>
            </h1>
            <p className="text-xl text-foreground-600 mb-8">
              Empowering students to achieve their international education and
              career aspirations since 2005.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-foreground-600 mb-4">
                CareerHQ began with a simple vision – to make global education
                and career guidance accessible to every student. What started as
                a small counseling center has now evolved into a trusted global
                education consultancy, connecting worldwide career at one dot.
              </p>
              <p className="text-foreground-600 mb-4">
                Over the years, we’ve helped thousands of students turn their
                dream of studying abroad into reality. With offices across
                multiple countries, CareerHQ bridges students with top
                universities and international career opportunities around the
                world.
              </p>
              <p className="text-foreground-600 mb-6">
                Our team of expert counselors – many of whom have experienced
                studying abroad themselves – provide end-to-end guidance, from
                choosing the right course and university to securing
                scholarships and handling visa procedures.
              </p>
              <p className="text-foreground-600 mb-6">
                At CareerHQ, we believe in more than just admissions; we believe
                in connecting students to a world of limitless career
                possibilities, all at one dot.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  color="primary"
                  endContent={<Icon icon="lucide:arrow-right" />}
                  as={Link}
                  href="/contact"
                >
                  Contact Us
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/19871.jpg"
                  alt="CareerHQ Office"
                  width={400}
                  height={200}
                  className="w-full h-[420px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary-100 rounded-full z-0"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-100 rounded-full z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-default-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Our Mission & Vision</h2>
            <p className="text-foreground-500 max-w-2xl mx-auto">
              Guiding principles that drive everything we do at CareerHQ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border border-default-200">
              <CardBody className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <Icon icon="lucide:target" className="text-primary text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
                <p className="text-foreground-600">
                  Our mission is to empower students to explore global
                  opportunities with confidence by providing the right guidance,
                  resources, and personalized support. We aim to simplify the
                  path to international education and career success –
                  connecting worldwide career at one dot through trust,
                  knowledge, and continuous support.
                </p>
              </CardBody>
            </Card>

            <Card className="border border-default-200">
              <CardBody className="p-6">
                <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center mb-4">
                  <Icon icon="lucide:eye" className="text-secondary text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
                <p className="text-foreground-600">
                  Our vision is to become the most trusted global platform for
                  international education and career connection, recognized for
                  our integrity, innovation, and student-first approach. We
                  aspire to create a world where every student can easily
                  connect to global education and career possibilities – all at
                  one dot.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Our Core Values</h2>
            <p className="text-foreground-500 max-w-2xl mx-auto">
              The principles that guide our approach and define our culture
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border border-default-200 h-full">
                <CardBody className="p-6">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                    <Icon icon={value.icon} className="text-primary text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-foreground-500">{value.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-default-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">What Our Students Say</h2>
            <p className="text-foreground-500 max-w-2xl mx-auto">
              Hear from our students who have successfully achieved their career
              goals with our guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index}>
                <TestimonialCard
                  name={testimonial.name}
                  role={testimonial.role}
                  content={testimonial.content}
                  avatarId={testimonial.avatarId}
                  rating={testimonial.rating}
                />
              </div>
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
                Connecting worldwide career in one dot
              </h2>
              <p className="text-white/90 mb-6">
                One destination, countless opportunities – where worldwide
                careers meet at one dot .
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  as={Link}
                  href="/career-test"
                  color="default"
                  variant="solid"
                  size="lg"
                  startContent={<Icon icon="lucide:calendar" />}
                  className="font-medium bg-white text-primary"
                >
                  Begin Test
                </Button>
                <Button
                  as={Link}
                  href="/study-abroad"
                  variant="bordered"
                  size="lg"
                  className="font-medium text-white border-white"
                >
                  Explore Programs
                </Button>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <EnquiryForm
                title="Get Expert Guidance"
                subtitle="Fill out this form and our experts will get back to you within 24 hours."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
