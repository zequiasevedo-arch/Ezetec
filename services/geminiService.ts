import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeMaintenanceRequest = async (description: string, contextTitle: string): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key missing for Gemini Service");
    return "Erro: Chave de API não configurada. Verifique o ambiente.";
  }

  try {
    const prompt = `
      Atue como especialista em manutenção predial e engenharia.
      
      Local/Contexto: ${contextTitle}
      Descrição do Problema: ${description}
      
      Tarefa:
      Analise o problema descrito e forneça:
      1. Diagnóstico provável (Causa raiz)
      2. Ferramentas sugeridas para o reparo
      3. EPIs (Equipamentos de Proteção Individual) recomendados
      
      Formato: Resposta concisa em português do Brasil, em texto corrido ou tópicos breves, máximo de 60 palavras.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Sem análise gerada.";
  } catch (error) {
    console.error("Gemini Service Error:", error);
    return "Não foi possível gerar o diagnóstico no momento.";
  }
};