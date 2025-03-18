
import { toast } from "sonner";
import { Category } from "@/types/metrics";

// Interface for the insights structure
export interface GeneratedInsights {
  positiveInsights: Array<{ title: string; description: string }>;
  negativeInsights: Array<{ title: string; description: string }>;
  warningInsights: Array<{ title: string; description: string }>;
  recommendations: Array<{ title: string; description: string }>;
}

// Interface for the prompt structure to organize our data for the LLM
interface InsightPrompt {
  categories: {
    name: string;
    metrics: Array<{
      name: string;
      currentValue: string | number;
      previousValue: string | number;
      change: number;
      janAvg: string | number;
      febAvg: string | number;
    }>;
  }[];
}

/**
 * Generates insights from metrics data using an LLM
 */
export const generateLLMInsights = async (
  categories: Category[]
): Promise<GeneratedInsights | null> => {
  try {
    // Prepare data for the prompt
    const promptData: InsightPrompt = {
      categories: categories.map(category => ({
        name: category.name,
        metrics: category.metrics.map(metric => {
          // Convert values to numbers if they're strings with numbers
          const currentValue = typeof metric.currentPeriod.value === 'string' 
            ? parseFloat(metric.currentPeriod.value.replace('%', '')) 
            : metric.currentPeriod.value;
          
          const previousValue = typeof metric.previousPeriod.value === 'string'
            ? parseFloat(metric.previousPeriod.value.replace('%', ''))
            : metric.previousPeriod.value;
          
          // Calculate change percentage
          let change = 0;
          if (!isNaN(Number(currentValue)) && !isNaN(Number(previousValue)) && Number(previousValue) !== 0) {
            change = ((Number(currentValue) - Number(previousValue)) / Number(previousValue)) * 100;
          }

          return {
            name: metric.name,
            currentValue: metric.currentPeriod.value,
            previousValue: metric.previousPeriod.value,
            change,
            janAvg: metric.janAvg.value,
            febAvg: metric.febAvg.value
          };
        })
      }))
    };

    // Create the prompt for the LLM
    const prompt = `
      You are an analytics expert tasked with generating insights from dashboard metrics.
      Analyze the following metrics data and generate:
      1. 3 positive insights about metrics that are performing well (significant improvements)
      2. 3 negative insights about metrics that need attention (significant declines)
      3. 3 warning insights for metrics that are below historical averages
      4. 3 actionable recommendations based on the insights

      Here is the data:
      ${JSON.stringify(promptData, null, 2)}

      Format your response as a JSON object with the following structure:
      {
        "positiveInsights": [{"title": "string", "description": "string"}],
        "negativeInsights": [{"title": "string", "description": "string"}],
        "warningInsights": [{"title": "string", "description": "string"}],
        "recommendations": [{"title": "string", "description": "string"}]
      }

      Ensure that:
      - Each insight has a concise title and a descriptive explanation
      - Focus on the most significant changes and patterns
      - Keep descriptions between 100-150 characters
      - Make recommendations specific and actionable
      - If there aren't enough metrics for a category, return fewer insights
      - Only provide response in the JSON format specified above, with no additional text
    `;

    // Show toast for generating insights
    toast.loading("Generating insights with AI...");

    // Call the OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("openai_api_key") || ""}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates analytics insights from metrics data."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to generate insights");
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    toast.success("AI insights generated successfully");
    
    return result;
  } catch (error) {
    console.error("Error generating insights:", error);
    toast.error("Failed to generate insights. Please check your API key.");
    return null;
  }
};
