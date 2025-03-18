
import { ArrowDownIcon, ArrowUpIcon, TrendingUpIcon } from "lucide-react";
import TrendChart from "./TrendChart";
import { cn } from "@/lib/utils";

interface MetricSummaryProps {
  title: string;
  value: string | number;
  previousValue: string | number;
  trendData: Array<{ x: number; y: number }>;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

const MetricSummary = ({
  title,
  value,
  previousValue,
  trendData,
  trend,
  trendPercentage
}: MetricSummaryProps) => {
  const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-blue-600';
  const TrendIcon = trend === 'up' ? ArrowUpIcon : trend === 'down' ? ArrowDownIcon : TrendingUpIcon;
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            <p className={cn("ml-2 flex items-center text-sm", trendColor)}>
              <TrendIcon className="mr-0.5 h-4 w-4 flex-shrink-0" />
              {trendPercentage}%
            </p>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Previous: {previousValue}
          </p>
        </div>
        <div className="flex-shrink-0">
          <TrendChart 
            data={trendData} 
            trend={trend} 
            height={60} 
            width={100}
          />
        </div>
      </div>
    </div>
  );
};

const DashboardSummary = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-up">
      <MetricSummary
        title="Total Bookings"
        value="100,955"
        previousValue="99,480"
        trendData={[
          { x: 0, y: 95000 },
          { x: 1, y: 96500 },
          { x: 2, y: 98000 },
          { x: 3, y: 97000 },
          { x: 4, y: 99000 },
          { x: 5, y: 100500 },
          { x: 6, y: 99800 },
          { x: 7, y: 100955 },
        ]}
        trend="up"
        trendPercentage={1.5}
      />
      
      <MetricSummary
        title="Overall Conversion"
        value="0.71"
        previousValue="0.78"
        trendData={[
          { x: 0, y: 0.79 },
          { x: 1, y: 0.77 },
          { x: 2, y: 0.75 },
          { x: 3, y: 0.73 },
          { x: 4, y: 0.76 },
          { x: 5, y: 0.74 },
          { x: 6, y: 0.72 },
          { x: 7, y: 0.71 },
        ]}
        trend="down"
        trendPercentage={9.0}
      />
      
      <MetricSummary
        title="App Bookings"
        value="63,350"
        previousValue="62,976"
        trendData={[
          { x: 0, y: 62000 },
          { x: 1, y: 62400 },
          { x: 2, y: 63000 },
          { x: 3, y: 62800 },
          { x: 4, y: 63100 },
          { x: 5, y: 63300 },
          { x: 6, y: 63250 },
          { x: 7, y: 63350 },
        ]}
        trend="up"
        trendPercentage={0.6}
      />
      
      <MetricSummary
        title="Brand App Conversion"
        value="1.38%"
        previousValue="1.51%"
        trendData={[
          { x: 0, y: 1.51 },
          { x: 1, y: 1.49 },
          { x: 2, y: 1.47 },
          { x: 3, y: 1.45 },
          { x: 4, y: 1.42 },
          { x: 5, y: 1.41 },
          { x: 6, y: 1.39 },
          { x: 7, y: 1.38 },
        ]}
        trend="down"
        trendPercentage={8.6}
      />
    </div>
  );
};

export default DashboardSummary;
