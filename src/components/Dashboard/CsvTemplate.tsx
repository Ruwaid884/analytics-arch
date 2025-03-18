
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const CsvTemplate = () => {
  const generateTemplateCSV = () => {
    const headers = [
      "category",
      "l1Category",
      "l2Category",
      "id",
      "name",
      "currentPeriod",
      "previousPeriod",
      "febAvg",
      "janAvg",
      "decAvg"
    ];
    
    // Add trend data columns
    for (let i = 0; i < 14; i++) {
      headers.push(`trend_${i}`);
    }
    
    const rows = [
      // Example row for Bookings category
      [
        "Bookings",
        "Bookings",
        "Bookings",
        "total-bookings",
        "Total Bookings",
        "100955",
        "99480",
        "97892",
        "99639",
        "95292",
        // Example trend data
        "95000", "96000", "97000", "98000", "99000", "100000", "101000", "102000", 
        "101000", "100500", "101500", "100955", "101200", "101500"
      ],
      // Example row for Conversion category
      [
        "Conversion and Market share",
        "Funnel conversion - Overall",
        "Conversion and Market share",
        "overall-conversion",
        "Overall conversion",
        "0.71",
        "0.78",
        "0.68",
        "0.69",
        "0.74",
        // Example trend data
        "0.70", "0.72", "0.74", "0.76", "0.78", "0.76", "0.74", "0.72", 
        "0.73", "0.72", "0.71", "0.70", "0.71", "0.72"
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
  };
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={generateTemplateCSV}
      className="flex items-center gap-1 text-xs"
    >
      <Download className="h-3 w-3" />
      Download CSV Template
    </Button>
  );
};

export default CsvTemplate;
