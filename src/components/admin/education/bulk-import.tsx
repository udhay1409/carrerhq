"use client";

import { useState, useRef } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Divider } from "@heroui/divider";
import { Chip } from "@heroui/chip";
import { Code } from "@heroui/code";
import {
  Upload,
  Download,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import * as XLSX from "xlsx";
import type { CourseImportRow, BulkImportResult } from "@/types/education";

export function BulkImport() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<BulkImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (
        validTypes.includes(selectedFile.type) ||
        selectedFile.name.endsWith(".csv")
      ) {
        setFile(selectedFile);
        setResult(null);
      } else {
        alert("Please select a CSV or Excel file");
      }
    }
  };

  // Helper function to parse CSV with proper handling of quoted fields
  const parseCSVLine = (line: string): string[] => {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  };

  const parseCSV = (text: string): CourseImportRow[] => {
    const lines = text.split("\n").filter((line) => line.trim());
    if (lines.length < 2) return [];

    const headers = parseCSVLine(lines[0]).map((h) => h.replace(/"/g, ""));
    const rows: CourseImportRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]).map((v) => v.replace(/"/g, ""));
      if (values.length < headers.length) continue;

      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });

      rows.push(mapRowToFormat(row));
    }

    return rows;
  };

  const parseExcel = (file: File): Promise<CourseImportRow[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });

          // Get the first worksheet
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (jsonData.length < 2) {
            resolve([]);
            return;
          }

          const headers = jsonData[0] as string[];
          console.log("Excel headers found:", headers);

          const rows: CourseImportRow[] = [];

          for (let i = 1; i < jsonData.length; i++) {
            const values = jsonData[i] as string[];
            if (!values || values.length === 0) continue;

            const row: Record<string, string> = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || "";
            });

            if (i === 1) {
              console.log("First Excel row data:", row);
            }

            rows.push(mapRowToFormat(row));
          }

          resolve(rows);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    });
  };

  const mapRowToFormat = (row: Record<string, string>): CourseImportRow => {
    return {
      universityName: row.universityName || row["University Name"] || "",
      countryName: row.countryName || row["Country Name"] || "",
      programName: row.programName || row["Program Name"] || "",
      studyLevel: row.studyLevel || row["Study Level"] || "Postgraduate",
      campus: row.campus || row["Campus"] || "Main Campus",
      duration: row.duration || row["Duration"] || "",
      openIntakes: row.openIntakes || row["Open Intakes"] || "",
      intakeYear:
        row.intakeYear ||
        row["Intake Year"] ||
        new Date().getFullYear().toString(),
      entryRequirements:
        row.entryRequirements || row["Entry Requirements"] || "",
      ieltsScore: row.ieltsScore || row["IELTS Score"] || "6.5",
      ieltsNoBandLessThan:
        row.ieltsNoBandLessThan || row["IELTS No Band Less Than"] || "6.0",
      pteScore: row.pteScore || row["PTE Score"] || "",
      pteNoBandLessThan:
        row.pteNoBandLessThan || row["PTE No Band Less Than"] || "",
      toeflScore: row.toeflScore || row["TOEFL Score"] || "",
      duolingo: row.duolingo || row["Duolingo"] || "",
      gmatScore: row.gmatScore || row["GMAT Score"] || "",
      greScore: row.greScore || row["GRE Score"] || "",
      yearlyTuitionFees:
        row.yearlyTuitionFees || row["Yearly Tuition Fees"] || "",
      currency: row.currency || row["Currency"] || "USD",
      applicationDeadline:
        row.applicationDeadline || row["Application Deadline"] || "",
      workExperience: row.workExperience || row["Work Experience"] || "",
      scholarships: row.scholarships || row["Scholarships"] || "",
      careerProspects: row.careerProspects || row["Career Prospects"] || "",
      accreditation: row.accreditation || row["Accreditation"] || "",
      specializations: row.specializations || row["Specializations"] || "",
    };
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setResult(null);

    try {
      let courses: CourseImportRow[] = [];

      // Check file type and parse accordingly
      if (file.name.endsWith(".csv")) {
        const text = await file.text();
        courses = parseCSV(text);
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        courses = await parseExcel(file);
      } else {
        alert("Unsupported file format. Please use CSV or Excel files.");
        setImporting(false);
        return;
      }

      if (courses.length === 0) {
        alert("No valid course data found in the file");
        setImporting(false);
        return;
      }

      console.log(`Parsed ${courses.length} courses from ${file.name}`);
      console.log("Sample course:", courses[0]);

      const response = await fetch("/api/courses/bulk-import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courses }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.result);
      } else {
        alert(data.error || "Failed to import courses");
      }
    } catch (error) {
      console.error("Error importing courses:", error);
      alert(
        `Failed to import courses: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = (withSamples = false) => {
    const filename = withSamples
      ? "course-import-simple.csv"
      : "course-import-template.csv";
    const url = `/templates/${filename}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bulk Import Courses</h2>
        <div className="flex gap-2">
          <Button
            color="secondary"
            variant="flat"
            startContent={<Download size={20} />}
            onPress={() => downloadTemplate(false)}
          >
            Empty Template
          </Button>
          <Button
            color="primary"
            variant="flat"
            startContent={<Download size={20} />}
            onPress={() => downloadTemplate(true)}
          >
            Sample Data
          </Button>
          <Button
            color="default"
            variant="flat"
            startContent={<FileText size={20} />}
            onPress={() => window.open("/templates/IMPORT_GUIDE.md", "_blank")}
          >
            Import Guide
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText size={20} />
            <span className="font-semibold">Import Instructions</span>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">✨ Auto-Creation Feature:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-green-600 dark:text-green-400">
              <li>
                Countries and universities are automatically created if they
                don&apos;t exist
              </li>
              <li>
                No need to manually create countries and universities first
              </li>
              <li>
                Just upload your CSV file and the system will handle everything
              </li>
            </ul>
            <h4 className="font-medium mb-2 mt-4">CSV Requirements:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>
                Required fields: universityName, countryName, programName,
                studyLevel, entryRequirements
              </li>
              <li>IELTS scores should be numeric (e.g., 6.5, 7.0)</li>
              <li>
                Study levels: Undergraduate, Postgraduate, Doctorate,
                Certificate, Diploma
              </li>
              <li>
                Multiple values (scholarships, specializations) should be
                comma-separated
              </li>
            </ul>
          </div>

          <Divider />

          <div>
            <h4 className="font-medium mb-2">Supported file formats:</h4>
            <div className="flex gap-2">
              <Chip size="sm" variant="flat">
                CSV
              </Chip>
              <Chip size="sm" variant="flat">
                Excel (.xlsx)
              </Chip>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <span className="font-semibold">Upload File</span>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />

            {file ? (
              <div className="text-center space-y-2">
                <FileText size={48} className="mx-auto text-green-500" />
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <Upload size={48} className="mx-auto text-gray-400" />
                <p className="text-gray-500">
                  Click to select a file or drag and drop
                </p>
              </div>
            )}

            <Button
              color="primary"
              variant="flat"
              onPress={() => fileInputRef.current?.click()}
              className="mt-4"
            >
              {file ? "Change File" : "Select File"}
            </Button>
          </div>

          {file && (
            <div className="flex justify-center">
              <Button
                color="primary"
                size="lg"
                onPress={handleImport}
                isLoading={importing}
                startContent={!importing ? <Upload size={20} /> : undefined}
              >
                {importing ? "Importing..." : "Import Courses"}
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {importing && (
        <Card>
          <CardBody>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Importing courses...</span>
              </div>
              <Progress isIndeterminate color="primary" />
            </div>
          </CardBody>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              {result.failed === 0 ? (
                <CheckCircle size={20} className="text-green-500" />
              ) : (
                <AlertCircle size={20} className="text-orange-500" />
              )}
              <span className="font-semibold">Import Results</span>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {result.success}
                </div>
                <div className="text-sm text-gray-500">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {result.failed}
                </div>
                <div className="text-sm text-gray-500">Failed</div>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Messages:</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {result.errors.map((error, index) => {
                    const isSuccess = error.startsWith("✅");
                    return (
                      <Code
                        key={index}
                        size="sm"
                        color={isSuccess ? "success" : "danger"}
                        className="block"
                      >
                        {error}
                      </Code>
                    );
                  })}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
