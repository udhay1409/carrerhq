"use client";

import React from "react";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { submitContactForm } from "@/lib/api-client";

interface EnquiryFormProps {
  variant?: "default" | "compact";
  title?: string;
  subtitle?: string;
}

export type EnquiryFormHandle = {
  focus: () => void;
  scrollIntoView: (options?: ScrollIntoViewOptions) => void;
};

export const EnquiryForm = React.forwardRef<
  EnquiryFormHandle,
  EnquiryFormProps
>(
  (
    {
      variant = "default",
      title = "Get Expert Guidance",
      subtitle = "Fill out the form below and our education consultants will get back to you within 24 hours.",
    },
    ref
  ) => {
    const rootRef = React.useRef<HTMLDivElement | null>(null);

    React.useImperativeHandle(ref, () => ({
      focus: () => {
        const el =
          rootRef.current?.querySelector<HTMLInputElement>(
            'input[name="name"]'
          );
        if (el) el.focus();
      },
      scrollIntoView: (options?: ScrollIntoViewOptions) => {
        rootRef.current?.scrollIntoView(options);
      },
    }));

    const [formData, setFormData] = React.useState({
      name: "",
      email: "",
      phone: "",
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setIsSubmitting(true);

      try {
        await submitContactForm({
          contact_name: formData.name,
          contact_email: formData.email,
          contact_phone: formData.phone.startsWith("+91")
            ? formData.phone
            : `+91${formData.phone}`,
        });

        setIsSubmitted(true);
        // Reset form after showing success message
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
          });
        }, 3000);
      } catch (err) {
        setError("Failed to submit form. Please try again.");
        console.error("Form submission error:", err);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div ref={rootRef}>
        <Card className="border border-default-200">
          <CardBody className={variant === "compact" ? "p-4" : "p-6"}>
            {!isSubmitted ? (
              <>
                <div className="mb-6">
                  <h3
                    className={`font-semibold ${
                      variant === "compact" ? "text-lg" : "text-xl"
                    } mb-2`}
                  >
                    {title}
                  </h3>
                  <p className="text-foreground-500">{subtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    isRequired
                    startContent={
                      <Icon icon="lucide:user" className="text-default-400" />
                    }
                  />

                  <Input
                    label="Email"
                    placeholder="Enter your email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    isRequired
                    startContent={
                      <Icon icon="lucide:mail" className="text-default-400" />
                    }
                  />

                  <Input
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    isRequired
                    startContent={
                      <Icon icon="lucide:phone" className="text-default-400" />
                    }
                  />

                  {error && <div className="text-danger text-sm">{error}</div>}

                  <Button
                    type="submit"
                    color="primary"
                    className="w-full font-medium"
                    isLoading={isSubmitting}
                    isDisabled={isSubmitting}
                    startContent={!isSubmitting && <Icon icon="lucide:send" />}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-8"
              >
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                  <Icon icon="lucide:check" className="text-success text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                <p className="text-center text-foreground-500 mb-4">
                  Your enquiry has been submitted successfully. Our team will
                  contact you shortly.
                </p>
              </motion.div>
            )}
          </CardBody>
        </Card>
      </div>
    );
  }
);

EnquiryForm.displayName = "EnquiryForm";
