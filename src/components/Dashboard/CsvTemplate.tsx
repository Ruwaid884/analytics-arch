
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

const CsvTemplate = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const generateTemplateCSV = () => {
    setIsDownloading(true);
    
    try {
      // Headers based on the provided images
      const headers = [
        "l1_metric",
        "l2_metric",
        "id",
        "name",
        "trendline",
        "10_Mar_16_Mar", // Current period
        "03_Mar_09_Mar", // Previous period
        "Feb_Avg",
        "Jan_Avg",
        "Dec_Avg",
        "Nov_Avg",
        "Oct",
        "Sep",
        "Aug",
        "July",
        "June",
        "May_Avg",
        "Apr_Avg",
        "Mar_Avg",
        "Feb_Avg_Last_Year",
        "Jan_Avg_Last_Year"
      ];
      
      // Add trend data columns
      for (let i = 0; i < 14; i++) {
        headers.push(`trend_${i}`);
      }
      
      const rows = [
        // Example row for Bookings - Total Bookings
        [
          "Bookings",
          "Bookings",
          "total-bookings",
          "Total Bookings",
          "line", // Trendline type
          "100955", // 10 Mar - 16 Mar
          "99480", // 03 Mar - 09 Mar
          "97892", // Feb Avg
          "99639", // Jan Avg
          "95292", // Dec Avg
          "98271", // Nov Avg
          "95076", // Oct
          "", // Sep
          "", // Aug 
          "", // July
          "", // June
          "", // May Avg
          "", // Apr Avg
          "", // Mar Avg
          "", // Feb Avg Last Year
          "", // Jan Avg Last Year
          // Sample trend data points
          "95000", "96000", "97000", "98000", "99000", "100000", "101000", "102000", 
          "101000", "100500", "101500", "100955", "101200", "101500"
        ],
        // Example row for Brand Android
        [
          "Bookings",
          "Bookings",
          "brand-android",
          "Brand Android",
          "line",
          "27623",
          "27851",
          "27145",
          "27624",
          "27012",
          "25851",
          "29471",
          "", 
          "", 
          "", 
          "", 
          "", 
          "", 
          "", 
          "", 
          "",
          // Sample trend data
          "27100", "27300", "27500", "27700", "27900", "27800", "27700", "27600", 
          "27500", "27550", "27600", "27623", "27700", "27800"
        ],
        // Example row for Conversion - Overall Conversion
        [
          "Conversion and Market",
          "Funnel conversion - Overall",
          "overall-conversion",
          "Overall conversion",
          "line",
          "0.71", 
          "0.78", 
          "0.68", 
          "0.69", 
          "0.74", 
          "0.70", 
          "0.77", 
          "0.75",
          "0.71",
          "0.69",
          "0.68",
          "0.64",
          "0.65",
          "0.72",
          "0.68",
          "",
          // Sample trend data
          "0.70", "0.72", "0.74", "0.76", "0.78", "0.77", "0.75", "0.73", 
          "0.72", "0.71", "0.70", "0.71", "0.72", "0.73"
        ],
        // Example row for Pricing & Offers
        [
          "Pricing & Offers",
          "Pricing & Offers",
          "avg-discount-brand-app",
          "Avg Discount- Brand App (Dom)",
          "line",
          "460", 
          "483", 
          "530", 
          "545", 
          "540", 
          "496", 
          "502", 
          "510",
          "498",
          "493",
          "481",
          "443",
          "465",
          "487",
          "454",
          "",
          // Sample trend data
          "480", "478", "476", "474", "472", "470", "465", "462", 
          "460", "458", "459", "460", "461", "462"
        ]
      ];
      
      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'dashboard_template.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Template downloaded successfully");
    } catch (error) {
      console.error("Error generating CSV template:", error);
      toast.error("Failed to download template");
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={generateTemplateCSV}
      className="flex items-center gap-1 text-xs"
      disabled={isDownloading}
    >
      {isDownloading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Download className="h-3 w-3" />
      )}
      {isDownloading ? "Downloading..." : "Download CSV Template"}
    </Button>
  );
};

export default CsvTemplate;
