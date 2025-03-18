
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface PeriodSelectorProps {
  currentPeriod: string;
  onPreviousPeriod: () => void;
  onNextPeriod: () => void;
  onPeriodChange: (value: string) => void;
  availablePeriods: { value: string; label: string }[];
}

const PeriodSelector = ({
  currentPeriod,
  onPreviousPeriod,
  onNextPeriod,
  onPeriodChange,
  availablePeriods
}: PeriodSelectorProps) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-1">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={onPreviousPeriod}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="relative">
          <Select 
            value={currentPeriod} 
            onValueChange={onPeriodChange}
          >
            <SelectTrigger className="h-9 min-w-[180px] pl-9 bg-white">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {availablePeriods.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Calendar className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={onNextPeriod}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PeriodSelector;
