
import { useState } from "react";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardSummary from "@/components/Dashboard/DashboardSummary";
import MetricsTable from "@/components/Dashboard/MetricsTable";
import DrillDownChart from "@/components/Dashboard/DrillDownChart";
import MetricInsights from "@/components/Dashboard/MetricInsights";
import CsvUpload from "@/components/Dashboard/CsvUpload";
import CsvTemplate from "@/components/Dashboard/CsvTemplate";
import { mockCategories, periods } from "@/utils/mockData";
import { Category } from "@/types/metrics";

const availablePeriods = [
  { value: "current", label: "10 Mar - 16 Mar" },
  { value: "previous", label: "03 Mar - 09 Mar" },
  { value: "feb-w4", label: "25 Feb - 02 Mar" },
  { value: "feb-w3", label: "18 Feb - 24 Feb" },
  { value: "feb-w2", label: "11 Feb - 17 Feb" },
  { value: "feb-w1", label: "04 Feb - 10 Feb" },
];

const Index = () => {
  const [currentPeriod, setCurrentPeriod] = useState("current");
  const [currentView, setCurrentView] = useState("table");
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isUsingMockData, setIsUsingMockData] = useState(true);

  const handlePreviousPeriod = () => {
    const currentIndex = availablePeriods.findIndex(p => p.value === currentPeriod);
    if (currentIndex < availablePeriods.length - 1) {
      setCurrentPeriod(availablePeriods[currentIndex + 1].value);
    }
  };

  const handleNextPeriod = () => {
    const currentIndex = availablePeriods.findIndex(p => p.value === currentPeriod);
    if (currentIndex > 0) {
      setCurrentPeriod(availablePeriods[currentIndex - 1].value);
    }
  };

  const handleDataUpdate = (newCategories: Category[]) => {
    setCategories(newCategories);
    setIsUsingMockData(false);
    
    // Reset to default view when new data is loaded
    setCurrentView("table");
    setCurrentPeriod("current");
  };

  const resetToMockData = () => {
    setCategories(mockCategories);
    setIsUsingMockData(true);
  };

  // Find the current and previous period labels
  const currentPeriodLabel = availablePeriods.find(p => p.value === currentPeriod)?.label || "";
  const previousPeriodIndex = availablePeriods.findIndex(p => p.value === currentPeriod) + 1;
  const previousPeriodLabel = previousPeriodIndex < availablePeriods.length 
    ? availablePeriods[previousPeriodIndex].label 
    : "";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader
        title="Performance Dashboard"
        currentPeriod={currentPeriod}
        onPreviousPeriod={handlePreviousPeriod}
        onNextPeriod={handleNextPeriod}
        onPeriodChange={setCurrentPeriod}
        availablePeriods={availablePeriods}
        onViewChange={setCurrentView}
        currentView={currentView}
      />
      
      <div className="container py-6 flex-1">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4 items-center">
            <CsvUpload onDataUpdate={handleDataUpdate} />
            <CsvTemplate />
          </div>
          
          {!isUsingMockData && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetToMockData}
              className="text-xs"
            >
              Reset to Default Data
            </Button>
          )}
        </div>
        
        <DashboardSummary categories={categories} />
        
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Key Metrics</h2>
          
          {currentView === "table" ? (
            <>
              {categories.map((category) => (
                <MetricsTable
                  key={category.id}
                  category={category}
                  currentPeriod={currentPeriodLabel}
                  previousPeriod={previousPeriodLabel}
                />
              ))}
            </>
          ) : (
            <>
              <DrillDownChart 
                title="Bookings by Channel" 
                metric="Bookings"
              />
              <DrillDownChart 
                title="Conversion Rates" 
                metric="Conversion"
              />
            </>
          )}
        </div>
        
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Analysis & Insights</h2>
          <MetricInsights categories={categories} />
        </div>
      </div>
    </div>
  );
};

export default Index;
