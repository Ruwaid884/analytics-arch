
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Share2, 
  Filter, 
  LineChart,
  BarChart3,
  TableProperties
} from "lucide-react";
import PeriodSelector from "./PeriodSelector";

interface DashboardHeaderProps {
  title: string;
  currentPeriod: string;
  onPreviousPeriod: () => void;
  onNextPeriod: () => void;
  onPeriodChange: (value: string) => void;
  availablePeriods: { value: string; label: string }[];
  onViewChange: (value: string) => void;
  currentView: string;
}

const DashboardHeader = ({
  title,
  currentPeriod,
  onPreviousPeriod,
  onNextPeriod,
  onPeriodChange,
  availablePeriods,
  onViewChange,
  currentView
}: DashboardHeaderProps) => {
  return (
    <div className="bg-white border-b px-6 py-4 sticky top-0 z-10 shadow-sm">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">{title}</h1>
        </div>
        
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          <PeriodSelector
            currentPeriod={currentPeriod}
            onPreviousPeriod={onPreviousPeriod}
            onNextPeriod={onNextPeriod}
            onPeriodChange={onPeriodChange}
            availablePeriods={availablePeriods}
          />
          
          <div className="flex items-center space-x-2">
            <Tabs 
              value={currentView} 
              onValueChange={onViewChange}
              className="bg-gray-100 rounded-lg p-1"
            >
              <TabsList className="bg-transparent">
                <TabsTrigger 
                  value="table" 
                  className="h-8 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <TableProperties className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Table</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="chart" 
                  className="h-8 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <LineChart className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Chart</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="bar" 
                  className="h-8 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Bar</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
