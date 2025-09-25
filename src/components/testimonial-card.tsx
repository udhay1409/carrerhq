import React from "react";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Icon } from "@iconify/react";

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  avatarId: string;
  rating: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  content,
  avatarId,
  rating,
}) => {
  return (
    <Card className="border border-default-200">
      <CardBody className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3">
            <Avatar
              src={avatarId}
              size="lg"
              className="border-2 border-primary"
            />
            <div>
              <h4 className="font-semibold">{name}</h4>
              <p className="text-foreground-500 text-sm">{role}</p>
            </div>
          </div>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, index) => (
              <Icon
                key={index}
                icon="lucide:star"
                className={index < rating ? "text-warning" : "text-default-300"}
                width={16}
              />
            ))}
          </div>
        </div>

        <div className="relative">
          <Icon
            icon="lucide:quote"
            className="absolute -top-2 -left-1 text-primary/10 rotate-180"
            width={24}
          />
          <p className="text-foreground-600 italic pl-4 relative z-10">
            {content}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};
