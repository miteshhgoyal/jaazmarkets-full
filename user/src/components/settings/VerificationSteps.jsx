import React from "react";

const VerificationSteps = ({ steps }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900">
        Verification Steps
      </h2>
      <div className="mt-4 border border-gray-300 rounded-lg bg-white overflow-hidden">
        {steps.map((step) => {
          return (
            <div className="flex gap-2 justify-between items-center p-6 border-b border-gray-300">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 p-1 bg-gray-600 font-semibold text-white rounded-full text-xs flex items-center justify-center">
                  {step.count}
                </span>
                <div>
                  <h2 className="text-sm text-gray-700 font-medium">
                    {step.heading}
                  </h2>
                  <h2 className="text-xs text-gray-500">{step.value}</h2>
                </div>
              </div>
              <span
                className={`w-fit px-3 py-0.5 bg-gray-100 font-medium rounded-full text-xs ${
                  step.status == "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {step.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VerificationSteps;
