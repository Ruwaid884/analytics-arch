
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ZoomIn } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DrillDownChartProps {
  title: string;
  metric: string;
}

const dailyData = [
  { date: "10 Mar", value: 14108, previousValue: 13948 },
  { date: "11 Mar", value: 14312, previousValue: 14011 },
  { date: "12 Mar", value: 14526, previousValue: 14198 },
  { date: "13 Mar", value: 14387, previousValue: 14287 },
  { date: "14 Mar", value: 14689, previousValue: 14532 },
  { date: "15 Mar", value: 14821, previousValue: 14623 },
  { date: "16 Mar", value: 14112, previousValue: 13881 },
];

const hourlyData = [
  { hour: "00:00", value: 589, previousValue: 562 },
  { hour: "02:00", value: 412, previousValue: 398 },
  { hour: "04:00", value: 321, previousValue: 315 },
  { hour: "06:00", value: 498, previousValue: 482 },
  { hour: "08:00", value: 789, previousValue: 763 },
  { hour: "10:00", value: 1021, previousValue: 992 },
  { hour: "12:00", value: 1156, previousValue: 1120 },
  { hour: "14:00", value: 1245, previousValue: 1198 },
  { hour: "16:00", value: 1342, previousValue: 1302 },
  { hour: "18:00", value: 1453, previousValue: 1410 },
  { hour: "20:00", value: 1289, previousValue: 1245 },
  { hour: "22:00", value: 898, previousValue: 872 },
];

const DrillDownChart = ({ title, metric }: DrillDownChartProps) => {
  const [chartType, setChartType] = useState<"area" | "bar">("area");
  const [timeFrame, setTimeFrame] = useState<"daily" | "hourly">("daily");
  const [isExpanded, setIsExpanded] = useState(true);

  const data = timeFrame === "daily" ? dailyData : hourlyData;
  const xKey = timeFrame === "daily" ? "date" : "hour";

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8 animate-fade-up">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2 p-1 h-6 w-6"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isExpanded ? "" : "-rotate-90"
              }`}
            />
          </Button>
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>

        <div className="flex items-center space-x-2">
          <Tabs
            value={timeFrame}
            onValueChange={(v) => setTimeFrame(v as "daily" | "hourly")}
            className="bg-gray-100 rounded-lg p-1"
          >
            <TabsList className="bg-transparent">
              <TabsTrigger
                value="daily"
                className="text-xs h-7 px-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Daily
              </TabsTrigger>
              <TabsTrigger
                value="hourly"
                className="text-xs h-7 px-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Hourly
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs
            value={chartType}
            onValueChange={(v) => setChartType(v as "area" | "bar")}
            className="bg-gray-100 rounded-lg p-1"
          >
            <TabsList className="bg-transparent">
              <TabsTrigger
                value="area"
                className="text-xs h-7 px-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Line
              </TabsTrigger>
              <TabsTrigger
                value="bar"
                className="text-xs h-7 px-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Bar
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
            <ZoomIn className="h-3 w-3 mr-1" />
            Detail
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorPrevValue"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey={xKey}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="value"
                  name={`Current ${metric}`}
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  animationDuration={1000}
                  isAnimationActive={true}
                />
                <Area
                  type="monotone"
                  dataKey="previousValue"
                  name={`Previous ${metric}`}
                  stroke="#82ca9d"
                  fillOpacity={1}
                  fill="url(#colorPrevValue)"
                  animationDuration={1000}
                  isAnimationActive={true}
                />
              </AreaChart>
            ) : (
              <BarChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey={xKey}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="value"
                  name={`Current ${metric}`}
                  fill="#8884d8"
                  animationDuration={1000}
                  isAnimationActive={true}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="previousValue"
                  name={`Previous ${metric}`}
                  fill="#82ca9d"
                  animationDuration={1000}
                  isAnimationActive={true}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default DrillDownChart;
