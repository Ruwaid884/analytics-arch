
import { Category, Metric } from '@/types/metrics';
import MetricRow from './MetricRow';
import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricsTableProps {
  category: Category;
  currentPeriod: string;
  previousPeriod: string;
}

const MetricsTable = ({ 
  category, 
  currentPeriod, 
  previousPeriod 
}: MetricsTableProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAllPeriods, setShowAllPeriods] = useState(false);

  // Check if any metrics have additional fields
  const hasAdditionalFields = category.metrics.some(
    metric => metric.additionalFields && Object.values(metric.additionalFields).some(val => val !== '')
  );

  return (
    <div className="metric-category mb-8 bg-white rounded-lg shadow-sm overflow-hidden animate-fade-in">
      <div 
        className="category-header bg-gray-50 flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}>
          <div className="mr-2">
            {isExpanded ? 
              <ChevronDownIcon className="h-5 w-5 text-gray-500" /> : 
              <ChevronRightIcon className="h-5 w-5 text-gray-500" />
            }
          </div>
          <h3 className="font-medium text-gray-900">{category.name}</h3>
        </div>
        
        {hasAdditionalFields && isExpanded && (
          <button 
            onClick={() => setShowAllPeriods(!showAllPeriods)}
            className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
          >
            {showAllPeriods ? "Show Less Periods" : "Show All Periods"}
          </button>
        )}
      </div>
      
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isExpanded ? "max-h-[2000px]" : "max-h-0"
      )}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {category.id === 'bookings' ? 'L2 metric' : 'Metric'}
                </th>
                <th scope="col" className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">
                  Trendline
                </th>
                <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {currentPeriod}
                </th>
                <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {previousPeriod}
                </th>
                <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feb Avg
                </th>
                <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jan Avg
                </th>
                <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dec Avg
                </th>
                
                {showAllPeriods && (
                  <>
                    <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nov Avg
                    </th>
                    <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Oct
                    </th>
                    <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sep
                    </th>
                    <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aug
                    </th>
                    <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      July
                    </th>
                    <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      June
                    </th>
                    <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      May Avg
                    </th>
                    <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Apr Avg
                    </th>
                    <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mar Avg
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {category.metrics.map((metric, index) => (
                <tr key={metric.id} className={index % 2 !== 0 ? "bg-gray-50" : ""}>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {metric.name}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center">
                      <div className="w-[100px] h-[40px]">
                        {metric.trendData && metric.trendData.length > 0 && (
                          <svg width="100" height="40">
                            {/* Simple sparkline implementation */}
                            {metric.trendData.map((point, i, arr) => {
                              if (i === 0) return null;
                              
                              const yValues = arr.map(p => p.y);
                              const min = Math.min(...yValues);
                              const max = Math.max(...yValues);
                              const range = max - min || 1;
                              
                              const x1 = (arr[i-1].x / (arr.length - 1)) * 100;
                              const y1 = 35 - ((arr[i-1].y - min) / range) * 30;
                              const x2 = (point.x / (arr.length - 1)) * 100;
                              const y2 = 35 - ((point.y - min) / range) * 30;
                              
                              const trend = metric.currentPeriod.trend || 'stable';
                              const color = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#3b82f6';
                              
                              return (
                                <line 
                                  key={i}
                                  x1={x1} 
                                  y1={y1} 
                                  x2={x2} 
                                  y2={y2} 
                                  stroke={color} 
                                  strokeWidth="1.5"
                                />
                              );
                            })}
                          </svg>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-900">
                    {metric.currentPeriod.value !== '' ? metric.currentPeriod.value : '-'}
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-900">
                    {metric.previousPeriod.value !== '' ? metric.previousPeriod.value : '-'}
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-900">
                    {metric.febAvg.value !== '' ? metric.febAvg.value : '-'}
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-900">
                    {metric.janAvg.value !== '' ? metric.janAvg.value : '-'}
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-900">
                    {metric.decAvg.value !== '' ? metric.decAvg.value : '-'}
                  </td>
                  
                  {showAllPeriods && metric.additionalFields && (
                    <>
                      <td className="py-3 px-4 text-right text-sm text-gray-900">
                        {metric.additionalFields.novAvg !== '' ? metric.additionalFields.novAvg : '-'}
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-gray-900">
                        {metric.additionalFields.oct !== '' ? metric.additionalFields.oct : '-'}
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-gray-900">
                        {metric.additionalFields.sep !== '' ? metric.additionalFields.sep : '-'}
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-gray-900">
                        {metric.additionalFields.aug !== '' ? metric.additionalFields.aug : '-'}
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-gray-900">
                        {metric.additionalFields.july !== '' ? metric.additionalFields.july : '-'}
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-gray-900">
                        {metric.additionalFields.june !== '' ? metric.additionalFields.june : '-'}
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-gray-900">
                        {metric.additionalFields.mayAvg !== '' ? metric.additionalFields.mayAvg : '-'}
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-gray-900">
                        {metric.additionalFields.aprAvg !== '' ? metric.additionalFields.aprAvg : '-'}
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-gray-900">
                        {metric.additionalFields.marAvg !== '' ? metric.additionalFields.marAvg : '-'}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MetricsTable;
