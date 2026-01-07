
import { GoogleGenAI, Type } from "@google/genai";
import { PredictionSlip, Match } from "../types";

// Always use named parameter for apiKey and direct process.env.API_KEY access
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchFootballPredictions = async (date: string): Promise<PredictionSlip> => {
  const prompt = `
    Aja como um analista de futebol profissional e especialista em apostas esportivas. 
    1. Pesquise usando o Google Search os jogos de futebol reais que ocorrerão na data: ${date}.
    2. Considere campeonatos internacionais (Champions, Europa League, etc.) e principais ligas nacionais (Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Brasileirão).
    3. Selecione exatamente os 14 jogos mais interessantes e com maior volume de dados estatísticos.
    4. Para cada jogo, gere uma 'CustomBet' inteligente composta por EXATAMENTE 2 mercados combinados em português (ex: Vitoria Casa e Mais de 1.5 gols).
    5. Estime a probabilidade de acerto (0-100%) e forneça um insight curto explicando o "porquê" baseado em forma recente ou histórico.
    
    Retorne a resposta estritamente no formato JSON.
  `;

  try {
    // We provide a responseSchema to ensure the model follows the JSON structure even when using tools
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  homeTeam: { type: Type.STRING },
                  awayTeam: { type: Type.STRING },
                  league: { type: Type.STRING },
                  time: { type: Type.STRING },
                  customBet: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        description: { type: Type.STRING }
                      },
                      required: ["name", "description"]
                    },
                    description: "EXATAMENTE 2 mercados combinados"
                  },
                  probability: { type: Type.NUMBER, description: "Probabilidade de 0 a 100" },
                  insight: { type: Type.STRING }
                },
                required: ["homeTeam", "awayTeam", "league", "time", "customBet", "probability", "insight"]
              }
            }
          },
          required: ["matches"]
        }
      },
    });

    // The output response.text may contain surrounding text or markdown blocks when grounding is enabled.
    // Use regex to isolate the JSON object for robust parsing.
    const text = response.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : "{}";
    const data = JSON.parse(jsonStr);
    
    // Extract grounding sources from groundingMetadata to provide citations in the UI
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Fonte de dados",
      uri: chunk.web?.uri || "#"
    })) || [];

    const matchesWithId = (data.matches || []).map((m: any, idx: number) => ({
      ...m,
      id: `match-${idx}-${Date.now()}`,
      date: date
    }));

    const avgProb = matchesWithId.length > 0 
      ? matchesWithId.reduce((acc: number, m: any) => acc + (m.probability || 0), 0) / matchesWithId.length
      : 0;

    return {
      id: `slip-${Date.now()}`,
      date,
      matches: matchesWithId,
      averageProbability: Math.round(avgProb),
      groundingSources: sources
    };
  } catch (error) {
    console.error("Error fetching predictions:", error);
    throw new Error("Falha ao buscar dados de futebol. Verifique sua conexão ou tente novamente mais tarde.");
  }
};
