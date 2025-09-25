export interface Country {
  id: string;
  name: string;
  code?: string; // ISO country code (e.g., 'US', 'UK', 'CA')
  flagImageId?: string; // Cloudinary image ID for flag
  imageId?: string; // Cloudinary image ID for country image
  description?: string;
  costOfLiving?: string;
  visaRequirements?: string;
  scholarshipsAvailable?: string;
  // Keep existing fields for backward compatibility
  currency?: string;
  language?: string;
  timezone?: string;
  published?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CountryWithCounts extends Country {
  universities: number;
  courses: number;
}

export interface University {
  id: string;
  name: string;
  countryId: string;
  location: string;
  website?: string;
  imageId?: string;
  description?: string;
  ranking?: number;
  established?: number;
  type: "Public" | "Private";
  campusSize?: string;
  studentPopulation?: string;
  internationalStudents?: string;
  accommodation?: string;
  facilities?: string[];
  tags?: string[];
  courses?: number; // For display purposes
  published?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  // Populated fields
  country?: Country;
}

export interface Course {
  id: string;
  universityId: string;
  countryId: string;
  programName: string;
  studyLevel:
    | "Undergraduate"
    | "Postgraduate"
    | "Doctorate"
    | "Certificate"
    | "Diploma";
  campus: string;
  duration: string;
  openIntakes: string;
  intakeYear: string;
  entryRequirements: string;
  ieltsScore: number;
  ieltsNoBandLessThan: number;
  pteScore?: number;
  pteNoBandLessThan?: number;
  toeflScore?: number;
  duolingo?: number;
  gmatScore?: number;
  greScore?: number;
  yearlyTuitionFees: string;
  currency?: string;
  applicationDeadline?: string;
  workExperience?: string;
  scholarships?: string[];
  careerProspects?: string[];
  accreditation?: string[];
  specializations?: string[];
  published?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  // Populated fields
  university?: University;
  country?: Country;
}

// Form interfaces for admin
export interface CreateCountryData {
  name: string;
  code?: string;
  flagImageId?: string;
  imageId?: string;
  description?: string;
  costOfLiving?: string;
  visaRequirements?: string;
  scholarshipsAvailable?: string;
  // Keep existing fields for backward compatibility
  currency?: string;
  language?: string;
  timezone?: string;
  published?: boolean;
}

export interface CreateUniversityData {
  name: string;
  countryId: string;
  location: string;
  website?: string;
  imageId?: string;
  description?: string;
  ranking?: number;
  established?: number;
  type: "Public" | "Private";
  campusSize?: string;
  studentPopulation?: string;
  internationalStudents?: string;
  accommodation?: string;
  facilities?: string[];
  published?: boolean;
}

export interface CreateCourseData {
  universityId: string;
  countryId: string;
  programName: string;
  studyLevel:
    | "Undergraduate"
    | "Postgraduate"
    | "Doctorate"
    | "Certificate"
    | "Diploma";
  campus: string;
  duration: string;
  openIntakes: string;
  intakeYear: string;
  entryRequirements: string;
  ieltsScore: number;
  ieltsNoBandLessThan: number;
  pteScore?: number;
  pteNoBandLessThan?: number;
  toeflScore?: number;
  duolingo?: number;
  gmatScore?: number;
  greScore?: number;
  yearlyTuitionFees: string;
  currency?: string;
  applicationDeadline?: string;
  workExperience?: string;
  scholarships?: string[];
  careerProspects?: string[];
  accreditation?: string[];
  specializations?: string[];
  published?: boolean;
}

// Bulk import interfaces
export interface BulkImportResult {
  success: number;
  failed: number;
  errors: string[];
}

export interface CourseImportRow {
  universityName: string;
  countryName: string;
  programName: string;
  studyLevel: string;
  campus: string;
  duration: string;
  openIntakes: string;
  intakeYear: string;
  entryRequirements: string;
  ieltsScore: string;
  ieltsNoBandLessThan: string;
  pteScore?: string;
  pteNoBandLessThan?: string;
  toeflScore?: string;
  duolingo?: string;
  gmatScore?: string;
  greScore?: string;
  yearlyTuitionFees: string;
  currency?: string;
  applicationDeadline?: string;
  workExperience?: string;
  scholarships?: string;
  careerProspects?: string;
  accreditation?: string;
  specializations?: string;
}
