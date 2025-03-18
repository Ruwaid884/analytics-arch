
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileUp, Loader2 } from "lucide-react";
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
    toast.loading("Processing CSV data...");
    
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const parsedData = processCsvData(results.data);
          onDataUpdate(parsedData);
          toast.dismiss();
          toast.success("Dashboard updated with new data");
        } catch (error) {
          console.error("Error processing CSV:", error);
          toast.dismiss();
          toast.error("Failed to process CSV. Please check the format.");
        } finally {
          setIsUploading(false);
        }
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        toast.dismiss();
        toast.error("Failed to parse CSV file");
        setIsUploading(false);
      }
    });
  };

  // Process CSV data into the format expected by the dashboard
  const processCsvData = (data: any[]): Category[] => {
    // Group metrics by category
    const categoriesMap = new Map<string, Metric[]>();
    
    // Define column mappings based on the provided images
    const columnMappings = {
      currentPeriod: "10_Mar_16_Mar",
      previousPeriod: "03_Mar_09_Mar",
      febAvg: "Feb_Avg",
      janAvg: "Jan_Avg",
      decAvg: "Dec_Avg",
      l1Category: "l1_metric",
      l2Category: "l2_metric",
      id: "id",
      name: "name",
      // Additional periods from the images
      novAvg: "Nov_Avg",
      oct: "Oct",
      sep: "Sep",
      aug: "Aug",
      july: "July",
      june: "June",
      mayAvg: "May_Avg",
      aprAvg: "Apr_Avg",
      marAvg: "Mar_Avg",
      febAvgLastYear: "Feb_Avg_Last_Year",
      janAvgLastYear: "Jan_Avg_Last_Year"
    };
    
    data.forEach((row) => {
      // Use l1_metric as category if present, otherwise fallback
      const categoryName = row[columnMappings.l1Category] || row.category || "Uncategorized";
      
      // Skip empty rows
      if (!categoryName || !row[columnMappings.name]) {
        return;
      }
      
      const metricId = row[columnMappings.id] || row.id || `metric-${Math.random().toString(36).substr(2, 9)}`;
      
      if (!categoriesMap.has(categoryName)) {
        categoriesMap.set(categoryName, []);
      }
      
      // Generate trend data based on provided values or randomly
      const trendData: TrendPoint[] = [];
      for (let i = 0; i < 14; i++) {
        const trendPointKey = `trend_${i}`;
        const yValue = row[trendPointKey] 
          ? parseFloat(row[trendPointKey]) 
          : generateRandomTrendValue(parseValueOrEmpty(row[columnMappings.currentPeriod]) || 100);
        
        trendData.push({
          x: i,
          y: yValue
        });
      }
      
      // Determine trend direction and percentage
      const currentValue = parseValueOrEmpty(row[columnMappings.currentPeriod]);
      const previousValue = parseValueOrEmpty(row[columnMappings.previousPeriod]);
      
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
        l1Category: row[columnMappings.l1Category] || categoryName,
        l2Category: row[columnMappings.l2Category] || categoryName,
        name: row[columnMappings.name] || `Metric ${metricId}`,
        currentPeriod: { 
          value: currentValue,
          trend,
          trendPercentage: trendPercentage > 0 ? parseFloat(trendPercentage.toFixed(1)) : undefined
        },
        previousPeriod: { value: previousValue },
        febAvg: { value: parseValueOrEmpty(row[columnMappings.febAvg]) },
        janAvg: { value: parseValueOrEmpty(row[columnMappings.janAvg]) },
        decAvg: { value: parseValueOrEmpty(row[columnMappings.decAvg]) },
        trendData: trendData,
        // Additional fields
        additionalFields: {
          novAvg: parseValueOrEmpty(row[columnMappings.novAvg]),
          oct: parseValueOrEmpty(row[columnMappings.oct]),
          sep: parseValueOrEmpty(row[columnMappings.sep]),
          aug: parseValueOrEmpty(row[columnMappings.aug]),
          july: parseValueOrEmpty(row[columnMappings.july]),
          june: parseValueOrEmpty(row[columnMappings.june]),
          mayAvg: parseValueOrEmpty(row[columnMappings.mayAvg]),
          aprAvg: parseValueOrEmpty(row[columnMappings.aprAvg]),
          marAvg: parseValueOrEmpty(row[columnMappings.marAvg]),
          febAvgLastYear: parseValueOrEmpty(row[columnMappings.febAvgLastYear]),
          janAvgLastYear: parseValueOrEmpty(row[columnMappings.janAvgLastYear])
        }
      };
      
      categoriesMap.get(categoryName)!.push(metric);
    });
    
    // Convert map to array of categories
    const categories: Category[] = [];
    categoriesMap.forEach((metrics, name) => {
      if (metrics.length > 0) {
        categories.push({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name,
          metrics
        });
      }
    });
    
    return categories;
  };
  
  // Helper to generate random trend values
  const generateRandomTrendValue = (baseValue: number) => {
    if (typeof baseValue !== 'number' || isNaN(baseValue)) {
      baseValue = 100;
    }
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
                <Loader2 className="h-4 w-4 animate-spin" />
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
