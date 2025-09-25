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
  const team = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Founder & CEO",
      bio: "With over 20 years of experience in international education, Dr. Kumar has helped thousands of students achieve their study abroad dreams.",
      avatarId:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    },
    {
      name: "Sarah Williams",
      role: "Head of Counseling",
      bio: "Former admissions officer at a top UK university with expertise in helping students craft compelling applications.",
      avatarId:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    },
    {
      name: "David Chen",
      role: "Visa Specialist",
      bio: "Immigration expert with a 98% success rate in student visa applications across multiple countries.",
      avatarId:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    },
    {
      name: "Priya Sharma",
      role: "University Relations",
      bio: "Manages partnerships with over 500 universities worldwide to provide exclusive opportunities for our students.",
      avatarId:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    },
  ];

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
  const milestones = [
    {
      year: "2005",
      title: "Foundation",
      description:
        "CareerHQ was established with a mission to help students achieve their international education dreams.",
    },
    {
      year: "2010",
      title: "Expansion",
      description:
        "Opened offices in 5 major cities and expanded our university network to over 200 institutions.",
    },
    {
      year: "2015",
      title: "Recognition",
      description:
        'Received the "Best Education Consultant" award and reached the milestone of 5,000 successful placements.',
    },
    {
      year: "2020",
      title: "Digital Transformation",
      description:
        "Launched our comprehensive online platform to provide seamless services to students worldwide.",
    },
    {
      year: "2023",
      title: "Global Reach",
      description:
        "Expanded to 10 countries with a network of over 500 universities and 10,000+ successful placements.",
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
      <section className="relative bg-gradient-to-b from-primary-50 to-white py-16 md:py-24">
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-foreground-600 mb-4">
                Founded in 2005, CareerHQ began with a simple mission: to help
                students navigate the complex process of studying abroad and
                building successful international careers.
              </p>
              <p className="text-foreground-600 mb-4">
                What started as a small counseling center has now grown into a
                global education consultancy with offices in multiple countries,
                helping thousands of students achieve their dreams of
                international education.
              </p>
              <p className="text-foreground-600 mb-6">
                Our team of experienced counselors, many of whom have studied
                abroad themselves, provide personalized guidance to students at
                every step of their journey – from choosing the right university
                and program to securing scholarships and navigating visa
                processes.
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
                <Button
                  variant="flat"
                  color="primary"
                  as={Link}
                  href="/study-abroad"
                >
                  Explore Programs
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/19871.jpg"
                  alt="CareerHQ Office"
                  width={800}
                  height={600}
                  className="w-full h-[450px] object-cover"
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
                  To empower students with the guidance, resources, and support
                  they need to access quality international education
                  opportunities and build successful global careers.
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
                  To be the most trusted global education consultancy, known for
                  our student-centric approach, integrity, and excellence in
                  helping students achieve their international education and
                  career goals.
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

      {/* Our Team Section */}
      <section className="py-16 bg-default-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Meet Our Team</h2>
            <p className="text-foreground-500 max-w-2xl mx-auto">
              Experienced professionals dedicated to helping you achieve your
              international education goals
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="border border-default-200">
                <CardBody className="p-0">
                  <div className="h-64 overflow-hidden">
                    <Image
                      src={member.avatarId}
                      alt={member.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary text-sm mb-3">{member.role}</p>
                    <p className="text-foreground-500 text-sm">{member.bio}</p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Our Journey</h2>
            <p className="text-foreground-500 max-w-2xl mx-auto">
              Key milestones in our mission to empower students globally
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-primary-200"></div>

            {/* Timeline items */}
            <div className="relative z-10">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center mb-12 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="md:w-1/2 flex justify-end md:pr-8">
                    <div
                      className={`w-full md:max-w-md ${
                        index % 2 === 0 ? "md:text-right" : "md:text-left"
                      }`}
                    >
                      <div className="bg-primary-100 text-primary font-bold py-1 px-4 rounded-full inline-block mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-foreground-500">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center my-4 md:my-0 z-10">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>

                  <div className="md:w-1/2 md:pl-8">
                    {index % 2 === 0 ? null : (
                      <div className="w-full md:max-w-md">
                        <div className="bg-primary-100 text-primary font-bold py-1 px-4 rounded-full inline-block mb-2 md:hidden">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-semibold mb-2 md:hidden">
                          {milestone.title}
                        </h3>
                        <p className="text-foreground-500 md:hidden">
                          {milestone.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-default-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">What Our Students Say</h2>
            <p className="text-foreground-500 max-w-2xl mx-auto">
              Hear from students who have successfully achieved their
              international education goals with our guidance
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
                Start Your International Education Journey Today
              </h2>
              <p className="text-white/90 mb-6">
                Our expert counselors are ready to guide you through every step
                of the process. Schedule a free consultation today.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  as={Link}
                  href="/contact"
                  color="default"
                  variant="solid"
                  size="lg"
                  startContent={<Icon icon="lucide:calendar" />}
                  className="font-medium bg-white text-primary"
                >
                  Book Free Consultation
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
                subtitle="Fill out this form and our education experts will get back to you within 24 hours."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
