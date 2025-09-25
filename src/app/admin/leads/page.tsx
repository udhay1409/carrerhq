"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";
import { Icon } from "@iconify/react";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Pagination } from "@heroui/pagination";
import { Search } from "lucide-react";
import { ILead } from "@/models/lead";
import {
  logDataFetchError,
  logNetworkError,
  logApiError,
} from "@/utils/errorUtils";

export default function LeadsManagement() {
  const [leads, setLeads] = useState<ILead[]>([]);
  const [_loading, setLoading] = useState(true);
  const [_isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("new"); // Default to "new" leads
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchLeads = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        status: selectedStatus,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await fetch(`/api/leads?${params}`);

      if (!response.ok) {
        logApiError(
          `Failed to fetch leads: ${response.status}`,
          "/api/leads",
          {
            status: selectedStatus,
            page: pagination.page,
            limit: pagination.limit,
            searchTerm,
          },
          response.status
        );
        throw new Error(`Failed to fetch leads: ${response.status}`);
      }

      const data = await response.json();
      setLeads(data.leads);
      setPagination((prev) => ({
        ...prev,
        total: data.total,
        pages: Math.ceil(data.total / prev.limit),
      }));
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        logNetworkError(error, "/api/leads", {
          status: selectedStatus,
          page: pagination.page,
          limit: pagination.limit,
          searchTerm,
        });
      } else {
        logDataFetchError(
          error instanceof Error ? error : String(error),
          "admin_leads",
          undefined,
          {
            status: selectedStatus,
            page: pagination.page,
            limit: pagination.limit,
            searchTerm,
          }
        );
      }
      addToast({
        title: "Failed to fetch leads",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, pagination.page, pagination.limit, searchTerm]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleConvertToCRM = async (leadId: string) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/leads/${leadId}/convert`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        logApiError(
          error.message || "Failed to convert lead",
          `/api/leads/${leadId}/convert`,
          { leadId },
          response.status
        );
        throw new Error(error.message || "Failed to convert lead");
      }

      addToast({
        title: "Lead successfully converted to CRM",
        color: "success",
      });
      await fetchLeads(); // Refresh leads list
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        logNetworkError(error, `/api/leads/${leadId}/convert`, { leadId });
      } else {
        logDataFetchError(
          error instanceof Error ? error : String(error),
          "convert_lead",
          leadId
        );
      }
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to convert lead to CRM";
      addToast({
        title: errorMessage,
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Leads Management{" "}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your leads and convert them to CRM entries
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && fetchLeads()}
          endContent={
            <Button isIconOnly onPress={() => fetchLeads()} variant="light">
              <Search className="w-4 h-4 text-gray-400" />
            </Button>
          }
          className="md:w-72"
        />
        <Select
          selectedKeys={[selectedStatus]}
          onSelectionChange={(keys) => {
            const status = Array.from(keys)[0] as string;
            setSelectedStatus(status);
          }}
          className="md:w-48"
        >
          <SelectItem key="new">New Leads</SelectItem>

          <SelectItem key="converted">Converted</SelectItem>

          <SelectItem key="all">All Status</SelectItem>
        </Select>
      </div>

      {/* Table */}
      <Table aria-label="Leads table">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>CONTACT</TableColumn>
          <TableColumn>COURSE DETAILS</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>DATE</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <div className="text-center py-6">
              <p className="text-gray-500">
                No leads found matching your criteria
              </p>
            </div>
          }
        >
          {leads.map((lead) => (
            <TableRow key={lead._id?.toString()}>
              <TableCell>
                <div className="font-medium">{lead.name}</div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div>{lead.email}</div>
                  <div className="text-sm text-gray-500">{lead.phone}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div>{lead.program}</div>
                  <div className="text-sm text-gray-500">{lead.university}</div>
                  <div className="text-sm text-gray-500">{lead.country}</div>
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  color={
                    lead.status === "new"
                      ? "primary"
                      : lead.status === "contacted"
                      ? "warning"
                      : lead.status === "converted"
                      ? "success"
                      : "default"
                  }
                  size="sm"
                >
                  {lead.status.toUpperCase()}
                </Chip>
              </TableCell>
              <TableCell>
                {new Date(lead.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  onPress={() => handleConvertToCRM(lead._id?.toString() || "")}
                  startContent={<Icon icon="lucide:user-plus" />}
                  isDisabled={lead.status === "converted"}
                >
                  Convert to CRM
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            total={pagination.pages}
            page={pagination.page}
            onChange={(page) => setPagination((prev) => ({ ...prev, page }))}
            showControls
            showShadow
          />
        </div>
      )}
    </div>
  );
}
