"use client";

import { useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import { CountryManagement } from "@/components/admin/education/country-management";
import { UniversityManagement } from "@/components/admin/education/university-management";
import { CourseManagement } from "@/components/admin/education/course-management";
import { BulkImport } from "@/components/admin/education/bulk-import";

export default function EducationAdminPage() {
  const [selectedTab, setSelectedTab] = useState("countries");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Education Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage countries, universities, and courses for your education
          platform
        </p>
      </div>

      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
        variant="underlined"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-primary",
        }}
      >
        <Tab key="countries" title="Countries">
          <Card>
            <CardBody>
              <CountryManagement />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="universities" title="Universities">
          <Card>
            <CardBody>
              <UniversityManagement />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="courses" title="Courses">
          <Card>
            <CardBody>
              <CourseManagement />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="bulk-import" title="Bulk Import">
          <Card>
            <CardBody>
              <BulkImport />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
