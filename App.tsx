import React, { useState } from 'react';
import GardenForm from './components/GardenForm';
import PlanDisplay from './components/PlanDisplay';
import ImageEditor from './components/ImageEditor';
import { GardenPreferences, GeneratedPlan, AppState } from './types';
import { generateGardenPlan, generateInitialGardenImage } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleFormSubmit = async (prefs: GardenPreferences) => {
    setIsLoading(true);
    try {
      // 1. Generate the Plan (Text)
      const newPlan = await generateGardenPlan(prefs);
      setPlan(newPlan);

      // 2. Generate Initial Image
      // We generate a prompt based on the plan title and preferences for the image model
      const imagePrompt = `A beautiful ${prefs.style} garden, ${prefs.climate} climate, ${prefs.sunlight} lighting. ${newPlan.description}`;
      const image = await generateInitialGardenImage(imagePrompt);
      setGeneratedImage(image);

      setAppState(AppState.PLANNING);
    } catch (error) {
      alert("Something went wrong while designing your garden. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAppState(AppState.INPUT);
    setPlan(null);
    setGeneratedImage(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <h1 className="text-xl font-bold tracking-tight text-stone-800">Dream Garden Designer</h1>
          </div>
          <div className="text-sm text-stone-500 hidden sm:block">
            Powered by Gemini
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Progress Stepper */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-stone-200 -z-10" />
            
            <div className={`flex flex-col items-center gap-2 bg-stone-50 px-2 ${appState === AppState.INPUT ? 'text-green-600' : 'text-stone-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${appState === AppState.INPUT ? 'bg-green-600 text-white' : 'bg-stone-200 text-stone-500'}`}>1</div>
              <span className="text-xs font-semibold">Preferences</span>
            </div>

            <div className={`flex flex-col items-center gap-2 bg-stone-50 px-2 ${appState === AppState.PLANNING ? 'text-green-600' : 'text-stone-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${appState === AppState.PLANNING ? 'bg-green-600 text-white' : appState === AppState.VISUALIZING ? 'bg-green-600 text-white' : 'bg-stone-200 text-stone-500'}`}>2</div>
              <span className="text-xs font-semibold">The Plan</span>
            </div>

            <div className={`flex flex-col items-center gap-2 bg-stone-50 px-2 ${appState === AppState.VISUALIZING ? 'text-green-600' : 'text-stone-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${appState === AppState.VISUALIZING ? 'bg-green-600 text-white' : 'bg-stone-200 text-stone-500'}`}>3</div>
              <span className="text-xs font-semibold">Visualize & Edit</span>
            </div>
          </div>
        </div>

        {/* Dynamic Views */}
        <div className="transition-all duration-500">
          {appState === AppState.INPUT && (
            <GardenForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          )}

          {appState === AppState.PLANNING && plan && (
            <PlanDisplay 
              plan={plan} 
              onContinue={() => setAppState(AppState.VISUALIZING)}
            />
          )}

          {appState === AppState.VISUALIZING && (
            <ImageEditor 
              initialImage={generatedImage} 
              onReset={handleReset} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
