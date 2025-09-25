"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { EnquiryForm } from "@/components/enquiry-form";

interface ContactClientProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const ContactClient: React.FC<ContactClientProps> = ({ faqs }) => {
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
              Get in <span className="text-gradient-primary">Touch</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xl text-foreground-600 mb-8"
            >
              Have questions about studying abroad? Our expert counselors are
              here to help you at every step of your journey.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16" id="contact-form">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="w-full lg:w-1/2"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Send Us a Message
              </h2>
              <p className="text-foreground-500 mb-8">
                Fill out the form below and our team will get back to you within
                24 hours.
              </p>

              <EnquiryForm title="" subtitle="" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-full lg:w-1/2 relative h-[450px] lg:h-[668px] rounded-xl overflow-hidden shadow-lg border border-default-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 via-transparent to-primary-400/10 z-10 pointer-events-none" />
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15718.385755436906!2d78.12247611802658!3d9.967494716978072!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c7cc2ecaecf3%3A0x5610bd9fc2fe6ea5!2sMagizh%20NexGen%20Technologies!5e0!3m2!1sen!2smx!4v1742384438780!5m2!1sen!2smx"
                className="absolute inset-0 w-full h-full border-0 bg-default-100"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps - Our Office Location"
                aria-label="Interactive map showing our office location"
                style={{ filter: "contrast(1.1) brightness(1.05)" }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-foreground-500 max-w-2xl mx-auto">
              Find answers to common questions about our services and the
              consultation process.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <Accordion>
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  aria-label={faq.question}
                  title={faq.question}
                  className="py-2"
                >
                  <p className="text-foreground-600 pb-2">{faq.answer}</p>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Begin Your International Education Journey?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Schedule a free consultation with our expert counselors to discuss
              your options and create a personalized plan.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                as={Link}
                href="#contact-form"
                color="default"
                variant="solid"
                size="lg"
                className="bg-white text-primary font-medium"
                startContent={<Icon icon="lucide:calendar" />}
              >
                Book Consultation
              </Button>
              <Button
                as="a"
                href="tel:+11234567890"
                color="default"
                variant="ghost"
                size="lg"
                className="text-white border-white font-medium"
                startContent={<Icon icon="lucide:phone" />}
              >
                Call Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};
