import React, { useState, useRef } from 'react';
import { editGardenImage } from '../services/geminiService';

interface ImageEditorProps {
  initialImage: string | null;
  onReset: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ initialImage, onReset }) => {
  const [currentImage, setCurrentImage] = useState<string | null>(initialImage);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<string[]>(initialImage ? [initialImage] : []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCurrentImage(result);
        setHistory([result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!currentImage || !prompt.trim()) return;

    setIsProcessing(true);
    try {
      // Use the Nano banana model to edit the image based on text
      const newImage = await editGardenImage(currentImage, prompt);
      setCurrentImage(newImage);
      setHistory(prev => [...prev, newImage]);
      setPrompt(''); // Clear prompt after successful edit
    } catch (error) {
      alert("Failed to edit image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setCurrentImage(newHistory[newHistory.length - 1]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-stone-800">Garden Visualizer & Editor</h2>
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="text-sm px-4 py-2 text-stone-600 hover:text-stone-900 underline"
          >
            Start Over
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-sm px-4 py-2 bg-white border border-stone-300 rounded-lg hover:bg-stone-50"
          >
            Upload Photo
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Image View */}
        <div className="lg:col-span-2 relative group rounded-2xl overflow-hidden shadow-lg bg-stone-900 aspect-video flex items-center justify-center">
          {currentImage ? (
            <>
              <img 
                src={currentImage} 
                alt="Garden Visualization" 
                className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${isProcessing ? 'opacity-50' : 'opacity-100'}`}
              />
              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-3"></div>
                    <span className="text-white font-medium text-lg drop-shadow-md">Refining your garden...</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-8 text-stone-400">
              <p>No image loaded.</p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 px-6 py-2 bg-stone-800 rounded-lg text-white hover:bg-stone-700"
              >
                Upload a photo of your yard
              </button>
            </div>
          )}
        </div>

        {/* Editor Controls */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col h-full">
          <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" clipRule="evenodd" />
            </svg>
            Magic Editor
          </h3>
          
          <div className="flex-grow space-y-4">
            <p className="text-sm text-stone-500">
              Use AI to modify your garden visualization. Try commands like:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Add a retro filter",
                "Add a wooden pergola",
                "Make it sunset",
                "Add red roses in the corner",
                "Remove the weeds"
              ].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => setPrompt(suggestion)}
                  className="text-xs bg-stone-100 text-stone-600 px-3 py-1.5 rounded-full hover:bg-stone-200 transition-colors border border-stone-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Edit Instruction
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe how you want to change the image..."
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-stone-50 resize-none h-32"
              />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleEdit}
              disabled={isProcessing || !currentImage || !prompt.trim()}
              className={`w-full py-3 rounded-xl text-white font-medium shadow-md transition-all flex items-center justify-center gap-2 ${
                isProcessing || !currentImage || !prompt.trim()
                  ? 'bg-stone-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-purple-500/25'
              }`}
            >
              <span>✨ Generate Edit</span>
            </button>
            
            <button
              onClick={handleUndo}
              disabled={history.length <= 1 || isProcessing}
              className="w-full py-3 rounded-xl text-stone-600 font-medium hover:bg-stone-100 transition-colors disabled:opacity-50 disabled:hover:bg-transparent border border-transparent hover:border-stone-200"
            >
              Undo Last Change
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
