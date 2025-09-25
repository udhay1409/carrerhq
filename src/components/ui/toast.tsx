"use client";

import { useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { Toast } from "@/hooks/useToast";

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onRemove]);

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          borderColor: "border-green-200",
          bgColor: "bg-green-50",
          textColor: "text-green-800",
          iconColor: "text-green-600",
          icon: "lucide:check-circle",
        };
      case "error":
        return {
          borderColor: "border-red-200",
          bgColor: "bg-red-50",
          textColor: "text-red-800",
          iconColor: "text-red-600",
          icon: "lucide:x-circle",
        };
      case "warning":
        return {
          borderColor: "border-yellow-200",
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-800",
          iconColor: "text-yellow-600",
          icon: "lucide:alert-triangle",
        };
      case "info":
      default:
        return {
          borderColor: "border-blue-200",
          bgColor: "bg-blue-50",
          textColor: "text-blue-800",
          iconColor: "text-blue-600",
          icon: "lucide:info",
        };
    }
  };

  const styles = getToastStyles();

  return (
    <Card
      className={`${styles.borderColor} ${styles.bgColor} border animate-in slide-in-from-right-full duration-300`}
    >
      <CardBody className="p-4">
        <div className="flex items-start gap-3">
          <Icon
            icon={styles.icon}
            className={`w-5 h-5 ${styles.iconColor} flex-shrink-0 mt-0.5`}
          />
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${styles.textColor}`}>
              {toast.message}
            </p>
          </div>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => onRemove(toast.id)}
            className="flex-shrink-0 -mt-1 -mr-1"
          >
            <Icon icon="lucide:x" className="w-4 h-4" />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
