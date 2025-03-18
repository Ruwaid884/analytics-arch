
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

  return (
    <div className="metric-category mb-8 bg-white rounded-lg shadow-sm overflow-hidden animate-fade-in">
      <div 
        className="category-header bg-gray-50 flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="mr-2">
          {isExpanded ? 
            <ChevronDownIcon className="h-5 w-5 text-gray-500" /> : 
            <ChevronRightIcon className="h-5 w-5 text-gray-500" />
          }
        </div>
        <h3 className="font-medium text-gray-900">{category.name}</h3>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {category.metrics.map((metric, index) => (
                <MetricRow 
                  key={metric.id} 
                  metric={metric} 
                  isAlternate={index % 2 !== 0}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MetricsTable;
