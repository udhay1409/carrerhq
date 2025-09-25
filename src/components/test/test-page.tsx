"use client";

import React from "react";
import { Card, CardBody } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Button } from "@heroui/button";
import { RadioGroup, Radio } from "@heroui/radio";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

interface TestQuestion {
  id: number;
  question: string;
  category: string;
}

interface TestPageProps {
  questions: TestQuestion[];
}

export function TestPage({ questions }: TestPageProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [answers, setAnswers] = React.useState<Record<number, string>>({});
  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const currentQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const progress = (currentPage / totalPages) * 100;

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const isPageComplete = currentQuestions.every(
    (question) => answers[question.id]
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="mb-8">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Career Profiling Test</h1>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <Progress
              value={progress}
              className="mb-8"
              color="primary"
              showValueLabel
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {currentQuestions.map((question) => (
                  <div key={question.id} className="space-y-4">
                    <h3 className="text-lg font-medium">
                      {question.id}. {question.question}
                    </h3>
                    <RadioGroup
                      value={answers[question.id] || ""}
                      onValueChange={(value) =>
                        handleAnswer(question.id, value)
                      }
                      orientation="horizontal"
                      className="gap-6"
                    >
                      <Radio value="Never">Never</Radio>
                      <Radio value="Sometimes">Sometimes</Radio>
                      <Radio value="Always">Always</Radio>
                    </RadioGroup>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-8 pt-4 border-t">
              <Button
                variant="flat"
                onPress={handlePrevious}
                isDisabled={currentPage === 1}
                startContent={<Icon icon="lucide:arrow-left" />}
              >
                Previous
              </Button>
              <Button
                color="primary"
                onPress={handleNext}
                isDisabled={!isPageComplete}
                endContent={
                  currentPage === totalPages ? (
                    <Icon icon="lucide:check" />
                  ) : (
                    <Icon icon="lucide:arrow-right" />
                  )
                }
              >
                {currentPage === totalPages ? "Submit" : "Next"}
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Progress indicators */}
        <div className="flex flex-wrap gap-2 justify-center">
          {Array.from({ length: totalPages }).map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index + 1 === currentPage
                  ? "bg-primary scale-125"
                  : index + 1 < currentPage
                  ? "bg-primary/50"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
