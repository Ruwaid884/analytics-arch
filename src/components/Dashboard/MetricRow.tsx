
import { Metric } from '@/types/metrics';
import TrendChart from './TrendChart';
import { cn } from '@/lib/utils';
import { getTrendColorClass, getFormattedPercentage } from '@/utils/mockData';
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react';

interface MetricRowProps {
  metric: Metric;
  isAlternate?: boolean;
}

const MetricRow = ({ metric, isAlternate = false }: MetricRowProps) => {
  const {
    name,
    currentPeriod,
    previousPeriod,
    febAvg,
    janAvg,
    decAvg,
    trendData
  } = metric;

  const getBgColor = (value?: any, baseline?: any): string => {
    if (!value || !baseline || value === '' || baseline === '') return '';
    
    // Convert to numbers if they're strings containing numbers
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    const numBaseline = typeof baseline === 'string' ? parseFloat(baseline) : baseline;
    
    if (isNaN(numValue) || isNaN(numBaseline)) return '';
    
    const percentDiff = ((numValue - numBaseline) / numBaseline) * 100;
    
    if (percentDiff > 1) return 'bg-metric-positive';
    if (percentDiff < -1) return 'bg-metric-negative';
    return '';
  };
  
  const TrendIcon = () => {
    if (!currentPeriod.trend || currentPeriod.trend === 'stable') {
      return <MinusIcon className="h-3 w-3 text-gray-500" />;
    }
    
    return currentPeriod.trend === 'up' ? (
      <ArrowUpIcon className="h-3 w-3 text-emerald-600" />
    ) : (
      <ArrowDownIcon className="h-3 w-3 text-red-600" />
    );
  };

  return (
    <tr className={cn(
      "metric-row transition-colors",
      isAlternate ? "bg-gray-50/50" : "bg-white"
    )}>
      <td className="py-3 px-4 text-sm font-medium text-gray-900 whitespace-nowrap">
        {name}
      </td>
      <td className="py-2 px-2">
        <div className="flex justify-center">
          <TrendChart 
            data={trendData} 
            trend={currentPeriod.trend}
            height={32}
            width={100}
          />
        </div>
      </td>
      <td className={cn(
        "py-3 px-4 text-sm font-medium text-right whitespace-nowrap",
        getBgColor(currentPeriod.value, previousPeriod.value)
      )}>
        <div className="flex items-center justify-end gap-1">
          {currentPeriod.value !== '' ? currentPeriod.value : '-'}
          {currentPeriod.trendPercentage && (
            <span className="text-xs ml-1 flex items-center">
              <TrendIcon />
              {getFormattedPercentage(currentPeriod.trendPercentage)}
            </span>
          )}
        </div>
      </td>
      <td className={cn(
        "py-3 px-4 text-sm text-right whitespace-nowrap",
        getBgColor(previousPeriod.value, febAvg.value)
      )}>
        {previousPeriod.value !== '' ? previousPeriod.value : '-'}
      </td>
      <td className={cn(
        "py-3 px-4 text-sm text-right whitespace-nowrap",
        getBgColor(febAvg.value, janAvg.value)
      )}>
        {febAvg.value !== '' ? febAvg.value : '-'}
      </td>
      <td className={cn(
        "py-3 px-4 text-sm text-right whitespace-nowrap",
        getBgColor(janAvg.value, decAvg.value)
      )}>
        {janAvg.value !== '' ? janAvg.value : '-'}
      </td>
      <td className="py-3 px-4 text-sm text-right whitespace-nowrap">
        {decAvg.value !== '' ? decAvg.value : '-'}
      </td>
    </tr>
  );
};

export default MetricRow;
