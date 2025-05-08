import { cn } from "@/lib/utils";
import { CheckCircle2Icon } from "lucide-react";

interface StepProps {
  step: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}

const Step = ({ step, title, isActive, isCompleted }: StepProps) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold",
          isActive
            ? "border-primary bg-primary text-primary-foreground"
            : isCompleted
            ? "border-green-500 bg-green-50 text-green-700"
            : "border-muted-foreground/30 text-muted-foreground"
        )}
      >
        {isCompleted ? (
          <CheckCircle2Icon className="h-5 w-5 text-green-500" />
        ) : (
          step
        )}
      </div>
      <p
        className={cn(
          "mt-2 text-sm font-medium",
          isActive
            ? "text-foreground"
            : isCompleted
            ? "text-green-600"
            : "text-muted-foreground"
        )}
      >
        {title}
      </p>
    </div>
  );
};

interface StepperProps {
  currentStep: number;
}

export function BecomeSellerStepper({ currentStep }: StepperProps) {
  const steps = [
    "Connect Telegram",
    "Add Bot to Channel",
    "Complete Application",
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        {steps.map((title, index) => (
          <div key={index} className="flex flex-col items-center w-full">
            <Step
              step={index + 1}
              title={title}
              isActive={currentStep === index}
              isCompleted={currentStep > index}
            />
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-[2px] flex-1 w-full mt-5",
                  currentStep > index ? "bg-green-500" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
