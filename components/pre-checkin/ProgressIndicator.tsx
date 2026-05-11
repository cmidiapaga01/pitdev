"use client";

import { motion } from "framer-motion";

const STEPS = [
  { number: 1, label: "Tutor" },
  { number: 2, label: "Pet" },
  { number: 3, label: "Vacinas" },
  { number: 4, label: "Higiene" },
  { number: 5, label: "Cuidados" },
  { number: 6, label: "Extras" },
  { number: 7, label: "Termos" },
];

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export function ProgressIndicator({
  currentStep,
}: ProgressIndicatorProps) {
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative h-1.5 bg-[#ffd4d4] rounded-full overflow-hidden mb-4">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#f07070] to-[#40d9c8] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>

      {/* Step labels — show on md+ */}
      <div className="hidden sm:flex justify-between">
        {STEPS.map((step) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;

          return (
            <div key={step.number} className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                  ${isCompleted
                    ? "bg-[#40d9c8] text-white shadow-sm"
                    : isActive
                    ? "bg-[#f07070] text-white shadow-md ring-4 ring-[#f07070]/20"
                    : "bg-[#ffd4d4] text-[#c09080]"
                  }`}
              >
                {isCompleted ? (
                  <svg viewBox="0 0 10 8" className="w-3.5 h-3.5 fill-none stroke-white stroke-2">
                    <path d="M1 4L3.5 6.5L9 1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors
                  ${isActive ? "text-[#f07070]" : isCompleted ? "text-[#40d9c8]" : "text-[#c09080]"}`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile: just show step X of Y */}
      <div className="sm:hidden flex justify-between items-center">
        <span className="text-sm font-semibold text-[#f07070]">
          Passo {currentStep} de {STEPS.length}
        </span>
        <span className="text-xs text-[#8a6050]">
          {STEPS[currentStep - 1]?.label}
        </span>
      </div>
    </div>
  );
}
