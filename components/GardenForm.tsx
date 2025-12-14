import React, { useState } from 'react';
import { GardenPreferences } from '../types';

interface GardenFormProps {
  onSubmit: (prefs: GardenPreferences) => void;
  isLoading: boolean;
}

const GardenForm: React.FC<GardenFormProps> = ({ onSubmit, isLoading }) => {
  const [prefs, setPrefs] = useState<GardenPreferences>({
    style: 'Modern Minimalist',
    climate: 'Temperate',
    size: 'Medium Backyard',
    sunlight: 'Partial Sun',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPrefs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prefs);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
      <h2 className="text-2xl font-bold text-stone-800 mb-6">Describe Your Dream Garden</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Garden Style</label>
            <select
              name="style"
              value={prefs.style}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-stone-50"
            >
              <option>Modern Minimalist</option>
              <option>English Cottage</option>
              <option>Japanese Zen</option>
              <option>Mediterranean</option>
              <option>Wildflower Meadow</option>
              <option>Vegetable & Herb</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Climate Zone</label>
            <select
              name="climate"
              value={prefs.climate}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-stone-50"
            >
              <option>Tropical</option>
              <option>Subtropical</option>
              <option>Temperate</option>
              <option>Arid / Desert</option>
              <option>Cold / Alpine</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Space Size</label>
            <select
              name="size"
              value={prefs.size}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-stone-50"
            >
              <option>Small Balcony</option>
              <option>Small Courtyard</option>
              <option>Medium Backyard</option>
              <option>Large Estate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Sunlight</label>
            <select
              name="sunlight"
              value={prefs.sunlight}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-stone-50"
            >
              <option>Full Sun</option>
              <option>Partial Sun</option>
              <option>Full Shade</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-2">Specific Wishes or Notes</label>
          <textarea
            name="notes"
            value={prefs.notes}
            onChange={handleChange}
            placeholder="e.g., I want a fire pit, low maintenance plants, and a small water feature."
            className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-stone-50 min-h-[100px]"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-xl text-white font-semibold text-lg transition-all ${
            isLoading 
              ? 'bg-stone-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-green-500/30'
          }`}
        >
          {isLoading ? 'Generating Plan...' : 'Design My Garden'}
        </button>
      </form>
    </div>
  );
};

export default GardenForm;
