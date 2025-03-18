import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileUp, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Category, Metric, TrendPoint } from "@/types/metrics";
import Papa from "papaparse";

interface CsvUploadProps {
  onDataUpdate: (categories: Category[]) => void;
}

const CsvUpload = ({ onDataUpdate }: CsvUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [hasAutoLoaded, setHasAutoLoaded] = useState(false);

  // Auto-load the CSV file on component mount
  useEffect(() => {
    // Automatically load the CSV file from the src directory
    loadDefaultCsvFile();
  }, []);

  const loadDefaultCsvFile = async () => {
    try {
      setIsUploading(true);
      setHasAutoLoaded(false); // Reset auto-loaded flag
      toast.loading("Loading default CSV data...");
      
      // Clear any previous toast messages
      toast.dismiss();
      
      // Fetch the CSV file from the public directory
      const response = await fetch('/Weekly Product MTM Review - Flights - MTM (1).csv');
      if (!response.ok) {
        throw new Error('Failed to load default CSV file');
      }
      
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          try {
            console.log("CSV parsed successfully with", results.data.length, "rows");
            const parsedData = processCsvData(results.data);
            onDataUpdate(parsedData);
            toast.dismiss();
            toast.success("Dashboard updated with default CSV data");
            setHasAutoLoaded(true);
          } catch (error) {
            console.error("Error processing CSV:", error);
            toast.dismiss();
            toast.error("Failed to process default CSV. Please check the format.");
          } finally {
            setIsUploading(false);
          }
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          toast.dismiss();
          toast.error("Failed to parse default CSV file");
          setIsUploading(false);
        }
      });
    } catch (error) {
      console.error("Error loading default CSV:", error);
      toast.dismiss();
      toast.error("Failed to load default CSV file");
      setIsUploading(false);
    }
  };

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
    try {
      // Check if the data is valid
      if (!Array.isArray(data) || data.length === 0) {
        console.error("Invalid CSV data format - empty or not an array");
        toast.error("Invalid CSV data format");
        return [];
      }
      
      // Get column headers from the first row
      const firstRow = data[0];
      const columnHeaders = Object.keys(firstRow);
      
      // Extract the period columns - these include week dates and month averages
      const periodColumns = columnHeaders.filter(header => 
        // Match patterns like "10 Mar - 16 Mar", "Feb Avg", etc.
        header.includes('-') || header.includes('Avg') || /^[A-Za-z]{3}$/.test(header)
      );
      
      console.log("Detected period columns:", periodColumns);

      // Track the last used L1 category to handle empty L1 fields
      let lastL1Category = '';
      
      // First, group all rows by L1 metric
      const groupedByL1: { [key: string]: any[] } = {};
      
      data.forEach(row => {
        // Get L1 category from the row or use the last known L1 category if empty
        let l1Category = row["L1 metric"];
        
        if (!l1Category || typeof l1Category !== 'string' || l1Category.trim() === '') {
          // Use the last known L1 category
          l1Category = lastL1Category;
          console.log(`Using last L1 category "${lastL1Category}" for row with L2: ${row["L2 metric"]}`);
        } else {
          // Update the last known L1 category
          lastL1Category = l1Category;
        }
        
        if (l1Category) {
          if (!groupedByL1[l1Category]) {
            groupedByL1[l1Category] = [];
          }
          // Store this row with its L1 category (original or inherited)
          const rowWithL1 = { ...row, "L1 metric": l1Category };
          groupedByL1[l1Category].push(rowWithL1);
        }
      });
      
      console.log("Grouped by L1:", Object.keys(groupedByL1));
      
      // Create categories array from L1 metrics
      const categories: Category[] = [];
      
      // Process each L1 category
      Object.entries(groupedByL1).forEach(([l1Category, rows]) => {
        const metrics: Metric[] = [];
        const categoryId = l1Category.toLowerCase().replace(/\s+/g, '-');
        
        console.log(`Processing L1 category: ${l1Category} with ${rows.length} rows`);
        
        // Process each row (L2 metric) under this L1 category
        rows.forEach(row => {
          const l2Category = row["L2 metric"] || '';
          const metricName = row["MTM"] || l2Category || `Metric ${Math.random().toString(36).substr(2, 9)}`;
          
          // Skip if no valid name
          if (!metricName) {
            console.log(`Skipping row due to no valid name`);
            return;
          }
          
          console.log(`Processing L2 metric: ${l2Category} - ${metricName}`);
          
          // Extract all period values for this metric
          const periodValues: Record<string, any> = {};
          periodColumns.forEach(column => {
            periodValues[column] = parseValueOrEmpty(row[column]);
          });
          
          // Generate trend data based on period values
          const trendData: TrendPoint[] = [];
          // Use the last 14 period values for the trend data, or generate random if not enough
          const periodValuesArray = Object.values(periodValues)
            .filter(value => typeof value === 'number')
            .slice(-14);  // Get the last 14 values
          
          for (let i = 0; i < 14; i++) {
            let yValue: number;
            if (i < periodValuesArray.length) {
              yValue = periodValuesArray[i] as number;
            } else {
              // Use the first available value as base for random generation
              const baseValue = typeof periodValuesArray[0] === 'number' ? 
                periodValuesArray[0] : 100;
              yValue = generateRandomTrendValue(baseValue);
            }
            
            trendData.push({
              x: i,
              y: yValue
            });
          }
          
          // Get current and previous period values
          // Current period is the first week column (latest week)
          // Previous period is the second week column
          const currentWeekColumn = periodColumns.find(col => col.includes('-')) || '';
          const previousWeekColumn = periodColumns.filter(col => col.includes('-'))[1] || '';
          
          const currentValue = parseValueOrEmpty(row[currentWeekColumn]);
          const previousValue = parseValueOrEmpty(row[previousWeekColumn]);
          
          // Find the latest month average column
          const monthAvgColumns = periodColumns.filter(col => col.includes('Avg'));
          const currentMonthAvg = monthAvgColumns[0] || '';
          const febAvgColumn = periodColumns.find(col => col.includes('Feb Avg')) || '';
          const janAvgColumn = periodColumns.find(col => col.includes('Jan Avg')) || '';
          const decAvgColumn = periodColumns.find(col => col.includes('Dec Avg')) || '';
          
          // Determine trend direction and percentage
          let trend: 'up' | 'down' | 'stable' = 'stable';
          let trendPercentage = 0;
          
          if (currentValue !== '' && previousValue !== '' && 
              typeof currentValue === 'number' && typeof previousValue === 'number' && 
              previousValue !== 0) {
            const percentChange = ((currentValue - previousValue) / previousValue) * 100;
            trendPercentage = Math.abs(percentChange);
            trend = percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'stable';
          }
          
          // Create a unique metric ID that combines L1, L2, and the metric name 
          const uniqueId = `${categoryId}-${l2Category.toLowerCase().replace(/\s+/g, '-')}-${metricName.toLowerCase().replace(/\s+/g, '-')}`;
          
          // Create metric object with all period data
          const metric: Metric = {
            id: uniqueId,
            l1Category: l1Category,
            l2Category: l2Category,
            name: metricName,
            currentPeriod: { 
              value: currentValue,
              trend,
              trendPercentage: trendPercentage > 0 ? parseFloat(trendPercentage.toFixed(1)) : undefined
            },
            previousPeriod: { value: previousValue },
            febAvg: { value: parseValueOrEmpty(row[febAvgColumn]) },
            janAvg: { value: parseValueOrEmpty(row[janAvgColumn]) },
            decAvg: { value: parseValueOrEmpty(row[decAvgColumn]) },
            trendData: trendData,
            // Store all period values in additionalFields
            additionalFields: periodValues
          };
          
          // Add this metric to the metrics array
          metrics.push(metric);
        });
        
        if (metrics.length > 0) {
          console.log(`Adding category ${l1Category} with ${metrics.length} metrics`);
          
          // Create category for this L1 metric with all its metrics
          const category: Category = {
            id: l1Category.toLowerCase().replace(/\s+/g, '-'),
            name: l1Category,
            metrics: metrics
          };
          
          // Add the category to the categories array
          categories.push(category);
        }
      });
      
      console.log("Total categories created:", categories.length);
      categories.forEach(cat => {
        console.log(`Category ${cat.name} has ${cat.metrics.length} metrics`);
      });
      
      return categories;
    } catch (error) {
      console.error("Error processing CSV data:", error);
      toast.error("Failed to process CSV data. Invalid format.");
      return [];
    }
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
    
    // Remove any commas from numbers (like "100,955")
    if (typeof value === 'string') {
      value = value.replace(/,/g, '');
    }
    
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
        
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={loadDefaultCsvFile}
          disabled={isUploading}
        >
          <RefreshCw className="h-4 w-4" />
          Reload Default CSV
        </Button>
        
        <div className="text-sm text-gray-500">
          {hasAutoLoaded ? "Using default CSV data" : "Update dashboard with your own metrics data"}
        </div>
      </div>
    </div>
  );
};

export default CsvUpload;
