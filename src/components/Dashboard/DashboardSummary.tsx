
import { ArrowDownIcon, ArrowUpIcon, TrendingUpIcon } from "lucide-react";
import TrendChart from "./TrendChart";
import { cn } from "@/lib/utils";
import { Category } from "@/types/metrics";

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

interface DashboardSummaryProps {
  categories: Category[];
}

const DashboardSummary = ({ categories }: DashboardSummaryProps) => {
  // Find key metrics for summary cards
  const findMetric = (categoryName: string, metricName: string) => {
    const category = categories.find(c => c.name.toLowerCase().includes(categoryName.toLowerCase()));
    if (!category) return null;
    
    return category.metrics.find(m => m.name.toLowerCase().includes(metricName.toLowerCase()));
  };
  
  // Get total bookings metric
  const totalBookingsMetric = findMetric("bookings", "total bookings");
  
  // Get conversion metric
  const overallConversionMetric = findMetric("conversion", "overall conversion");
  
  // Calculate app bookings (sum of relevant metrics)
  const calculateAppBookings = () => {
    const bookingsCategory = categories.find(c => c.name.toLowerCase().includes("bookings"));
    if (!bookingsCategory) return null;
    
    const appMetrics = bookingsCategory.metrics.filter(m => 
      m.name.toLowerCase().includes("android") || 
      m.name.toLowerCase().includes("ios") || 
      m.name.toLowerCase().includes("app")
    );
    
    if (appMetrics.length === 0) return null;
    
    const totalAppBookings = appMetrics.reduce((sum, metric) => {
      const value = typeof metric.currentPeriod.value === 'number' ? metric.currentPeriod.value : 0;
      return sum + value;
    }, 0);
    
    const totalPreviousAppBookings = appMetrics.reduce((sum, metric) => {
      const value = typeof metric.previousPeriod.value === 'number' ? metric.previousPeriod.value : 0;
      return sum + value;
    }, 0);
    
    const trendPercentage = totalPreviousAppBookings ? 
      ((totalAppBookings - totalPreviousAppBookings) / totalPreviousAppBookings) * 100 : 0;
    
    return {
      value: totalAppBookings,
      previousValue: totalPreviousAppBookings,
      trend: trendPercentage > 0 ? 'up' : trendPercentage < 0 ? 'down' : 'stable',
      trendPercentage: Math.abs(parseFloat(trendPercentage.toFixed(1)))
    };
  };
  
  const appBookings = calculateAppBookings();
  
  // Get brand app conversion
  const brandAppConversionMetric = findMetric("conversion", "brand app conversion");
  
  // Default trend data if we can't find specific metrics
  const defaultTrendData = [
    { x: 0, y: 100 }, { x: 1, y: 102 }, { x: 2, y: 104 }, { x: 3, y: 103 },
    { x: 4, y: 106 }, { x: 5, y: 105 }, { x: 6, y: 107 }, { x: 7, y: 106 }
  ];
  
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-up">
      <MetricSummary
        title="Total Bookings"
        value={totalBookingsMetric?.currentPeriod.value || "N/A"}
        previousValue={totalBookingsMetric?.previousPeriod.value || "N/A"}
        trendData={totalBookingsMetric?.trendData || defaultTrendData}
        trend={totalBookingsMetric?.currentPeriod.trend || 'stable'}
        trendPercentage={totalBookingsMetric?.currentPeriod.trendPercentage || 0}
      />
      
      <MetricSummary
        title="Overall Conversion"
        value={overallConversionMetric?.currentPeriod.value || "N/A"}
        previousValue={overallConversionMetric?.previousPeriod.value || "N/A"}
        trendData={overallConversionMetric?.trendData || defaultTrendData}
        trend={overallConversionMetric?.currentPeriod.trend || 'stable'}
        trendPercentage={overallConversionMetric?.currentPeriod.trendPercentage || 0}
      />
      
      <MetricSummary
        title="App Bookings"
        value={appBookings?.value || "N/A"}
        previousValue={appBookings?.previousValue || "N/A"}
        trendData={totalBookingsMetric?.trendData || defaultTrendData}
        trend={appBookings?.trend || 'stable'}
        trendPercentage={appBookings?.trendPercentage || 0}
      />
      
      <MetricSummary
        title="Brand App Conversion"
        value={brandAppConversionMetric?.currentPeriod.value || "N/A"}
        previousValue={brandAppConversionMetric?.previousPeriod.value || "N/A"}
        trendData={brandAppConversionMetric?.trendData || defaultTrendData}
        trend={brandAppConversionMetric?.currentPeriod.trend || 'stable'}
        trendPercentage={brandAppConversionMetric?.currentPeriod.trendPercentage || 0}
      />
    </div>
  );
};

export default DashboardSummary;
