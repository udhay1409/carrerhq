"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { getImageUrl as getCloudinaryImageUrl } from "@/lib/cloudinary-utils";
import { generateCountrySlug } from "@/lib/slug-utils";
interface CountryCardProps {
  id: string;
  name: string;
  imageId: string;
  flagImageId?: string;
  universities: number;
  courses: number;
  flagCode?: string;
  code?: string;
}

export const CountryCard: React.FC<CountryCardProps> = ({
  id: _id,
  name,
  imageId,
  universities,
  courses,
  code: _code,
  flagImageId,
}) => {
  // Get the proper image URL using the existing Cloudinary utility
  const imageUrl = imageId
    ? getCloudinaryImageUrl(imageId, "card")
    : "/images/country-placeholder.svg";
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Link href={`/study-abroad/${generateCountrySlug(name)}`}>
        <Card className="overflow-hidden border border-default-200 cursor-pointer hover:shadow-lg transition-shadow">
          <CardBody className="p-0">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <div className="flex items-center gap-3 w-full">
                  <Image
                    src={
                      flagImageId
                        ? getCloudinaryImageUrl(flagImageId, "thumbnail")
                        : "/images/flag-placeholder.svg"
                    }
                    alt={`${name} flag`}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                    width={32}
                    height={24}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/flag-placeholder.svg";
                    }}
                  />
                  <h3 className="text-white text-xl font-semibold">{name}</h3>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:building" className="text-primary" />
                  <span className="text-sm">{universities} Universities</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:book-open" className="text-primary" />
                  <span className="text-sm">{courses} Courses</span>
                </div>
              </div>
              <Button
                color="primary"
                variant="flat"
                fullWidth
                endContent={<Icon icon="lucide:arrow-right" />}
              >
                Explore Options
              </Button>
            </div>
          </CardBody>
        </Card>
      </Link>
    </motion.div>
  );
};
