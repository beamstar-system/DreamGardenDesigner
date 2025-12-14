import { GoogleGenAI, Type } from "@google/genai";
import { GardenPreferences, GeneratedPlan } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to clean base64 string
const cleanBase64 = (data: string) => {
  return data.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

export const generateGardenPlan = async (prefs: GardenPreferences): Promise<GeneratedPlan> => {
  const prompt = `Create a garden design plan for a ${prefs.size} garden in a ${prefs.climate} climate.
  The user wants a "${prefs.style}" style garden.
  Sunlight conditions: ${prefs.sunlight}.
  Additional notes: ${prefs.notes}.
  
  Please provide a JSON response with the following structure:
  - title: A creative name for the garden.
  - description: A visual description of the layout and atmosphere (max 100 words).
  - plantRecommendations: An array of 5 specific plant names suitable for these conditions.
  - maintenanceTips: An array of 3 short maintenance tips.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            plantRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            maintenanceTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from model");
    return JSON.parse(text) as GeneratedPlan;
  } catch (error) {
    console.error("Error generating plan:", error);
    throw error;
  }
};

export const generateInitialGardenImage = async (description: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image", // Nano banana
      contents: `Photorealistic garden visualization: ${description}`,
    });

    // Iterate through parts to find the image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const editGardenImage = async (
  imageBase64: string,
  prompt: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image", // Nano banana for editing
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: "image/png",
              data: cleanBase64(imageBase64),
            },
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated from edit");
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};
