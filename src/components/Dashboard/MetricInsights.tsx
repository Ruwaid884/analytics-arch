
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDownIcon, TrendingUpIcon, AlertCircleIcon, Brain, Loader2 } from "lucide-react";
import { Category, Metric } from "@/types/metrics";
import { useMemo, useState, useEffect } from "react";
import { generateLLMInsights, GeneratedInsights } from "@/utils/llmService";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface MetricInsightsProps {
  categories: Category[];
}

const MetricInsights = ({ categories }: MetricInsightsProps) => {
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem("openai_api_key") || "");
  const [isGeneratingLLMInsights, setIsGeneratingLLMInsights] = useState(false);
  const [llmInsights, setLlmInsights] = useState<GeneratedInsights | null>(null);

  // Calculate algorithmic insights (non-LLM) as a fallback
  const algorithmicInsights = useMemo(() => {
    const result = {
      positiveInsights: [] as { title: string; description: string }[],
      negativeInsights: [] as { title: string; description: string }[],
      warningInsights: [] as { title: string; description: string }[]
    };
    
    // Find metrics with significant changes
    categories.forEach(category => {
      category.metrics.forEach(metric => {
        // Skip metrics without current or previous values
        if (metric.currentPeriod.value === '' || metric.previousPeriod.value === '') {
          return;
        }
        
        // Convert values to numbers if they're strings with numbers
        const currentValue = typeof metric.currentPeriod.value === 'string' 
          ? parseFloat(metric.currentPeriod.value.replace('%', '')) 
          : metric.currentPeriod.value;
        
        const previousValue = typeof metric.previousPeriod.value === 'string'
          ? parseFloat(metric.previousPeriod.value.replace('%', ''))
          : metric.previousPeriod.value;
        
        // Skip if values aren't numbers
        if (isNaN(Number(currentValue)) || isNaN(Number(previousValue))) {
          return;
        }
        
        const percentChange = ((Number(currentValue) - Number(previousValue)) / Number(previousValue)) * 100;
        
        // Add significant positive changes to positive insights
        if (percentChange > 5) {
          result.positiveInsights.push({
            title: `${metric.name} Increase`,
            description: `${metric.name} has increased by ${percentChange.toFixed(1)}% compared to the previous period.`
          });
        }
        
        // Add significant negative changes to negative insights
        else if (percentChange < -5) {
          result.negativeInsights.push({
            title: `${metric.name} Decrease`,
            description: `${metric.name} has decreased by ${Math.abs(percentChange).toFixed(1)}% compared to the previous period.`
          });
        }
        
        // Check for warning conditions (below average)
        const febValue = typeof metric.febAvg.value === 'string'
          ? parseFloat(metric.febAvg.value.replace('%', ''))
          : metric.febAvg.value;
        
        const janValue = typeof metric.janAvg.value === 'string'
          ? parseFloat(metric.janAvg.value.replace('%', ''))
          : metric.janAvg.value;
        
        if (!isNaN(Number(febValue)) && !isNaN(Number(janValue)) && 
            Number(currentValue) < Number(febValue) && Number(currentValue) < Number(janValue)) {
          result.warningInsights.push({
            title: `${metric.name} Below Average`,
            description: `${metric.name} is currently below both January and February averages. This may require attention.`
          });
        }
      });
    });
    
    // Limit to top 3 insights of each type
    return {
      positiveInsights: result.positiveInsights.slice(0, 3),
      negativeInsights: result.negativeInsights.slice(0, 3),
      warningInsights: result.warningInsights.slice(0, 3)
    };
  }, [categories]);
  
  // Generate recommendations based on insights
  const recommendations = useMemo(() => {
    const recommendations = [];
    const insights = llmInsights || { 
      positiveInsights: algorithmicInsights.positiveInsights,
      negativeInsights: algorithmicInsights.negativeInsights,
      warningInsights: algorithmicInsights.warningInsights
    };
    
    // Add recommendations based on negative insights
    if (insights.negativeInsights?.length > 0) {
      recommendations.push({
        title: `Investigate ${insights.negativeInsights[0].title}`,
        description: `Analyze the factors contributing to the decrease in ${insights.negativeInsights[0].title.split(' ')[0]} and implement corrective actions.`
      });
    }
    
    // Add recommendations based on warning insights
    if (insights.warningInsights?.length > 0) {
      recommendations.push({
        title: `Address ${insights.warningInsights[0].title}`,
        description: `Review historical data and identify patterns that led to the below-average performance in ${insights.warningInsights[0].title.split(' ')[0]}.`
      });
    }
    
    // Add recommendations based on positive insights
    if (insights.positiveInsights?.length > 0) {
      recommendations.push({
        title: `Leverage ${insights.positiveInsights[0].title} Success`,
        description: `Analyze the factors contributing to the increase in ${insights.positiveInsights[0].title.split(' ')[0]} and consider applying successful elements to other areas.`
      });
    }
    
    // Add a generic recommendation if we don't have enough
    if (recommendations.length < 3) {
      recommendations.push({
        title: "Perform Comprehensive Data Analysis",
        description: "Conduct a deeper analysis of all metrics to identify hidden patterns and opportunities for improvement."
      });
    }
    
    return recommendations.slice(0, 3);
  }, [algorithmicInsights, llmInsights]);

  // Function to generate insights using LLM
  const generateInsightsWithLLM = async () => {
    // Check if we have an API key
    if (!localStorage.getItem("openai_api_key")) {
      setApiKeyDialogOpen(true);
      return;
    }

    setIsGeneratingLLMInsights(true);
    try {
      const insights = await generateLLMInsights(categories);
      if (insights) {
        setLlmInsights(insights);
      }
    } finally {
      setIsGeneratingLLMInsights(false);
    }
  };

  // Save API key to local storage
  const saveApiKey = () => {
    localStorage.setItem("openai_api_key", apiKey);
    setApiKeyDialogOpen(false);
    toast.success("API key saved");
    generateInsightsWithLLM();
  };

  // Determine if we should use default insights
  const useDefaultInsights = useMemo(() => {
    if (llmInsights) return false;
    
    return algorithmicInsights.positiveInsights.length === 0 && 
           algorithmicInsights.negativeInsights.length === 0 && 
           algorithmicInsights.warningInsights.length === 0;
  }, [algorithmicInsights, llmInsights]);

  // Use active insights (either LLM or algorithmic)
  const activeInsights = useMemo(() => {
    if (llmInsights) return llmInsights;
    return {
      positiveInsights: algorithmicInsights.positiveInsights,
      negativeInsights: algorithmicInsights.negativeInsights,
      warningInsights: algorithmicInsights.warningInsights,
      recommendations: recommendations
    };
  }, [algorithmicInsights, llmInsights, recommendations]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Key Insights & Recommendations</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={generateInsightsWithLLM}
          disabled={isGeneratingLLMInsights}
          className="flex items-center gap-2"
        >
          {isGeneratingLLMInsights ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Insights...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4" />
              Generate AI Insights
            </>
          )}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-fade-up">
        <Card className="overflow-hidden">
          <CardHeader className="bg-secondary/50 flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Key Insights</CardTitle>
              <CardDescription>
                {llmInsights ? "AI-generated analysis" : "Trends and anomalies detected"}
              </CardDescription>
            </div>
            <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {useDefaultInsights ? (
                // Default insights
                <>
                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 p-2 rounded-full">
                      <TrendingDownIcon className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Conversion Rate Decrease</h4>
                      <p className="text-sm text-gray-600">Overall conversion has decreased by 9% compared to the previous period. This is primarily driven by a decline in Brand app conversion (-8.6%).</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <TrendingUpIcon className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Strong Train App Performance</h4>
                      <p className="text-sm text-gray-600">Train App bookings have increased by 5.2% week-over-week, outperforming other booking channels. This represents a continuing upward trend from February's average.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <AlertCircleIcon className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">iOS Booking Decline</h4>
                      <p className="text-sm text-gray-600">Brand iOS bookings have decreased by 2.4% compared to the previous period and are below both January and February averages. This may require investigation.</p>
                    </div>
                  </div>
                </>
              ) : (
                // Generated insights
                <>
                  {activeInsights.negativeInsights.map((insight, index) => (
                    <div key={`negative-${index}`} className="flex items-start gap-3">
                      <div className="bg-red-100 p-2 rounded-full">
                        <TrendingDownIcon className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">{insight.title}</h4>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                      </div>
                    </div>
                  ))}
                  
                  {activeInsights.positiveInsights.map((insight, index) => (
                    <div key={`positive-${index}`} className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <TrendingUpIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">{insight.title}</h4>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                      </div>
                    </div>
                  ))}
                  
                  {activeInsights.warningInsights.map((insight, index) => (
                    <div key={`warning-${index}`} className="flex items-start gap-3">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <AlertCircleIcon className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">{insight.title}</h4>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="bg-secondary/50 flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
              <CardDescription>
                {llmInsights ? "AI-generated recommendations" : "Based on current metrics"}
              </CardDescription>
            </div>
            <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {useDefaultInsights ? (
                // Default recommendations
                <>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <span className="text-xs font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Investigate Conversion Drop</h4>
                      <p className="text-sm text-gray-600">Analyze funnel steps to identify specific drop-off points in the brand app user journey that may be causing the conversion decline.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <span className="text-xs font-bold text-blue-600">2</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Optimize iOS App Experience</h4>
                      <p className="text-sm text-gray-600">Review recent iOS app updates or changes that may have negatively impacted the booking process. Consider A/B testing improvements.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <span className="text-xs font-bold text-blue-600">3</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Leverage Train App Success</h4>
                      <p className="text-sm text-gray-600">Analyze the factors contributing to Train App growth and consider applying successful elements to other booking channels.</p>
                    </div>
                  </div>
                </>
              ) : (
                // Generated recommendations
                <>
                  {(llmInsights?.recommendations || activeInsights.recommendations).map((recommendation, index) => (
                    <div key={`rec-${index}`} className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">{recommendation.title}</h4>
                        <p className="text-sm text-gray-600">{recommendation.description}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Key Dialog */}
      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter OpenAI API Key</DialogTitle>
            <DialogDescription>
              Your API key is required to generate AI insights. It will be stored locally in your browser.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setApiKeyDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={saveApiKey} disabled={!apiKey}>
              Save & Generate Insights
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MetricInsights;
