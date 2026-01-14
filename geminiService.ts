
import { GoogleGenAI, Type } from "@google/genai";

export async function analyzePhoto(base64Image: string, mimeType: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analyze this photo and provide structured metadata. 
  Extract the following:
  1. Captions/Notes: A brief description.
  2. Suggested Tags: Up to 5 relevant keywords.
  3. Suggested Category: One of (Nature, Architecture, Travel, People, Abstract, Other).
  4. Likely Location: If recognizable, suggest a place name.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { inlineData: { data: base64Image, mimeType } },
            { text: prompt }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            notes: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            category: { type: Type.STRING },
            locationName: { type: Type.STRING }
          },
          required: ["notes", "tags", "category"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return null;
  }
}
