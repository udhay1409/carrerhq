export interface Course {
  id?: string | number;
  serialNo: number;
  university: string;
  programName: string;
  campus: string;
  duration: string;
  openIntakes: string;
  intakeYear: string;
  entryRequirements: string;
  ieltsScore: number;
  ieltsNoBandLessThan: number;
  pteScore: number | null;
  pteNoBandLessThan: number | null;
  yearlyTuitionFees: string;
  // Additional fields for all countries
  country: string;
  studyLevel?: string;
  toeflScore?: number;
  applicationDeadline?: string;
  // Optional fields for specific countries
  duolingo?: number;
  gmatScore?: number | null;
  greScore?: number;
  workExperience?: string;
  scholarships?: string[];
  // Additional optional fields from different data sources
  tuitionFee?: string;
  currency?: string;
  careerProspects?: string[];
  universityRanking?: number;
  programRanking?: number;
  accreditation?: string[];
  specializations?: string[];
}

export interface CoursesByCountry {
  [countryCode: string]: Course[];
}
