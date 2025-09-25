import { Metadata } from "next";
import { ContactClient } from "./contact-client";

export const metadata: Metadata = {
  title: "Contact Us - Career HQ",
  description:
    "Get in touch with CareerHQ's expert education counselors. Schedule a free consultation to discuss your study abroad options and get personalized guidance.",
  keywords: [
    "contact career hq",
    "study abroad consultation",
    "education counseling",
    "free consultation",
    "study abroad help",
  ],
  openGraph: {
    title: "Contact CareerHQ - Get Expert Study Abroad Guidance",
    description:
      "Schedule a free consultation with our expert counselors to discuss your international education options.",
    images: ["/images/contact-hero.jpg"],
  },
};

export default function ContactPage() {
  const faqs = [
    {
      question: "What services does CareerHQ provide?",
      answer:
        "CareerHQ offers comprehensive study abroad services including university selection, application assistance, visa guidance, scholarship information, pre-departure orientation, and post-arrival support.",
    },
    {
      question: "How much do your services cost?",
      answer:
        "Our service fees vary depending on the specific services you require. We offer free initial consultations to understand your needs and provide transparent fee information. We also offer scholarship guidance that can help offset the cost of education.",
    },
    {
      question: "How early should I start the application process?",
      answer:
        "We recommend starting the process at least 12-18 months before your intended start date. This gives ample time for research, standardized tests, application preparation, visa processing, and pre-departure arrangements.",
    },
    {
      question: "Do you guarantee admission to my preferred university?",
      answer:
        "While we cannot guarantee admissions, our experienced counselors help you identify universities where you have strong chances of acceptance based on your academic profile and other factors. Our high success rate is based on strategic university selection and strong application preparation.",
    },
    {
      question: "Can you help with scholarship applications?",
      answer:
        "Yes, we provide comprehensive scholarship guidance including identifying suitable opportunities, application preparation, and interview coaching for scholarship candidates.",
    },
  ];

  return <ContactClient faqs={faqs} />;
}
