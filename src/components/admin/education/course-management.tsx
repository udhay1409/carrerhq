"use client";

import { useState, useEffect, useCallback } from "react"; // Add useCallback import
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { Spinner } from "@heroui/spinner";
import { useDisclosure } from "@heroui/use-disclosure";
import { Select, SelectItem } from "@heroui/select";
import { Textarea } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { Pagination } from "@heroui/pagination";

import { Plus, Edit, Trash2, Globe, Search } from "lucide-react";
import type {
  Course,
  University,
  Country,
  CreateCourseData,
} from "@/types/education";

interface CoursesResponse {
  courses: Course[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function CourseManagement() {
  const [coursesData, setCoursesData] = useState<CoursesResponse>({
    courses: [],
    pagination: { page: 1, limit: 20, total: 0, pages: 0 },
  });
  const [universities, setUniversities] = useState<University[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState<CreateCourseData>({
    universityId: "",
    countryId: "",
    programName: "",
    studyLevel: "Postgraduate",
    campus: "",
    duration: "",
    openIntakes: "",
    intakeYear: new Date().getFullYear().toString(),
    entryRequirements: "",
    ieltsScore: 6.5,
    ieltsNoBandLessThan: 6.0,
    pteScore: undefined,
    pteNoBandLessThan: undefined,
    toeflScore: undefined,
    duolingo: undefined,
    gmatScore: undefined,
    greScore: undefined,
    yearlyTuitionFees: "",
    currency: "USD",
    applicationDeadline: "",
    workExperience: "",
    scholarships: [],
    careerProspects: [],
    accreditation: [],
    specializations: [],
    published: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  // Move fetchCourses definition before useEffect and wrap it in useCallback
  const fetchCourses = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        populate: "true",
      });

      if (searchTerm) params.append("search", searchTerm);
      if (selectedCountry) params.append("countryId", selectedCountry);
      if (selectedUniversity) params.append("universityId", selectedUniversity);

      params.append("includeUnpublished", "true");
      const response = await fetch(`/api/courses?${params}`);
      const data = await response.json();
      setCoursesData(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, [currentPage, searchTerm, selectedCountry, selectedUniversity]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]); // Only depend on fetchCourses since its dependencies are handled internally

  // Track unsaved changes
  useEffect(() => {
    if (selectedCourse) {
      const hasChanges =
        formData.universityId !== selectedCourse.universityId ||
        formData.countryId !== selectedCourse.countryId ||
        formData.programName !== selectedCourse.programName ||
        formData.studyLevel !== selectedCourse.studyLevel ||
        formData.campus !== selectedCourse.campus ||
        formData.duration !== selectedCourse.duration ||
        formData.openIntakes !== selectedCourse.openIntakes ||
        formData.intakeYear !== selectedCourse.intakeYear.toString() ||
        formData.entryRequirements !== selectedCourse.entryRequirements ||
        formData.ieltsScore !== selectedCourse.ieltsScore ||
        formData.ieltsNoBandLessThan !== selectedCourse.ieltsNoBandLessThan ||
        formData.yearlyTuitionFees !== selectedCourse.yearlyTuitionFees ||
        formData.currency !== selectedCourse.currency;

      setHasUnsavedChanges(hasChanges);
    } else {
      // For new courses, check if any required field has content
      const hasContent =
        formData.programName.trim() !== "" ||
        formData.universityId !== "" ||
        formData.countryId !== "";

      setHasUnsavedChanges(hasContent);
    }
  }, [formData, selectedCourse]);

  const fetchData = async () => {
    try {
      const [universitiesRes, countriesRes] = await Promise.all([
        fetch("/api/universities?populate=true"),
        fetch("/api/countries"),
      ]);

      const [universitiesData, countriesData] = await Promise.all([
        universitiesRes.json(),
        countriesRes.json(),
      ]);

      setUniversities(universitiesData.universities || []);
      setCountries(countriesData.countries || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const url = selectedCourse
        ? `/api/courses/${selectedCourse.id}`
        : "/api/courses";
      const method = selectedCourse ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setHasUnsavedChanges(false);
        await fetchCourses();
        handleCloseModal();
        addToast({
          title: selectedCourse
            ? "Course updated successfully!"
            : "Course created successfully!",
          color: "success",
        });
      } else {
        const error = await response.json();
        addToast({
          title: error.error || "Failed to save course",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Error saving course:", error);
      addToast({
        title: "Failed to save course",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCourse) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/courses/${selectedCourse.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCourses();
        onDeleteClose();
        setSelectedCourse(null);
        addToast({
          title: "Course deleted successfully!",
          color: "success",
        });
      } else {
        const error = await response.json();
        addToast({
          title: error.error || "Failed to delete course",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      addToast({
        title: "Failed to delete course",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePublishStatus = async (course: Course) => {
    try {
      const response = await fetch(`/api/courses/${course.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...course,
          published: !course.published,
        }),
      });

      if (response.ok) {
        await fetchCourses();
        addToast({
          title: `Course ${
            !course.published ? "published" : "unpublished"
          } successfully!`,
          color: "success",
        });
      } else {
        const error = await response.json();
        addToast({
          title: error.error || "Failed to update course status",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Error updating course status:", error);
      addToast({
        title: "Failed to update course status",
        color: "danger",
      });
    }
  };

  const handleEdit = (course: Course) => {
    console.log("Editing course:", course);
    console.log("Course countryId:", course.countryId);
    console.log("Course universityId:", course.universityId);
    console.log(
      "Available countries:",
      countries.map((c) => ({ id: c.id, name: c.name }))
    );
    console.log(
      "Available universities:",
      universities.map((u) => ({ id: u.id, name: u.name }))
    );

    setSelectedCourse(course);
    setFormData({
      universityId: course.universityId,
      countryId: course.countryId,
      programName: course.programName,
      studyLevel: course.studyLevel,
      campus: course.campus,
      duration: course.duration,
      openIntakes: course.openIntakes,
      intakeYear: course.intakeYear.toString(),
      entryRequirements: course.entryRequirements,
      ieltsScore: course.ieltsScore,
      ieltsNoBandLessThan: course.ieltsNoBandLessThan,
      pteScore: course.pteScore,
      pteNoBandLessThan: course.pteNoBandLessThan,
      toeflScore: course.toeflScore,
      duolingo: course.duolingo,
      gmatScore: course.gmatScore,
      greScore: course.greScore,
      yearlyTuitionFees: course.yearlyTuitionFees,
      currency: course.currency || "USD",
      applicationDeadline: course.applicationDeadline || "",
      workExperience: course.workExperience || "",
      scholarships: course.scholarships || [],
      careerProspects: course.careerProspects || [],
      accreditation: course.accreditation || [],
      specializations: course.specializations || [],
      published: course.published ?? true,
    });
    onOpen();
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setHasUnsavedChanges(false);
    setFormData({
      universityId: "",
      countryId: "",
      programName: "",
      studyLevel: "Postgraduate",
      campus: "",
      duration: "",
      openIntakes: "",
      intakeYear: new Date().getFullYear().toString(),
      entryRequirements: "",
      ieltsScore: 6.5,
      ieltsNoBandLessThan: 6.0,
      pteScore: undefined,
      pteNoBandLessThan: undefined,
      toeflScore: undefined,
      duolingo: undefined,
      gmatScore: undefined,
      greScore: undefined,
      yearlyTuitionFees: "",
      currency: "USD",
      applicationDeadline: "",
      workExperience: "",
      scholarships: [],
      careerProspects: [],
      accreditation: [],
      specializations: [],
    });
    onClose();
  };

  const filteredUniversities = universities.filter(
    (uni) => !selectedCountry || uni.countryId === selectedCountry
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Courses</h2>
        <Button
          color="primary"
          startContent={<Plus size={20} />}
          onPress={onOpen}
        >
          Add Course
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Search courses..."
          startContent={<Search size={20} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          placeholder="Filter by country"
          selectedKeys={
            selectedCountry ? new Set([selectedCountry]) : new Set()
          }
          onSelectionChange={(keys) => {
            const selection = Array.from(keys);
            const countryId = selection[0] as string;
            setSelectedCountry(countryId || "");
            setSelectedUniversity(""); // Reset university filter
            setCurrentPage(1); // Reset to first page when filter changes
          }}
        >
          {countries.map((country) => (
            <SelectItem key={country.id}>{country.name}</SelectItem>
          ))}
        </Select>
        <Select
          placeholder="Filter by university"
          selectedKeys={
            selectedUniversity ? new Set([selectedUniversity]) : new Set()
          }
          onSelectionChange={(keys) => {
            const selection = Array.from(keys);
            const universityId = selection[0] as string;
            setSelectedUniversity(universityId || "");
            setCurrentPage(1); // Reset to first page when filter changes
          }}
          isDisabled={!selectedCountry}
        >
          {filteredUniversities.map((university) => (
            <SelectItem key={university.id}>{university.name}</SelectItem>
          ))}
        </Select>
        <Button
          variant="flat"
          onPress={() => {
            setSearchTerm("");
            setSelectedCountry("");
            setSelectedUniversity("");
            setCurrentPage(1);
          }}
        >
          Clear Filters
        </Button>
      </div>

      <Table aria-label="Courses table">
        <TableHeader>
          <TableColumn>PROGRAM</TableColumn>
          <TableColumn>UNIVERSITY</TableColumn>
          <TableColumn>COUNTRY</TableColumn>
          <TableColumn>LEVEL</TableColumn>
          <TableColumn>DURATION</TableColumn>
          <TableColumn>TUITION</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {coursesData.courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{course.programName}</span>
                  <span className="text-sm text-gray-500">{course.campus}</span>
                </div>
              </TableCell>
              <TableCell>{course.university?.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {course.country?.flagImageId && (
                    <span>{course.country.flagImageId}</span>
                  )}
                  <span>{course.country?.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Chip size="sm" variant="flat">
                  {course.studyLevel}
                </Chip>
              </TableCell>
              <TableCell>{course.duration}</TableCell>
              <TableCell>{course.yearlyTuitionFees}</TableCell>
              <TableCell>
                <Chip
                  color={course.published !== false ? "success" : "default"}
                  variant="flat"
                  size="sm"
                >
                  {course.published !== false ? "Published" : "Unpublished"}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Tooltip content="Edit">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => handleEdit(course)}
                    >
                      <Edit size={16} />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    content={
                      course.published !== false ? "Unpublish" : "Publish"
                    }
                  >
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color={course.published !== false ? "warning" : "success"}
                      onPress={() => togglePublishStatus(course)}
                    >
                      <Globe size={16} />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Delete" color="danger">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => {
                        setSelectedCourse(course);
                        onDeleteOpen();
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {coursesData.pagination.pages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={coursesData.pagination.pages}
            page={currentPage}
            onChange={setCurrentPage}
          />
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              {selectedCourse ? "Edit Course" : "Add New Course"}
              {hasUnsavedChanges && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                  Unsaved changes
                </span>
              )}
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Country"
                    placeholder="Select country"
                    selectedKeys={
                      formData.countryId
                        ? new Set([formData.countryId])
                        : new Set()
                    }
                    onSelectionChange={(keys) => {
                      const selection = Array.from(keys);
                      const countryId = selection[0] as string;
                      setFormData({
                        ...formData,
                        countryId: countryId || "",
                        universityId: "",
                      });
                    }}
                    isRequired
                    selectionMode="single"
                    disallowEmptySelection={false}
                  >
                    {countries.map((country) => (
                      <SelectItem key={country.id}>{country.name}</SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="University"
                    placeholder="Select university"
                    selectedKeys={
                      formData.universityId
                        ? new Set([formData.universityId])
                        : new Set()
                    }
                    onSelectionChange={(keys) => {
                      const selection = Array.from(keys);
                      const universityId = selection[0] as string;
                      setFormData({
                        ...formData,
                        universityId: universityId || "",
                      });
                    }}
                    isDisabled={!formData.countryId}
                    isRequired
                    selectionMode="single"
                    disallowEmptySelection={false}
                  >
                    {universities
                      .filter((uni) => uni.countryId === formData.countryId)
                      .map((university) => (
                        <SelectItem key={university.id}>
                          {university.name}
                        </SelectItem>
                      ))}
                  </Select>
                  <Input
                    label="Program Name"
                    placeholder="Enter program name"
                    value={formData.programName}
                    onChange={(e) =>
                      setFormData({ ...formData, programName: e.target.value })
                    }
                    isRequired
                  />

                  <Select
                    label="Study Level"
                    selectedKeys={new Set([formData.studyLevel])}
                    onSelectionChange={(keys) => {
                      const selection = Array.from(keys);
                      const studyLevel = selection[0] as
                        | "Undergraduate"
                        | "Postgraduate"
                        | "Doctorate"
                        | "Certificate"
                        | "Diploma";
                      setFormData({ ...formData, studyLevel });
                    }}
                    isRequired
                    selectionMode="single"
                  >
                    <SelectItem key="Undergraduate">Undergraduate</SelectItem>
                    <SelectItem key="Postgraduate">Postgraduate</SelectItem>
                    <SelectItem key="Doctorate">Doctorate</SelectItem>
                    <SelectItem key="Certificate">Certificate</SelectItem>
                    <SelectItem key="Diploma">Diploma</SelectItem>
                  </Select>
                  <Input
                    label="Campus"
                    placeholder="Main Campus"
                    value={formData.campus}
                    onChange={(e) =>
                      setFormData({ ...formData, campus: e.target.value })
                    }
                    isRequired
                  />
                  <Input
                    label="Duration"
                    placeholder="2 years"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    isRequired
                  />
                  <Input
                    label="Open Intakes"
                    placeholder="September, January"
                    value={formData.openIntakes}
                    onChange={(e) =>
                      setFormData({ ...formData, openIntakes: e.target.value })
                    }
                    isRequired
                  />
                  <Input
                    label="Intake Year"
                    placeholder="2024"
                    value={formData.intakeYear}
                    onChange={(e) =>
                      setFormData({ ...formData, intakeYear: e.target.value })
                    }
                    isRequired
                  />
                  <Input
                    label="IELTS Score"
                    type="number"
                    step="0.1"
                    min="0"
                    max="9"
                    value={formData.ieltsScore.toString()}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ieltsScore: parseFloat(e.target.value),
                      })
                    }
                    isRequired
                  />
                  <Input
                    label="IELTS No Band Less Than"
                    type="number"
                    step="0.1"
                    min="0"
                    max="9"
                    value={formData.ieltsNoBandLessThan.toString()}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ieltsNoBandLessThan: parseFloat(e.target.value),
                      })
                    }
                    isRequired
                  />
                  <Input
                    label="Yearly Tuition Fees"
                    placeholder="$25,000"
                    value={formData.yearlyTuitionFees}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        yearlyTuitionFees: e.target.value,
                      })
                    }
                    isRequired
                  />
                  <Input
                    label="Currency"
                    placeholder="USD"
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Test Scores */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Test Score Requirements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="PTE Score (Optional)"
                    type="number"
                    min="0"
                    max="90"
                    value={formData.pteScore?.toString() || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pteScore: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                  />

                  <Input
                    label="PTE No Band Less Than (Optional)"
                    type="number"
                    min="0"
                    max="90"
                    value={formData.pteNoBandLessThan?.toString() || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pteNoBandLessThan: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                  />

                  <Input
                    label="TOEFL Score (Optional)"
                    type="number"
                    min="0"
                    max="120"
                    value={formData.toeflScore?.toString() || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        toeflScore: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                  />

                  <Input
                    label="Duolingo Score (Optional)"
                    type="number"
                    min="0"
                    max="160"
                    value={formData.duolingo?.toString() || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duolingo: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                  />

                  <Input
                    label="GMAT Score (Optional)"
                    type="number"
                    min="200"
                    max="800"
                    value={formData.gmatScore?.toString() || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gmatScore: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                  />

                  <Input
                    label="GRE Score (Optional)"
                    type="number"
                    min="260"
                    max="340"
                    value={formData.greScore?.toString() || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        greScore: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                  />

                  <Input
                    label="Application Deadline"
                    placeholder="March 15, 2024"
                    value={formData.applicationDeadline || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        applicationDeadline: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Requirements</h3>
                <Textarea
                  label="Entry Requirements"
                  placeholder="Bachelor's degree with minimum GPA..."
                  value={formData.entryRequirements}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      entryRequirements: e.target.value,
                    })
                  }
                  isRequired
                />

                <Textarea
                  label="Work Experience Requirements"
                  placeholder="2+ years of relevant work experience (if applicable)"
                  value={formData.workExperience || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, workExperience: e.target.value })
                  }
                />
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Textarea
                    label="Scholarships Available"
                    placeholder="Merit scholarships, Need-based aid (comma-separated)"
                    value={formData.scholarships?.join(", ") || ""}
                    onChange={(e) => {
                      const scholarships = e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      setFormData({ ...formData, scholarships });
                    }}
                    minRows={3}
                  />

                  <Textarea
                    label="Career Prospects"
                    placeholder="Software Engineer, Data Scientist (comma-separated)"
                    value={formData.careerProspects?.join(", ") || ""}
                    onChange={(e) => {
                      const careerProspects = e.target.value
                        .split(",")
                        .map((c) => c.trim())
                        .filter(Boolean);
                      setFormData({ ...formData, careerProspects });
                    }}
                    minRows={3}
                  />

                  <Textarea
                    label="Accreditation"
                    placeholder="AACSB, ABET, ACBSP (comma-separated)"
                    value={formData.accreditation?.join(", ") || ""}
                    onChange={(e) => {
                      const accreditation = e.target.value
                        .split(",")
                        .map((a) => a.trim())
                        .filter(Boolean);
                      setFormData({ ...formData, accreditation });
                    }}
                    minRows={2}
                  />

                  <Textarea
                    label="Specializations"
                    placeholder="AI/ML, Cybersecurity, Finance (comma-separated)"
                    value={formData.specializations?.join(", ") || ""}
                    onChange={(e) => {
                      const specializations = e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      setFormData({ ...formData, specializations });
                    }}
                    minRows={2}
                  />
                </div>
              </div>

              {/* Publish Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      published: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300"
                />
                <label htmlFor="published" className="text-sm font-medium">
                  Published (visible to users)
                </label>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={handleCloseModal}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleSubmit}
              isLoading={isSubmitting}
              isDisabled={
                !formData.programName ||
                !formData.universityId ||
                !formData.countryId ||
                !formData.entryRequirements
              }
            >
              {selectedCourse ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete{" "}
              <strong>{selectedCourse?.programName}</strong>? This action cannot
              be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteClose}>
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={handleDelete}
              isLoading={isSubmitting}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
