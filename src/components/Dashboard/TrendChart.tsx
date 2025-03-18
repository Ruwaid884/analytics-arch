
import { TrendPoint } from '@/types/metrics';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { cn } from '@/lib/utils';

interface TrendChartProps {
  data: TrendPoint[];
  trend?: 'up' | 'down' | 'stable';
  height?: number;
  width?: number;
  className?: string;
  showAxis?: boolean;
}

const TrendChart = ({ 
  data, 
  trend = 'stable',
  height = 40, 
  width = 120,
  className,
  showAxis = false
}: TrendChartProps) => {
  // Determine the color based on the trend
  const getStrokeColor = () => {
    switch (trend) {
      case 'up':
        return '#10b981'; // Green
      case 'down':
        return '#ef4444'; // Red
      default:
        return '#6366f1'; // Purple/Blue for stable
    }
  };

  const strokeColor = getStrokeColor();
  const fillColor = strokeColor + '20'; // Add 20% opacity to the stroke color

  return (
    <div className={cn("trend-chart overflow-hidden", className)}>
      <ResponsiveContainer width={width} height={height}>
        <AreaChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          {showAxis && (
            <>
              <XAxis 
                dataKey="x" 
                hide={!showAxis} 
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                hide={!showAxis} 
                tick={{ fontSize: 10 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [value.toFixed(2), 'Value']}
                labelFormatter={() => ''}
              />
            </>
          )}
          <defs>
            <linearGradient id={`colorGradient-${trend}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.2} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="y"
            stroke={strokeColor}
            strokeWidth={1.5}
            fill={`url(#colorGradient-${trend})`}
            className="trend-line"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
