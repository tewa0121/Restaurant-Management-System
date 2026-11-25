import React from 'react';
import { ShoppingBag, Utensils, CheckCircle2, Clock } from 'lucide-react';

export default function OrderProcessSteps({ currentStep = 1 }) {
  const steps = [
    { id: 1, label: 'Selection', icon: ShoppingBag },
    { id: 2, label: 'Kitchen Prep', icon: Clock },
    { id: 3, label: 'Serving / Delivery', icon: Utensils },
    { id: 4, label: 'Completed', icon: CheckCircle2 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="flex items-center justify-between max-w-xl mx-auto">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isCompleted || isCurrent
                      ? 'bg-emerald-600 text-white shadow-md ring-4 ring-emerald-50 dark:ring-emerald-950/50'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[10px] font-bold ${
                    isCurrent || isCompleted
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 -mt-4 transition-colors ${
                    isCompleted ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}