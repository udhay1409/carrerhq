"use client";
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { addToast } from "@heroui/toast";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseDetails: {
    country: string;
    university: string;
    programName: string;
  };
}

export function ApplicationModal({
  isOpen,
  onClose,
  courseDetails,
}: ApplicationModalProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    qualification: "",
    ieltsScore: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Save lead to database
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone.startsWith("+91")
            ? formData.phone
            : `+91${formData.phone}`,
          country: courseDetails.country,
          university: courseDetails.university,
          program: courseDetails.programName,
          qualification: formData.qualification,
          ieltsScore: formData.ieltsScore,
          message: formData.message,
        }),
      });

      // Show success toast
      addToast({
        title: "Application submitted successfully!",
        description: "Our team will contact you shortly.",
        color: "success",
      });

      // Clear form fields
      setFormData({
        name: "",
        email: "",
        phone: "",
        qualification: "",
        ieltsScore: "",
        message: "",
      });

      onClose();
    } catch (_err) {
      setError("Failed to submit application. Please try again.");
      addToast({
        title: "Failed to submit application",
        description: "Please try again or contact support.",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-semibold">Apply Now</h3>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              isRequired
            />

            <Input
              label="Email ID"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              isRequired
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              isRequired
            />

            <Input
              label="Country"
              value={courseDetails.country}
              isReadOnly
              isDisabled
            />

            <Input
              label="University"
              value={courseDetails.university}
              isReadOnly
              isDisabled
            />

            <Input
              label="Program Name"
              value={courseDetails.programName}
              isReadOnly
              isDisabled
            />

            <Input
              label="Current Qualification"
              placeholder="Enter your current qualification"
              value={formData.qualification}
              onChange={(e) =>
                setFormData({ ...formData, qualification: e.target.value })
              }
              isRequired
            />

            <Input
              label="IELTS Score"
              placeholder="Enter your IELTS score"
              value={formData.ieltsScore}
              onChange={(e) =>
                setFormData({ ...formData, ieltsScore: e.target.value })
              }
            />

            <Textarea
              label="Message"
              placeholder="Any additional information..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />

            {error && <div className="text-danger text-sm">{error}</div>}

            <div className="flex justify-end gap-3">
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                isLoading={isSubmitting}
                startContent={!isSubmitting && <Icon icon="lucide:send" />}
              >
                Submit Application
              </Button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
