"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { generateCountrySlug } from "@/lib/slug-utils";
import type { Country, Course } from "@/types/education";

interface SearchBarProps {
  variant?: "default" | "hero";
}

export const SearchBar: React.FC<SearchBarProps> = ({
  variant = "default",
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchParams, setSearchParams] = React.useState({
    country: "",
    course: "",
  });
  const [countries, setCountries] = React.useState<Country[]>([]);
  const [courses, setCourses] = React.useState<
    Array<{ label: string; value: string }>
  >([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch countries and courses data
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [countriesRes, coursesRes] = await Promise.all([
          fetch("/api/countries"),
          fetch("/api/courses?limit=50"),
        ]);

        const [countriesData, coursesData] = await Promise.all([
          countriesRes.json(),
          coursesRes.json(),
        ]);

        if (countriesData.countries) {
          setCountries(countriesData.countries);
        }

        if (coursesData.courses) {
          // Extract unique study levels and program names for course options
          const uniqueCourses = new Set<string>();
          coursesData.courses.forEach((course: Course) => {
            uniqueCourses.add(course.studyLevel);
            uniqueCourses.add(course.programName);
          });

          const courseOptions = Array.from(uniqueCourses).map((course) => ({
            label: course,
            value: course.toLowerCase().replace(/\s+/g, "-"),
          }));

          setCourses(courseOptions);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Courses are now fetched from API

  const handleSearch = () => {
    if (searchParams.country) {
      // Find the country by ID to get its name
      const selectedCountry = countries.find(
        (c) => c.id === searchParams.country
      );
      if (selectedCountry) {
        const countrySlug = generateCountrySlug(selectedCountry.name);
        router.push(`/study-abroad/${countrySlug}`);
      } else {
        // Fallback to the original value if country not found
        router.push(`/study-abroad/${searchParams.country}`);
      }
    } else {
      router.push("/study-abroad");
    }
    setIsOpen(false);
  };

  const handleSelectChange = (value: string, name: string) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  if (variant === "hero") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-white rounded-lg p-4 shadow-lg border border-default-200 w-full max-w-9xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Country"
            placeholder="Select country"
            selectedKeys={searchParams.country ? [searchParams.country] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              handleSelectChange(value, "country");
            }}
            startContent={
              <Icon icon="lucide:globe" className="text-default-400" />
            }
            isLoading={loading}
          >
            {countries.map((country) => (
              <SelectItem key={country.id}>{country.name}</SelectItem>
            ))}
          </Select>

          <Select
            label="Course"
            placeholder="Select course"
            selectedKeys={searchParams.course ? [searchParams.course] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              handleSelectChange(value, "course");
            }}
            startContent={
              <Icon icon="lucide:book-open" className="text-default-400" />
            }
            isLoading={loading}
          >
            {courses.map((course) => (
              <SelectItem key={course.value}>{course.label}</SelectItem>
            ))}
          </Select>

          <Button
            color="primary"
            className="w-full h-full"
            onPress={handleSearch}
            startContent={<Icon icon="lucide:search" />}
          >
            Search
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom">
        <PopoverTrigger>
          <Input
            placeholder="Search countries or courses..."
            startContent={
              <Icon icon="lucide:search" className="text-default-400" />
            }
            endContent={
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={() => setIsOpen(true)}
              >
                <Icon icon="lucide:sliders" className="text-default-500" />
              </Button>
            }
            className="w-full"
          />
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Advanced Search</h3>

            <Select
              label="Country"
              placeholder="Select country"
              selectedKeys={searchParams.country ? [searchParams.country] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                handleSelectChange(value, "country");
              }}
              size="sm"
              isLoading={loading}
            >
              {countries.map((country) => (
                <SelectItem key={country.id}>{country.name}</SelectItem>
              ))}
            </Select>

            <Select
              label="Course"
              placeholder="Select course"
              selectedKeys={searchParams.course ? [searchParams.course] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                handleSelectChange(value, "course");
              }}
              size="sm"
              isLoading={loading}
            >
              {courses.map((course) => (
                <SelectItem key={course.value}>{course.label}</SelectItem>
              ))}
            </Select>

            <Button
              color="primary"
              size="sm"
              className="w-full"
              onPress={handleSearch}
            >
              Search
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
