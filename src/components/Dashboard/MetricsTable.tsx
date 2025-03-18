import React from 'react';
import { Category, Metric } from '@/types/metrics';
import MetricRow from './MetricRow';
import { useState, useEffect, useMemo } from 'react';
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
  const [periodColumns, setPeriodColumns] = useState<string[][]>([]);

  // Group metrics by L2 category
  const groupedMetrics = useMemo(() => {
    const groups: { [key: string]: Metric[] } = {};
    
    // First, identify all unique L2 categories
    const l2Categories = new Set<string>();
    category.metrics.forEach(metric => {
      if (metric.l2Category) {
        l2Categories.add(metric.l2Category);
      }
    });
    
    console.log(`L1 Category: ${category.name}, Found L2 categories:`, Array.from(l2Categories));
    console.log(`Total metrics under ${category.name}:`, category.metrics.length);
    
    // Initialize groups for each L2 category
    l2Categories.forEach(l2Category => {
      groups[l2Category] = [];
    });
    
    // Populate groups
    category.metrics.forEach(metric => {
      const l2Category = metric.l2Category || 'Other';
      if (!groups[l2Category]) {
        groups[l2Category] = [];
      }
      groups[l2Category].push(metric);
    });
    
    // Log the number of metrics in each L2 category
    Object.entries(groups).forEach(([l2Cat, metrics]) => {
      console.log(`L2 Category: ${l2Cat} has ${metrics.length} metrics`);
    });
    
    return groups;
  }, [category.metrics]);

  // Group columns in the format: [4 weeks, monthly average]
  useEffect(() => {
    if (category.metrics.length === 0) return;
    
    // Get available period columns from the first metric's additionalFields
    const firstMetric = category.metrics[0];
    if (!firstMetric.additionalFields) return;
    
    const allColumns = Object.keys(firstMetric.additionalFields);
    
    // Filter out columns that represent periods (dates or averages)
    const periodColumns = allColumns.filter(col => 
      col.includes('-') || col.includes('Avg') || /^[A-Za-z]{3}$/.test(col)
    );
    
    // Preserve the original order from the CSV
    // This ensures monthly averages appear in the same position as in the CSV
    const sortedColumns = [...periodColumns].sort((a, b) => {
      return allColumns.indexOf(a) - allColumns.indexOf(b);
    });
    
    console.log("Original column order:", sortedColumns);
    
    // Analyze column structure to determine if there's a pattern
    // We'll check for patterns like 4 weeks followed by a monthly average
    let weekColumnsInARow = 0;
    let maxWeekColumnsInARow = 0;
    let monthlyAvgAfterWeeks = false;
    
    for (let i = 0; i < sortedColumns.length; i++) {
      const col = sortedColumns[i];
      const nextCol = i < sortedColumns.length - 1 ? sortedColumns[i + 1] : null;
      
      if (col.includes('-')) {
        weekColumnsInARow++;
        maxWeekColumnsInARow = Math.max(maxWeekColumnsInARow, weekColumnsInARow);
      } else {
        if (col.includes('Avg') && weekColumnsInARow > 0) {
          monthlyAvgAfterWeeks = true;
        }
        weekColumnsInARow = 0;
      }
    }
    
    // Determine the best grouping strategy based on the analysis
    let groupSize = 5; // Default to 5 (4 weeks + 1 avg)
    
    if (maxWeekColumnsInARow === 4 && monthlyAvgAfterWeeks) {
      // Confirmed pattern of 4 weeks followed by monthly avg
      groupSize = 5;
    } else if (maxWeekColumnsInARow > 0) {
      // Some other pattern of weeks, possibly followed by an average
      groupSize = maxWeekColumnsInARow + (monthlyAvgAfterWeeks ? 1 : 0);
    }
    
    console.log(`Detected column pattern: ${maxWeekColumnsInARow} weeks ${monthlyAvgAfterWeeks ? 'with' : 'without'} monthly avg`);
    console.log(`Using group size: ${groupSize}`);
    
    // Group into chunks respecting the original order
    const groupedColumns: string[][] = [];
    let currentGroup: string[] = [];
    
    for (let i = 0; i < sortedColumns.length; i++) {
      currentGroup.push(sortedColumns[i]);
      
      if (currentGroup.length === groupSize || i === sortedColumns.length - 1) {
        groupedColumns.push([...currentGroup]);
        currentGroup = [];
      }
    }
    
    // Add any remaining columns
    if (currentGroup.length > 0) {
      groupedColumns.push(currentGroup);
    }
    
    console.log("Grouped columns:", groupedColumns);
    setPeriodColumns(groupedColumns);
  }, [category.metrics]);

  // Check if any metrics have additional fields
  const hasAdditionalFields = category.metrics.some(
    metric => metric.additionalFields && Object.values(metric.additionalFields).some(val => val !== '')
  );

  // Determine how many column groups to show
  const visibleGroups = showAllPeriods ? periodColumns : periodColumns.slice(0, 3);

  // Format column header for display
  const formatColumnHeader = (column: string) => {
    // For dates like "10 Mar - 16 Mar", show both dates in a compact format
    if (column.includes('-')) {
      const parts = column.split('-');
      if (parts.length === 2) {
        const startPart = parts[0].trim();
        const endPart = parts[1].trim();
        
        // If it contains a date format like "10 Mar", extract day and month from both parts
        if (/\d+\s[A-Za-z]{3}/.test(startPart) && /\d+\s[A-Za-z]{3}/.test(endPart)) {
          const startDay = startPart.match(/(\d+)/)?.[0] || '';
          const startMonth = startPart.match(/([A-Za-z]{3})/)?.[0] || '';
          const endDay = endPart.match(/(\d+)/)?.[0] || '';
          const endMonth = endPart.match(/([A-Za-z]{3})/)?.[0] || '';
          
          // If months are the same, show as "10-16 Mar" format
          if (startMonth === endMonth) {
            return `${startDay}-${endDay} ${startMonth}`;
          } else {
            // If months are different, show as "10 Mar-16 Apr" format
            return `${startDay} ${startMonth}-${endDay} ${endMonth}`;
          }
        }
      }
    }
    return column;
  };

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
        
        {hasAdditionalFields && isExpanded && periodColumns.length > 3 && (
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
                <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                  L2 Metric
                </th>
                <th scope="col" className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">
                  Trendline
                </th>
                
                {/* Display all period columns grouped by [4 weeks + monthly avg] */}
                {visibleGroups.map((group, groupIndex) => (
                  group.map((column, colIndex) => (
                    <th 
                      key={`${groupIndex}-${colIndex}`} 
                      scope="col" 
                      className={cn(
                        "py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",
                        column.includes('Avg') ? "bg-gray-100" : ""
                      )}
                    >
                      {formatColumnHeader(column)}
                    </th>
                  ))
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(groupedMetrics).map(([l2Category, metrics], groupIndex) => (
                <React.Fragment key={`l2-${l2Category}`}>
                  {/* Metrics within this L2 Category */}
                  {metrics.map((metric, metricIndex) => (
                    <tr key={metric.id} className={metricIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="py-3 px-4 text-sm text-gray-900 sticky left-0 bg-inherit pl-8">
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
                      
                      {/* Display values for all period columns grouped by [4 weeks + monthly avg] */}
                      {visibleGroups.map((group, groupIndex) => (
                        group.map((column, colIndex) => {
                          const value = metric.additionalFields?.[column] || '';
                          return (
                            <td 
                              key={`${groupIndex}-${colIndex}`} 
                              className={cn(
                                "py-3 px-4 text-right text-sm", 
                                column.includes('Avg') ? "bg-gray-50 font-medium" : "text-gray-900",
                                "bg-inherit" // Inherit background from parent row
                              )}
                            >
                              {value !== '' ? value : '-'}
                            </td>
                          );
                        })
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MetricsTable;
