"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { getImageUrl as getCloudinaryImageUrl } from "@/lib/cloudinary-utils";
import { generateCountrySlug, generateUniversitySlug } from "@/lib/slug-utils";

interface UniversityCardProps {
  id: string;
  name: string;
  location: string;
  imageId: string;
  country: string; // Changed from countryId to country (country name)
  ranking?: number;
  courses: number;
  tags?: string[];
}

export const UniversityCard: React.FC<UniversityCardProps> = ({
  id: _id,
  name,
  location,
  imageId,
  country,
  ranking,
  courses,
  tags = [],
}) => {
  // Get the proper image URL using the existing Cloudinary utility
  const imageUrl = imageId
    ? getCloudinaryImageUrl(imageId, "card")
    : "/images/university-placeholder.svg";
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden border border-default-200">
        <CardBody className="p-0">
          <div className="relative h-40 overflow-hidden">
            <Image
              src={imageUrl}
              alt={`${name} campus`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/university-placeholder.svg";
              }}
            />
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold line-clamp-2">{name}</h3>
              {ranking && (
                <Chip
                  color="primary"
                  variant="flat"
                  size="sm"
                  startContent={
                    <Icon icon="lucide:award" className="text-xs" />
                  }
                >
                  Rank #{ranking}
                </Chip>
              )}
            </div>

            <div className="flex items-center gap-1 text-foreground-500 mb-3">
              <Icon icon="lucide:map-pin" className="text-sm" />
              <span className="text-sm">{location}</span>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              {tags && tags.length > 0
                ? tags.map((tag, index) => (
                    <Chip key={index} size="sm" variant="flat" color="default">
                      {tag}
                    </Chip>
                  ))
                : null}
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1">
                <Icon icon="lucide:book-open" className="text-primary" />
                <span className="text-sm">{courses} Courses</span>
              </div>
            </div>

            <Button
              as={Link}
              href={`/study-abroad/${generateCountrySlug(
                country
              )}/${generateUniversitySlug(name)}`}
              color="primary"
              fullWidth
              endContent={<Icon icon="lucide:arrow-right" />}
            >
              View Courses
            </Button>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};
