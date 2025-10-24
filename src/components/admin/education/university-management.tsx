"use client";

import { useState, useEffect } from "react";
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
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import {
  Plus,
  Edit,
  Trash2,
  Globe,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import type {
  University,
  Country,
  CreateUniversityData,
  Campus,
} from "@/types/education";
import ImageUpload from "@/components/admin/image-upload";
import { getImageUrl } from "@/lib/cloudinary-utils";

export function UniversityManagement() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);
  const [formData, setFormData] = useState<CreateUniversityData>({
    name: "",
    countryId: "",
    location: "",
    type: "Public",
    website: "",
    imageId: "",
    description: "",
    ranking: undefined,
    established: undefined,
    campusSize: "",
    studentPopulation: "",
    internationalStudents: "",
    accommodation: "",
    facilities: [],
    campuses: [],
    published: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Campus management state
  const [campusFormData, setCampusFormData] = useState<Campus>({
    name: "",
    location: "",
    address: "",
    city: "",
    facilities: [],
  });
  const [editingCampusIndex, setEditingCampusIndex] = useState<number | null>(
    null
  );
  const [showCampusForm, setShowCampusForm] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  useEffect(() => {
    fetchData();
  }, []);

  // Track unsaved changes
  useEffect(() => {
    if (selectedUniversity) {
      const hasChanges =
        formData.name !== selectedUniversity.name ||
        formData.countryId !== selectedUniversity.countryId ||
        formData.location !== selectedUniversity.location ||
        formData.type !== selectedUniversity.type ||
        formData.website !== (selectedUniversity.website || "") ||
        formData.imageId !== (selectedUniversity.imageId || "") ||
        formData.description !== (selectedUniversity.description || "") ||
        formData.ranking !== selectedUniversity.ranking ||
        formData.established !== selectedUniversity.established ||
        formData.campusSize !== (selectedUniversity.campusSize || "") ||
        formData.studentPopulation !==
          (selectedUniversity.studentPopulation || "") ||
        formData.internationalStudents !==
          (selectedUniversity.internationalStudents || "") ||
        formData.accommodation !== (selectedUniversity.accommodation || "") ||
        JSON.stringify(formData.facilities) !==
          JSON.stringify(selectedUniversity.facilities || []) ||
        JSON.stringify(formData.campuses) !==
          JSON.stringify(selectedUniversity.campuses || []) ||
        formData.published !== (selectedUniversity.published ?? true);

      setHasUnsavedChanges(hasChanges);
    } else {
      // For new universities, check if any required field has content
      const hasContent =
        formData.name.trim() !== "" ||
        formData.countryId !== "" ||
        formData.location.trim() !== "" ||
        formData.imageId !== "";

      setHasUnsavedChanges(hasContent);
    }
  }, [formData, selectedUniversity]);

  const fetchData = async () => {
    try {
      const [universitiesRes, countriesRes] = await Promise.all([
        fetch("/api/universities?populate=true&includeUnpublished=true"),
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

    console.log("Submitting university data:", formData);
    console.log("Image file:", imageFile);

    try {
      const url = selectedUniversity
        ? `/api/universities/${selectedUniversity.id}`
        : "/api/universities";
      const method = selectedUniversity ? "PUT" : "POST";

      // Create FormData if there's a file to upload
      if (imageFile) {
        const formDataToSend = new FormData();

        // Add JSON data
        formDataToSend.append("data", JSON.stringify(formData));

        // Add image file
        formDataToSend.append("imageFile", imageFile);

        const response = await fetch(url, {
          method,
          body: formDataToSend,
        });

        if (response.ok) {
          setHasUnsavedChanges(false);
          await fetchData();
          handleCloseModal();
          addToast({
            title: selectedUniversity
              ? "University updated successfully!"
              : "University created successfully!",
            color: "success",
          });
        } else {
          const error = await response.json();
          addToast({
            title: error.error || "Failed to save university",
            color: "danger",
          });
        }
      } else {
        // No file, send JSON data
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setHasUnsavedChanges(false);
          await fetchData();
          handleCloseModal();
          addToast({
            title: selectedUniversity
              ? "University updated successfully!"
              : "University created successfully!",
            color: "success",
          });
        } else {
          const error = await response.json();
          addToast({
            title: error.error || "Failed to save university",
            color: "danger",
          });
        }
      }
    } catch (error) {
      console.error("Error saving university:", error);
      addToast({
        title: "Failed to save university",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUniversity) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/universities/${selectedUniversity.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await fetchData();
        onDeleteClose();
        setSelectedUniversity(null);
        addToast({
          title: "University deleted successfully!",
          color: "success",
        });
      } else {
        const error = await response.json();
        addToast({
          title: error.error || "Failed to delete university",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Error deleting university:", error);
      addToast({
        title: "Failed to delete university",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePublishStatus = async (university: University) => {
    try {
      const response = await fetch(`/api/universities/${university.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...university,
          published: !university.published,
        }),
      });

      if (response.ok) {
        await fetchData();
        addToast({
          title: `University ${
            !university.published ? "published" : "unpublished"
          } successfully!`,
          color: "success",
        });
      } else {
        const error = await response.json();
        addToast({
          title: error.error || "Failed to update university status",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Error updating university status:", error);
      addToast({
        title: "Failed to update university status",
        color: "danger",
      });
    }
  };

  const handleEdit = (university: University) => {
    console.log("Editing university:", university);
    console.log("University countryId:", university.countryId);
    console.log(
      "Available countries:",
      countries.map((c) => ({ id: c.id, name: c.name }))
    );

    setSelectedUniversity(university);
    setFormData({
      name: university.name,
      countryId: university.countryId,
      location: university.location,
      type: university.type,
      website: university.website || "",
      imageId: university.imageId || "",
      description: university.description || "",
      ranking: university.ranking,
      established: university.established,
      campusSize: university.campusSize || "",
      studentPopulation: university.studentPopulation || "",
      internationalStudents: university.internationalStudents || "",
      accommodation: university.accommodation || "",
      facilities: university.facilities || [],
      campuses: university.campuses || [],
      published: university.published ?? true,
    });
    setShowCampusForm(false);
    setEditingCampusIndex(null);
    onOpen();
  };

  const handleCloseModal = () => {
    setSelectedUniversity(null);
    setHasUnsavedChanges(false);
    setImageFile(null);
    setShowCampusForm(false);
    setEditingCampusIndex(null);
    setCampusFormData({
      name: "",
      location: "",
      address: "",
      city: "",
      facilities: [],
    });
    setFormData({
      name: "",
      countryId: "",
      location: "",
      type: "Public",
      website: "",
      imageId: "",
      description: "",
      ranking: undefined,
      established: undefined,
      campusSize: "",
      studentPopulation: "",
      internationalStudents: "",
      accommodation: "",
      facilities: [],
      campuses: [],
    });
    onClose();
  };

  const handleFacilitiesChange = (value: string) => {
    const facilities = value
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    setFormData({ ...formData, facilities });
  };

  // Campus management functions
  const handleAddCampus = () => {
    if (
      !campusFormData.name ||
      !campusFormData.location ||
      !campusFormData.city
    ) {
      addToast({
        title: "Please fill in all required campus fields",
        color: "warning",
      });
      return;
    }

    const newCampuses = [...(formData.campuses || [])];

    if (editingCampusIndex !== null) {
      // Update existing campus
      newCampuses[editingCampusIndex] = campusFormData;
      addToast({
        title: "Campus updated successfully!",
        color: "success",
      });
    } else {
      // Add new campus
      newCampuses.push(campusFormData);
      addToast({
        title: "Campus added successfully!",
        color: "success",
      });
    }

    setFormData({ ...formData, campuses: newCampuses });
    setCampusFormData({
      name: "",
      location: "",
      address: "",
      city: "",
      facilities: [],
    });
    setEditingCampusIndex(null);
    setShowCampusForm(false);
  };

  const handleEditCampus = (index: number) => {
    const campus = formData.campuses?.[index];
    if (campus) {
      setCampusFormData(campus);
      setEditingCampusIndex(index);
      setShowCampusForm(true);
    }
  };

  const handleDeleteCampus = (index: number) => {
    const newCampuses = formData.campuses?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, campuses: newCampuses });
    addToast({
      title: "Campus removed successfully!",
      color: "success",
    });
  };

  const handleCancelCampusEdit = () => {
    setCampusFormData({
      name: "",
      location: "",
      address: "",
      city: "",
      facilities: [],
    });
    setEditingCampusIndex(null);
    setShowCampusForm(false);
  };

  const handleCampusFacilitiesChange = (value: string) => {
    const facilities = value
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    setCampusFormData({ ...campusFormData, facilities });
  };

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
        <h2 className="text-2xl font-bold">Universities</h2>
        <Button
          color="primary"
          startContent={<Plus size={20} />}
          onPress={onOpen}
        >
          Add University
        </Button>
      </div>

      <Table aria-label="Universities table">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>IMAGE</TableColumn>
          <TableColumn>COUNTRY</TableColumn>
          <TableColumn>LOCATION</TableColumn>
          <TableColumn>TYPE</TableColumn>
          <TableColumn>RANKING</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {universities.map((university) => (
            <TableRow key={university.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{university.name}</span>
                  {university.website && (
                    <a
                      href={`https://${university.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {university.website}
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {university.imageId ? (
                  <div className="w-16 h-12 relative rounded overflow-hidden">
                    <Image
                      src={getImageUrl(university.imageId, "thumbnail")}
                      alt={`${university.name} image`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center">
                    <ImageIcon size={16} className="text-gray-400" />
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {university.country?.flagImageId ? (
                    <div className="w-6 h-4 relative rounded overflow-hidden">
                      <Image
                        src={getImageUrl(
                          university.country.flagImageId,
                          "thumbnail"
                        )}
                        alt={`${university.country.name} flag`}
                        fill
                        className="object-cover"
                        sizes="24px"
                      />
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs">🏳️</span>
                  )}
                  <span>{university.country?.name}</span>
                </div>
              </TableCell>
              <TableCell>{university.location}</TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  variant="flat"
                  color={university.type === "Public" ? "success" : "primary"}
                >
                  {university.type}
                </Chip>
              </TableCell>
              <TableCell>
                {university.ranking ? `#${university.ranking}` : "N/A"}
              </TableCell>
              <TableCell>
                <Chip
                  color={university.published !== false ? "success" : "default"}
                  variant="flat"
                  size="sm"
                >
                  {university.published !== false ? "Published" : "Unpublished"}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Tooltip content="Edit">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => handleEdit(university)}
                    >
                      <Edit size={16} />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    content={
                      university.published !== false ? "Unpublish" : "Publish"
                    }
                  >
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color={
                        university.published !== false ? "warning" : "success"
                      }
                      onPress={() => togglePublishStatus(university)}
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
                        setSelectedUniversity(university);
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              {selectedUniversity ? "Edit University" : "Add New University"}
              {hasUnsavedChanges && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                  Unsaved changes
                </span>
              )}
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="University Name"
                placeholder="Enter university name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                isRequired
              />
              <Select
                label="Country"
                placeholder="Select country"
                selectedKeys={formData.countryId ? [formData.countryId] : []}
                onSelectionChange={(keys) => {
                  const countryId = Array.from(keys)[0] as string;
                  setFormData({ ...formData, countryId });
                }}
                isRequired
              >
                {countries.map((country) => (
                  <SelectItem key={country.id}>{country.name}</SelectItem>
                ))}
              </Select>
              <Input
                label="Location"
                placeholder="City, State/Province"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                isRequired
              />
              <Select
                label="Type"
                selectedKeys={[formData.type]}
                onSelectionChange={(keys) => {
                  const type = Array.from(keys)[0] as "Public" | "Private";
                  setFormData({ ...formData, type });
                }}
                isRequired
              >
                <SelectItem key="Public">Public</SelectItem>
                <SelectItem key="Private">Private</SelectItem>
              </Select>
              <Input
                label="Website"
                placeholder="university.edu"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
              />
              <div className="md:col-span-2">
                <ImageUpload
                  label="University Image"
                  value={formData.imageId}
                  onChange={(imageId) => {
                    setFormData({ ...formData, imageId: imageId });
                  }}
                  onFileChange={(file) => {
                    setImageFile(file);
                  }}
                  description="Upload university image (Image will be uploaded when you save the university)"
                  folder="university-images"
                />
              </div>
              <Input
                label="Ranking"
                type="number"
                placeholder="World ranking"
                value={formData.ranking?.toString() || ""}
                onChange={(e) => {
                  const ranking = e.target.value
                    ? parseInt(e.target.value)
                    : undefined;
                  setFormData({ ...formData, ranking });
                }}
              />
              <Input
                label="Established"
                type="number"
                placeholder="Year established"
                value={formData.established?.toString() || ""}
                onChange={(e) => {
                  const established = e.target.value
                    ? parseInt(e.target.value)
                    : undefined;
                  setFormData({ ...formData, established });
                }}
              />
              <Input
                label="Campus Size"
                placeholder="Urban, 200 acres"
                value={formData.campusSize}
                onChange={(e) =>
                  setFormData({ ...formData, campusSize: e.target.value })
                }
              />
              <Input
                label="Student Population"
                placeholder="~25,000"
                value={formData.studentPopulation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    studentPopulation: e.target.value,
                  })
                }
              />
              <Input
                label="International Students"
                placeholder="~5,000"
                value={formData.internationalStudents}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    internationalStudents: e.target.value,
                  })
                }
              />
            </div>
            <Textarea
              label="Description"
              placeholder="Brief description about the university"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <Textarea
              label="Accommodation"
              placeholder="Information about student accommodation"
              value={formData.accommodation}
              onChange={(e) =>
                setFormData({ ...formData, accommodation: e.target.value })
              }
            />
            <Input
              label="Facilities"
              placeholder="Libraries, Sports Centers, Labs (comma-separated)"
              value={formData.facilities?.join(", ") || ""}
              onChange={(e) => handleFacilitiesChange(e.target.value)}
            />

            {/* Campus Management Section */}
            <div className="md:col-span-2 mt-6">
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Campuses</h3>
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    startContent={<Plus size={16} />}
                    onPress={() => setShowCampusForm(!showCampusForm)}
                  >
                    {showCampusForm ? "Cancel" : "Add Campus"}
                  </Button>
                </div>

                {/* Campus Form */}
                {showCampusForm && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700">
                      {editingCampusIndex !== null
                        ? "Edit Campus"
                        : "New Campus"}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        size="sm"
                        label="Campus Name"
                        placeholder="Main Campus, Downtown Campus, etc."
                        value={campusFormData.name}
                        onChange={(e) =>
                          setCampusFormData({
                            ...campusFormData,
                            name: e.target.value,
                          })
                        }
                        isRequired
                      />
                      <Input
                        size="sm"
                        label="Location"
                        placeholder="Area/District"
                        value={campusFormData.location}
                        onChange={(e) =>
                          setCampusFormData({
                            ...campusFormData,
                            location: e.target.value,
                          })
                        }
                        isRequired
                      />
                      <Input
                        size="sm"
                        label="City"
                        placeholder="City name"
                        value={campusFormData.city}
                        onChange={(e) =>
                          setCampusFormData({
                            ...campusFormData,
                            city: e.target.value,
                          })
                        }
                        isRequired
                      />
                      <Input
                        size="sm"
                        label="Address"
                        placeholder="Street address"
                        value={campusFormData.address || ""}
                        onChange={(e) =>
                          setCampusFormData({
                            ...campusFormData,
                            address: e.target.value,
                          })
                        }
                      />
                      <div className="md:col-span-2">
                        <Input
                          size="sm"
                          label="Campus Facilities"
                          placeholder="Library, Lab, Sports Complex (comma-separated)"
                          value={campusFormData.facilities?.join(", ") || ""}
                          onChange={(e) =>
                            handleCampusFacilitiesChange(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="light"
                        onPress={handleCancelCampusEdit}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        color="primary"
                        onPress={handleAddCampus}
                        isDisabled={
                          !campusFormData.name ||
                          !campusFormData.location ||
                          !campusFormData.city
                        }
                      >
                        {editingCampusIndex !== null ? "Update" : "Add"} Campus
                      </Button>
                    </div>
                  </div>
                )}

                {/* Campus List */}
                {formData.campuses && formData.campuses.length > 0 ? (
                  <div className="space-y-2">
                    {formData.campuses.map((campus, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm">
                              {campus.name}
                            </h4>
                            <Chip size="sm" variant="flat" color="primary">
                              {campus.city}
                            </Chip>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {campus.location}
                            {campus.address && ` • ${campus.address}`}
                          </p>
                          {campus.facilities &&
                            campus.facilities.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {campus.facilities.map((facility, fIndex) => (
                                  <Chip
                                    key={fIndex}
                                    size="sm"
                                    variant="flat"
                                    color="default"
                                  >
                                    {facility}
                                  </Chip>
                                ))}
                              </div>
                            )}
                        </div>
                        <div className="flex items-center gap-1 ml-3">
                          <Tooltip content="Edit Campus">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              onPress={() => handleEditCampus(index)}
                            >
                              <Edit size={14} />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Delete Campus" color="danger">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              color="danger"
                              onPress={() => handleDeleteCampus(index)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No campuses added yet. Click &quot;Add Campus&quot; to add
                    one.
                  </p>
                )}
              </div>
            </div>

            {/* Publish Status */}
            <div className="flex items-center gap-2 mt-4 md:col-span-2">
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
                !formData.name || !formData.countryId || !formData.location
              }
            >
              {selectedUniversity ? "Update" : "Create"}
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
              <strong>{selectedUniversity?.name}</strong>? This action cannot be
              undone and will fail if there are courses at this university.
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
