"use client";

import { TestPage } from "@/components/test/test-page";
import { careerTestQuestions } from "@/data/career-test-questions";

export default function CareerTestPage() {
  return <TestPage questions={careerTestQuestions} />;
}
