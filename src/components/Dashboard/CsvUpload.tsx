import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileUp } from "lucide-react";
import { toast } from "sonner";
import { Category, Metric, TrendPoint } from "@/types/metrics";
import Papa from "papaparse";

interface CsvUploadProps {
  onDataUpdate: (categories: Category[]) => void;
}

const CsvUpload = ({ onDataUpdate }: CsvUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's a CSV file
    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    setIsUploading(true);
    
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const parsedData = processCsvData(results.data);
          onDataUpdate(parsedData);
          toast.success("Dashboard updated with new data");
        } catch (error) {
          console.error("Error processing CSV:", error);
          toast.error("Failed to process CSV. Please check the format.");
        } finally {
          setIsUploading(false);
        }
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        toast.error("Failed to parse CSV file");
        setIsUploading(false);
      }
    });
  };

  // Process CSV data into the format expected by the dashboard
  const processCsvData = (data: any[]): Category[] => {
    // Group metrics by category
    const categoriesMap = new Map<string, Metric[]>();
    
    data.forEach((row) => {
      const categoryName = row.category || "Uncategorized";
      const metricId = row.id || `metric-${Math.random().toString(36).substr(2, 9)}`;
      
      if (!categoriesMap.has(categoryName)) {
        categoriesMap.set(categoryName, []);
      }
      
      // Generate trend data based on provided values or randomly
      const trendData: TrendPoint[] = [];
      for (let i = 0; i < 14; i++) {
        const trendPointKey = `trend_${i}`;
        const yValue = row[trendPointKey] 
          ? parseFloat(row[trendPointKey]) 
          : generateRandomTrendValue(row.currentPeriod || 100);
        
        trendData.push({
          x: i,
          y: yValue
        });
      }
      
      // Determine trend direction and percentage
      const currentValue = parseValueOrEmpty(row.currentPeriod);
      const previousValue = parseValueOrEmpty(row.previousPeriod);
      
      let trend: 'up' | 'down' | 'stable' = 'stable';
      let trendPercentage = 0;
      
      if (currentValue !== '' && previousValue !== '' && typeof currentValue === 'number' && typeof previousValue === 'number' && previousValue !== 0) {
        const percentChange = ((currentValue - previousValue) / previousValue) * 100;
        trendPercentage = Math.abs(percentChange);
        trend = percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'stable';
      }
      
      // Create metric object
      const metric: Metric = {
        id: metricId,
        l1Category: row.l1Category || categoryName,
        l2Category: row.l2Category || categoryName,
        name: row.name || `Metric ${metricId}`,
        currentPeriod: { 
          value: currentValue,
          trend,
          trendPercentage: trendPercentage > 0 ? parseFloat(trendPercentage.toFixed(1)) : undefined
        },
        previousPeriod: { value: previousValue },
        febAvg: { value: parseValueOrEmpty(row.febAvg) },
        janAvg: { value: parseValueOrEmpty(row.janAvg) },
        decAvg: { value: parseValueOrEmpty(row.decAvg) },
        trendData: trendData
      };
      
      categoriesMap.get(categoryName)!.push(metric);
    });
    
    // Convert map to array of categories
    const categories: Category[] = [];
    categoriesMap.forEach((metrics, name) => {
      categories.push({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        metrics
      });
    });
    
    return categories;
  };
  
  // Helper to generate random trend values
  const generateRandomTrendValue = (baseValue: number) => {
    const volatility = 0.05;
    const randomFactor = 1 + (Math.random() * volatility * 2 - volatility);
    return baseValue * randomFactor;
  };
  
  // Helper to parse values that might be numbers, percentages, or empty
  const parseValueOrEmpty = (value: any): string | number => {
    if (value === undefined || value === null || value === '') return '';
    
    // If it's already a number, return it
    if (typeof value === 'number') return value;
    
    // If it's a string with a percentage sign, keep it as is
    if (typeof value === 'string' && value.includes('%')) return value;
    
    // Try to parse as number
    const parsed = parseFloat(value);
    return isNaN(parsed) ? value : parsed;
  };
  
  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="file"
            accept=".csv"
            id="csv-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Upload className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <FileUp className="h-4 w-4" />
                Upload CSV
              </>
            )}
          </Button>
        </div>
        <div className="text-sm text-gray-500">
          Update dashboard with your own metrics data
        </div>
      </div>
    </div>
  );
};

export default CsvUpload;
