
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDownIcon, TrendingUpIcon, AlertCircleIcon } from "lucide-react";

const MetricInsights = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-fade-up">
      <Card className="overflow-hidden">
        <CardHeader className="bg-secondary/50 flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Key Insights</CardTitle>
            <CardDescription>
              Trends and anomalies detected
            </CardDescription>
          </div>
          <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-red-100 p-2 rounded-full">
                <TrendingDownIcon className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Conversion Rate Decrease</h4>
                <p className="text-sm text-gray-600">Overall conversion has decreased by 9% compared to the previous period. This is primarily driven by a decline in Brand app conversion (-8.6%).</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <TrendingUpIcon className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Strong Train App Performance</h4>
                <p className="text-sm text-gray-600">Train App bookings have increased by 5.2% week-over-week, outperforming other booking channels. This represents a continuing upward trend from February's average.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <AlertCircleIcon className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">iOS Booking Decline</h4>
                <p className="text-sm text-gray-600">Brand iOS bookings have decreased by 2.4% compared to the previous period and are below both January and February averages. This may require investigation.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="bg-secondary/50 flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
            <CardDescription>
              Based on current metrics
            </CardDescription>
          </div>
          <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <span className="text-xs font-bold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Investigate Conversion Drop</h4>
                <p className="text-sm text-gray-600">Analyze funnel steps to identify specific drop-off points in the brand app user journey that may be causing the conversion decline.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <span className="text-xs font-bold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Optimize iOS App Experience</h4>
                <p className="text-sm text-gray-600">Review recent iOS app updates or changes that may have negatively impacted the booking process. Consider A/B testing improvements.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <span className="text-xs font-bold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Leverage Train App Success</h4>
                <p className="text-sm text-gray-600">Analyze the factors contributing to Train App growth and consider applying successful elements to other booking channels.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricInsights;
