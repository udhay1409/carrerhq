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
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { Textarea } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { Spinner } from "@heroui/spinner";
import { useDisclosure } from "@heroui/use-disclosure";
import { Plus, Edit, Trash2, Globe } from "lucide-react";
import Image from "next/image";
import type { Country, CreateCountryData } from "@/types/education";
import ImageUpload from "@/components/admin/image-upload";
import { getImageUrl } from "@/lib/cloudinary-utils";

export function CountryManagement() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [formData, setFormData] = useState<CreateCountryData>({
    name: "",
    code: "",
    flagImageId: "",
    imageId: "",
    description: "",
    costOfLiving: "",
    visaRequirements: "",
    scholarshipsAvailable: "",
    // Keep existing fields for backward compatibility
    currency: "",
    language: "",
    timezone: "",
    published: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [flagImageFile, setFlagImageFile] = useState<File | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(
    new Set()
  );
  const [isAllSelected, setIsAllSelected] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Debug: Log form data changes and track unsaved changes
  useEffect(() => {
    console.log("Form data changed:", formData);

    // Check if there are unsaved changes (when editing)
    if (selectedCountry) {
      const hasChanges =
        formData.name !== selectedCountry.name ||
        formData.code !== (selectedCountry.code || "") ||
        formData.flagImageId !== (selectedCountry.flagImageId || "") ||
        formData.imageId !== (selectedCountry.imageId || "") ||
        formData.description !== (selectedCountry.description || "") ||
        formData.costOfLiving !== (selectedCountry.costOfLiving || "") ||
        formData.visaRequirements !==
          (selectedCountry.visaRequirements || "") ||
        formData.scholarshipsAvailable !==
          (selectedCountry.scholarshipsAvailable || "") ||
        formData.published !== (selectedCountry.published ?? true);

      setHasUnsavedChanges(hasChanges);
    } else {
      // For new countries, check if any field has content
      const hasContent =
        formData.name.trim() !== "" ||
        formData.flagImageId !== "" ||
        formData.imageId !== "" ||
        Boolean(formData.description && formData.description.trim() !== "");

      setHasUnsavedChanges(hasContent);
    }
  }, [formData, selectedCountry]);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch("/api/countries?includeUnpublished=true");
      const data = await response.json();
      setCountries(data.countries || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Debug: Log the form data being submitted
    console.log("Submitting country data:", formData);
    console.log("Image file:", imageFile);
    console.log("Flag image file:", flagImageFile);

    try {
      const url = selectedCountry
        ? `/api/countries/${selectedCountry.id}`
        : "/api/countries";
      const method = selectedCountry ? "PUT" : "POST";

      // Create FormData if there are files to upload
      if (imageFile || flagImageFile) {
        const formDataToSend = new FormData();

        // Add JSON data
        formDataToSend.append("data", JSON.stringify(formData));

        // Add image files if present
        if (imageFile) {
          formDataToSend.append("imageFile", imageFile);
        }
        if (flagImageFile) {
          formDataToSend.append("flagImageFile", flagImageFile);
        }

        const response = await fetch(url, {
          method,
          body: formDataToSend,
        });

        if (response.ok) {
          setHasUnsavedChanges(false);
          await fetchCountries();
          handleCloseModal();
          addToast({
            title: selectedCountry
              ? "Country updated successfully!"
              : "Country created successfully!",
            color: "success",
          });
        } else {
          const error = await response.json();
          addToast({
            title: error.error || "Failed to save country",
            color: "danger",
          });
        }
      } else {
        // No files, send JSON data
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setHasUnsavedChanges(false);
          await fetchCountries();
          handleCloseModal();
          addToast({
            title: selectedCountry
              ? "Country updated successfully!"
              : "Country created successfully!",
            color: "success",
          });
        } else {
          const error = await response.json();
          addToast({
            title: error.error || "Failed to save country",
            color: "danger",
          });
        }
      }
    } catch (error) {
      console.error("Error saving country:", error);
      addToast({
        title: "Failed to save country",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCountry) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/countries/${selectedCountry.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCountries();
        onDeleteClose();
        setSelectedCountry(null);
        addToast({
          title: "Country deleted successfully!",
          color: "success",
        });
      } else {
        const error = await response.json();
        addToast({
          title: error.error || "Failed to delete country",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Error deleting country:", error);
      addToast({
        title: "Failed to delete country",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePublishStatus = async (country: Country) => {
    try {
      const response = await fetch(`/api/countries/${country.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...country,
          published: !country.published,
        }),
      });

      if (response.ok) {
        await fetchCountries();
        addToast({
          title: `Country ${
            !country.published ? "published" : "unpublished"
          } successfully!`,
          color: "success",
        });
      } else {
        const error = await response.json();
        addToast({
          title: error.error || "Failed to update country status",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Error updating country status:", error);
      addToast({
        title: "Failed to update country status",
        color: "danger",
      });
    }
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedCountries(new Set());
      setIsAllSelected(false);
    } else {
      setSelectedCountries(new Set(countries.map((c) => c.id)));
      setIsAllSelected(true);
    }
  };

  const handleSelectCountry = (countryId: string) => {
    const newSelected = new Set(selectedCountries);
    if (newSelected.has(countryId)) {
      newSelected.delete(countryId);
    } else {
      newSelected.add(countryId);
    }
    setSelectedCountries(newSelected);
    setIsAllSelected(newSelected.size === countries.length);
  };

  const bulkPublish = async (publish: boolean) => {
    const selectedIds = Array.from(selectedCountries);
    if (selectedIds.length === 0) return;

    try {
      const promises = selectedIds.map((id) =>
        fetch(`/api/countries/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...countries.find((c) => c.id === id),
            published: publish,
          }),
        })
      );

      await Promise.all(promises);
      await fetchCountries();
      setSelectedCountries(new Set());
      setIsAllSelected(false);

      addToast({
        title: `${selectedIds.length} countries ${
          publish ? "published" : "unpublished"
        } successfully!`,
        color: "success",
      });
    } catch (error) {
      console.error("Error bulk updating countries:", error);
      addToast({
        title: "Failed to update countries",
        color: "danger",
      });
    }
  };

  const handleEdit = (country: Country) => {
    setSelectedCountry(country);
    setFormData({
      name: country.name,
      code: country.code || "",
      flagImageId: country.flagImageId || "",
      imageId: country.imageId || "",
      description: country.description || "",
      costOfLiving: country.costOfLiving || "",
      visaRequirements: country.visaRequirements || "",
      scholarshipsAvailable: country.scholarshipsAvailable || "",
      // Keep existing fields for backward compatibility
      currency: country.currency || "",
      language: country.language || "",
      timezone: country.timezone || "",
      published: country.published ?? true,
    });
    onOpen();
  };

  const handleCloseModal = () => {
    setSelectedCountry(null);
    setHasUnsavedChanges(false);
    setImageFile(null);
    setFlagImageFile(null);
    setFormData({
      name: "",
      code: "",
      flagImageId: "",
      imageId: "",
      description: "",
      costOfLiving: "",
      visaRequirements: "",
      scholarshipsAvailable: "",
      // Keep existing fields for backward compatibility
      currency: "",
      language: "",
      timezone: "",
    });
    onClose();
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
        <h2 className="text-2xl font-bold">Countries</h2>
        <Button
          color="primary"
          startContent={<Plus size={20} />}
          onPress={onOpen}
        >
          Add Country
        </Button>
      </div>

      {/* Bulk Actions */}
      {selectedCountries.size > 0 && (
        <div className="flex items-center gap-2 p-4 bg-primary-50 rounded-lg mb-4">
          <span className="text-sm font-medium">
            {selectedCountries.size} countries selected
          </span>
          <Button
            size="sm"
            color="success"
            variant="flat"
            onPress={() => bulkPublish(true)}
          >
            Publish Selected
          </Button>
          <Button
            size="sm"
            color="warning"
            variant="flat"
            onPress={() => bulkPublish(false)}
          >
            Unpublish Selected
          </Button>
          <Button
            size="sm"
            variant="light"
            onPress={() => {
              setSelectedCountries(new Set());
              setIsAllSelected(false);
            }}
          >
            Clear Selection
          </Button>
        </div>
      )}

      <Table aria-label="Countries table">
        <TableHeader>
          <TableColumn>
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleSelectAll}
              className="rounded border-gray-300"
            />
          </TableColumn>
          <TableColumn>NAME</TableColumn>
          <TableColumn>FLAG</TableColumn>
          <TableColumn>IMAGE</TableColumn>
          <TableColumn>DESCRIPTION</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {countries.map((country) => (
            <TableRow key={country.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedCountries.has(country.id)}
                  onChange={() => handleSelectCountry(country.id)}
                  className="rounded border-gray-300"
                />
              </TableCell>
              <TableCell>
                <span className="font-medium">{country.name}</span>
              </TableCell>
              <TableCell>
                {country.flagImageId ? (
                  <div className="w-8 h-6 relative rounded overflow-hidden">
                    <Image
                      src={getImageUrl(country.flagImageId, "thumbnail")}
                      alt={`${country.name} flag`}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">No flag</span>
                )}
              </TableCell>
              <TableCell>
                {country.imageId ? (
                  <div className="w-12 h-8 relative rounded overflow-hidden">
                    <Image
                      src={getImageUrl(country.imageId, "thumbnail")}
                      alt={`${country.name} image`}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">No image</span>
                )}
              </TableCell>
              <TableCell>
                <div className="max-w-xs">
                  <p className="text-sm text-gray-600 truncate">
                    {country.description || "No description"}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  color={country.published !== false ? "success" : "default"}
                  variant="flat"
                  size="sm"
                >
                  {country.published !== false ? "Published" : "Unpublished"}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Tooltip content="Edit">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => handleEdit(country)}
                    >
                      <Edit size={16} />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    content={
                      country.published !== false ? "Unpublish" : "Publish"
                    }
                  >
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color={
                        country.published !== false ? "warning" : "success"
                      }
                      onPress={() => togglePublishStatus(country)}
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
                        setSelectedCountry(country);
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
              {selectedCountry ? "Edit Country" : "Add New Country"}
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
                  <Input
                    label="Country Name"
                    placeholder="Enter country name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    isRequired
                  />
                  <Input
                    label="Country Code (Optional)"
                    placeholder="US, UK, CA, etc."
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    maxLength={3}
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <ImageUpload
                      label="Country Flag Image"
                      value={formData.flagImageId || ""}
                      onChange={(imageId) => {
                        setFormData({ ...formData, flagImageId: imageId });
                      }}
                      onFileChange={(file) => {
                        setFlagImageFile(file);
                      }}
                      description="Upload flag image for the country (Image will be uploaded when you save the country)"
                      folder="country-flags"
                    />
                  </div>
                  <div>
                    <ImageUpload
                      label="Country Image"
                      value={formData.imageId || ""}
                      onChange={(imageId) => {
                        setFormData({ ...formData, imageId: imageId });
                      }}
                      onFileChange={(file) => {
                        setImageFile(file);
                      }}
                      description="Upload main image representing the country (Image will be uploaded when you save the country)"
                      folder="country-images"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <Textarea
                  label="Country Description"
                  placeholder="Enter a detailed description about the country, its education system, culture, etc."
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  minRows={4}
                  maxRows={8}
                />
              </div>

              {/* Study Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Study Information
                </h3>
                <div className="space-y-4">
                  <Textarea
                    label="Cost of Living"
                    placeholder="Provide information about living costs, accommodation, food, transportation, etc."
                    value={formData.costOfLiving || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, costOfLiving: e.target.value })
                    }
                    minRows={3}
                  />
                  <Textarea
                    label="Visa Requirements"
                    placeholder="Describe visa requirements, application process, documents needed, etc."
                    value={formData.visaRequirements || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        visaRequirements: e.target.value,
                      })
                    }
                    minRows={3}
                  />
                  <Textarea
                    label="Scholarships Available"
                    placeholder="List available scholarships, funding opportunities, and financial aid options"
                    value={formData.scholarshipsAvailable || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scholarshipsAvailable: e.target.value,
                      })
                    }
                    minRows={3}
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
              isDisabled={!formData.name}
            >
              {selectedCountry ? "Update" : "Create"}
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
              <strong>{selectedCountry?.name}</strong>? This action cannot be
              undone and will fail if there are universities in this country.
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
