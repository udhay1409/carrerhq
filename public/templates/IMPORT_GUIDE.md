# Course Import Guide

## 📋 Overview

This guide explains how to prepare and import course data using CSV or Excel files.

## 📁 Available Templates

### 1. **course-import-template.csv**

- Empty template with just headers
- Use this to create your own course data from scratch

### 2. **course-import-sample.csv**

- Template with 20+ sample courses from top universities
- Includes data from US, UK, Canada, Australia, Germany, Ireland, and France
- Use this as a reference for proper formatting

### 3. **course-import-excel-template.csv**

- Excel-compatible format with quoted fields
- Better for Excel users who prefer working with spreadsheets

## 📊 Required Columns

| Column Name         | Required | Description            | Example                             |
| ------------------- | -------- | ---------------------- | ----------------------------------- |
| universityName      | ✅       | Full university name   | "Harvard University"                |
| countryName         | ✅       | Full country name      | "United States"                     |
| programName         | ✅       | Complete program name  | "Master of Business Administration" |
| studyLevel          | ✅       | Level of study         | "Postgraduate"                      |
| campus              | ✅       | Campus name            | "Main Campus"                       |
| duration            | ✅       | Program duration       | "2 years"                           |
| openIntakes         | ✅       | Available intakes      | "September, January"                |
| intakeYear          | ✅       | Year of intake         | "2024"                              |
| entryRequirements   | ✅       | Admission requirements | "Bachelor's degree with 3.0 GPA"    |
| ieltsScore          | ✅       | Required IELTS score   | "7.0"                               |
| ieltsNoBandLessThan | ✅       | Minimum band score     | "6.5"                               |
| yearlyTuitionFees   | ✅       | Annual tuition         | "$50,000"                           |

## 📝 Optional Columns

| Column Name         | Description                 | Example                              |
| ------------------- | --------------------------- | ------------------------------------ |
| pteScore            | PTE Academic score          | "65"                                 |
| pteNoBandLessThan   | PTE minimum band            | "58"                                 |
| toeflScore          | TOEFL iBT score             | "100"                                |
| duolingo            | Duolingo English Test       | "120"                                |
| gmatScore           | GMAT score                  | "650"                                |
| greScore            | GRE score                   | "320"                                |
| currency            | Fee currency                | "USD"                                |
| applicationDeadline | Application deadline        | "January 15, 2024"                   |
| workExperience      | Work experience requirement | "2 years preferred"                  |
| scholarships        | Available scholarships      | "Merit scholarships, Need-based aid" |
| careerProspects     | Career opportunities        | "Management, Consulting, Finance"    |
| accreditation       | Program accreditations      | "AACSB, EQUIS"                       |
| specializations     | Available specializations   | "Finance, Marketing, Strategy"       |

## ✅ Data Validation Rules

### Study Levels

Must be one of:

- `Undergraduate`
- `Postgraduate`
- `Doctorate`
- `Certificate`
- `Diploma`

### Score Formats

- **IELTS**: 0.0 to 9.0 (e.g., "6.5", "7.0")
- **PTE**: 0 to 90 (e.g., "65", "58")
- **TOEFL**: 0 to 120 (e.g., "100", "90")
- **Duolingo**: 0 to 160 (e.g., "120", "130")
- **GMAT**: 200 to 800 (e.g., "650", "700")
- **GRE**: 260 to 340 (e.g., "320", "330")

### Multiple Values

For fields that accept multiple values, separate with commas:

```
scholarships: "Merit scholarships, Need-based aid, Athletic scholarships"
careerProspects: "Software Engineer, Data Scientist, Product Manager"
specializations: "AI/ML, Cybersecurity, Software Engineering"
```

## 🚨 Common Errors & Solutions

### 1. **Country/University Not Found**

**Error**: `Country "United State" not found`
**Solution**: Ensure exact country names match what's in the system:

- ✅ "United States"
- ❌ "United State", "USA", "US"

### 2. **Invalid Study Level**

**Error**: `Invalid study level "Masters"`
**Solution**: Use exact values:

- ✅ "Postgraduate"
- ❌ "Masters", "Graduate", "MS"

### 3. **Invalid IELTS Score**

**Error**: `Invalid IELTS scores`
**Solution**: Use numeric format:

- ✅ "6.5", "7.0"
- ❌ "6.5 overall", "7", "six point five"

### 4. **Missing Required Fields**

**Error**: `Missing required fields`
**Solution**: Ensure all required columns have values

### 5. **Duplicate Courses**

**Error**: `Course already exists`
**Solution**: Check for existing courses with same program name at the same university

## 📋 Pre-Import Checklist

Before importing, ensure:

- [ ] All countries exist in the system
- [ ] All universities exist and are linked to correct countries
- [ ] Required columns are filled
- [ ] IELTS/PTE/TOEFL scores are numeric
- [ ] Study levels use exact values
- [ ] Currency codes are standard (USD, GBP, EUR, etc.)
- [ ] Multiple values are comma-separated
- [ ] No duplicate courses in your file

## 🔄 Import Process

1. **Prepare Data**: Fill in the CSV template
2. **Validate**: Check against the rules above
3. **Upload**: Use the bulk import interface
4. **Review**: Check import results for errors
5. **Fix Issues**: Correct any failed imports
6. **Re-import**: Upload corrected data if needed

## 💡 Tips for Success

### Excel Users

1. Save as CSV (UTF-8) format
2. Use quotes around text with commas
3. Keep numeric fields as numbers
4. Avoid special characters in university names

### Large Imports

1. Import in batches of 50-100 courses
2. Test with a small sample first
3. Keep a backup of your original data
4. Review error messages carefully

### Data Quality

1. Use consistent naming conventions
2. Verify university names are exact matches
3. Double-check all numeric scores
4. Ensure dates are in readable format

## 📞 Support

If you encounter issues:

1. Check the error messages in the import results
2. Verify your data against this guide
3. Test with the sample data first
4. Contact support with specific error details

## 📈 Sample Data Overview

The sample file includes courses from:

**United States**: Harvard, Stanford, MIT
**United Kingdom**: Oxford, Cambridge, LSE  
**Canada**: Toronto, McGill, UBC
**Australia**: Melbourne, ANU, Sydney
**Germany**: TUM, RWTH Aachen, Mannheim
**Ireland**: Trinity College Dublin, UCD
**France**: NEOMA, ESSEC, Sorbonne

Study levels include both Undergraduate and Postgraduate programs across various fields like Business, Engineering, Computer Science, and more.
