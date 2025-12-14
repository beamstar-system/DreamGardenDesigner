import React from 'react';
import { GeneratedPlan } from '../types';

interface PlanDisplayProps {
  plan: GeneratedPlan;
  onContinue: () => void;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, onContinue }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
        <div className="border-b border-stone-100 pb-6 mb-6">
          <h2 className="text-3xl font-bold text-stone-800">{plan.title}</h2>
          <p className="text-stone-600 mt-2 text-lg leading-relaxed">{plan.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
              <span className="mr-2">🌿</span> Recommended Plants
            </h3>
            <ul className="space-y-3">
              {plan.plantRecommendations.map((plant, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-3 bg-green-400 rounded-full flex-shrink-0" />
                  <span className="text-stone-700">{plant}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-amber-700 mb-4 flex items-center">
              <span className="mr-2">🛠️</span> Maintenance Tips
            </h3>
            <ul className="space-y-3">
              {plan.maintenanceTips.map((tip, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-3 bg-amber-400 rounded-full flex-shrink-0" />
                  <span className="text-stone-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
         <button
          onClick={onContinue}
          className="px-8 py-3 bg-stone-800 text-white rounded-xl hover:bg-stone-900 transition-colors shadow-lg font-medium flex items-center"
        >
          Open Visual Editor &rarr;
        </button>
      </div>
    </div>
  );
};

export default PlanDisplay;
