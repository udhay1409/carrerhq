"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Icon } from "@iconify/react";

import {
  CheckCircle2,
  Share2,
  ExternalLink,
  Star,
  Users,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { UniversalModule, ModuleType } from "@/types/universal-module";
import { EnquiryForm, EnquiryFormHandle } from "@/components/enquiry-form";
import { MODULE_DISPLAY_NAMES } from "@/types/universal-module";

interface ModuleDetailPageProps {
  moduleId: string;
  moduleType: ModuleType;
}

export default function ModuleDetailPage({
  moduleId,
  moduleType,
}: ModuleDetailPageProps) {
  const [module, setModule] = useState<UniversalModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const enquiryRef = useRef<EnquiryFormHandle | null>(null);

  const fetchModule = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/modules/${moduleId}`);
      if (response.ok) {
        const data = await response.json();
        setModule(data);
        setSelectedImage(data.coverImage);
      }
    } catch (error) {
      console.error("Error fetching module:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  const getImageUrl = (imageId: string, width = 1200, height = 800) => {
    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},h_${height},c_fill/${imageId}`;
  };

  const handleApplyNow = () => {
    enquiryRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <div className="text-center space-y-4">
          <Spinner size="lg" color="primary" />
          <p className="text-default-500">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <Card className="max-w-md">
          <CardBody className="text-center py-12">
            <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink size={24} className="text-danger-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">Content not found</h2>
            <p className="text-default-500 mb-6">
              The requested content could not be found or may have been removed.
            </p>
            <Link href={`/${moduleType}`}>
              <Button color="primary" variant="solid">
                Back to {MODULE_DISPLAY_NAMES[moduleType]}
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      {/* Hero Section */}
      <div className="relative pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Chip
                    color="primary"
                    variant="shadow"
                    startContent={<Sparkles size={14} />}
                    className="font-semibold"
                  >
                    {module.category}
                  </Chip>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent leading-tight">
                  {module.title}
                </h1>

                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                  {module.shortDescription}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 py-6 border-y border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Star size={16} className="text-yellow-500" />
                  <span className="text-sm font-medium">Featured</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span className="text-sm font-medium">
                    {module.highlights.length} Key Points
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button
                  as={Link}
                  href={`/${moduleType}`}
                  size="lg"
                  color="primary"
                  variant="shadow"
                  startContent={<ArrowLeft size={18} />}
                  className="font-semibold"
                >
                  Back to {MODULE_DISPLAY_NAMES[moduleType]}
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={getImageUrl(selectedImage)}
                  alt={module.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full blur-xl opacity-60"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-xl opacity-40"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Gallery */}
            {module.galleryImages && module.galleryImages.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div
                    className={`relative aspect-square cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
                      selectedImage === module.coverImage
                        ? "ring-4 ring-primary-400 shadow-xl scale-105"
                        : "hover:scale-105 hover:shadow-lg"
                    }`}
                    onClick={() => setSelectedImage(module.coverImage)}
                  >
                    <Image
                      src={getImageUrl(module.coverImage, 300, 300)}
                      alt="Cover"
                      fill
                      className="object-cover"
                    />
                  </div>
                  {module.galleryImages.map((imageId, index) => (
                    <div
                      key={index}
                      className={`relative aspect-square cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
                        selectedImage === imageId
                          ? "ring-4 ring-primary-400 shadow-xl scale-105"
                          : "hover:scale-105 hover:shadow-lg"
                      }`}
                      onClick={() => setSelectedImage(imageId)}
                    >
                      <Image
                        src={getImageUrl(imageId, 300, 300)}
                        alt={`Gallery ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
            {/* About Section */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Detailed Overview
              </h2>
              <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl">
                <CardBody className="p-8">
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed text-lg">
                    {module.detailedDescription}
                  </p>
                </CardBody>
              </Card>
            </section>
            {/* Key Highlights */}
            {module.highlights && module.highlights.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Key Highlights
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {module.highlights.map((highlight, index) => (
                    <Card
                      key={index}
                      className="border-0 shadow-md bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl"
                    >
                      <CardBody className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 size={16} className="text-white" />
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {highlight}
                          </p>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </section>
            )}{" "}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Custom Fields */}
            {module.customFields && module.customFields.length > 0 && (
              <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl">
                <CardBody className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                    Quick Details
                  </h3>
                  <div className="space-y-4">
                    {module.customFields.map((field, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 py-2 border-b border-slate-200 dark:border-slate-700 last:border-0"
                      >
                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium break-words">
                          {field.key}
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white break-words sm:text-right">
                          {field.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Contact Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white">
              <CardBody className="p-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                    <Users size={24} />
                  </div>
                  <h3 className="text-xl font-bold">Ready to Apply?</h3>
                  <p className="text-primary-100">
                    Take the next step towards your future. Our team is here to
                    guide you through the process.
                  </p>
                  <div className="space-y-3 pt-4">
                    <Button
                      size="lg"
                      variant="solid"
                      className="w-full bg-white text-primary-600 font-semibold hover:bg-primary-50"
                      startContent={<ExternalLink size={18} />}
                      onPress={handleApplyNow}
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Share Card */}
            <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl">
              <CardBody className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Share This Opportunity
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  Help others discover this amazing opportunity
                </p>
                <div className="space-y-3">
                  <Button
                    variant="flat"
                    color="primary"
                    className="w-full"
                    startContent={<Share2 size={16} />}
                  >
                    Share Link
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
      <section className="py-16 bg-gradient-to-r from-primary-500 to-secondary-500 text-white ">
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
                subtitle="Fill out this form and our experts will get back to you within 24 hours."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
