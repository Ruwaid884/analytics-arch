
import { Category, Metric, Period, TrendPoint } from '@/types/metrics';

// Helper function to generate trend line data
const generateTrendData = (baseValue: number, volatility: number = 0.05, points: number = 14): TrendPoint[] => {
  const trendData: TrendPoint[] = [];
  let currentValue = baseValue;
  
  for (let i = 0; i < points; i++) {
    // Add some randomness to create a natural looking trend
    const randomFactor = 1 + (Math.random() * volatility * 2 - volatility);
    currentValue = currentValue * randomFactor;
    
    trendData.push({
      x: i,
      y: currentValue
    });
  }
  
  return trendData;
};

// Create mock periods
export const periods: Period[] = [
  {
    id: 'current',
    name: '10 Mar - 16 Mar',
    startDate: '2023-03-10',
    endDate: '2023-03-16'
  },
  {
    id: 'previous',
    name: '03 Mar - 09 Mar',
    startDate: '2023-03-03',
    endDate: '2023-03-09'
  }
];

// Create mock categories and metrics data based on the Excel screenshot
export const mockCategories: Category[] = [
  {
    id: 'bookings',
    name: 'Bookings',
    metrics: [
      {
        id: 'total-bookings',
        l1Category: 'Bookings',
        l2Category: 'Bookings',
        name: 'Total Bookings',
        currentPeriod: { value: 100955, trend: 'up', trendPercentage: 1.5 },
        previousPeriod: { value: 99480 },
        febAvg: { value: 97892 },
        janAvg: { value: 99639 },
        decAvg: { value: 95292 },
        trendData: generateTrendData(100000, 0.01)
      },
      {
        id: 'brand-android',
        l1Category: 'Bookings',
        l2Category: 'Bookings',
        name: 'Brand Android',
        currentPeriod: { value: 27623, trend: 'down', trendPercentage: 0.8 },
        previousPeriod: { value: 27851 },
        febAvg: { value: 27145 },
        janAvg: { value: 27624 },
        decAvg: { value: 27012 },
        trendData: generateTrendData(27500, 0.005)
      },
      {
        id: 'brand-ios',
        l1Category: 'Bookings',
        l2Category: 'Bookings',
        name: 'Brand iOS',
        currentPeriod: { value: 15710, trend: 'down', trendPercentage: 2.4 },
        previousPeriod: { value: 16089 },
        febAvg: { value: 16145 },
        janAvg: { value: 16606 },
        decAvg: { value: 16316 },
        trendData: generateTrendData(16000, 0.008)
      },
      {
        id: 'train-app',
        l1Category: 'Bookings',
        l2Category: 'Bookings',
        name: 'Train App',
        currentPeriod: { value: 20017, trend: 'up', trendPercentage: 5.2 },
        previousPeriod: { value: 19036 },
        febAvg: { value: 18144 },
        janAvg: { value: 18557 },
        decAvg: { value: 16859 },
        trendData: generateTrendData(19000, 0.01)
      },
      {
        id: 'desktop-web',
        l1Category: 'Bookings',
        l2Category: 'Bookings',
        name: 'Desktop Web',
        currentPeriod: { value: 10551, trend: 'down', trendPercentage: 3.3 },
        previousPeriod: { value: 10909 },
        febAvg: { value: 11831 },
        janAvg: { value: 12273 },
        decAvg: { value: 12115 },
        trendData: generateTrendData(11000, 0.015)
      },
      {
        id: 'mobile-web',
        l1Category: 'Bookings',
        l2Category: 'Bookings',
        name: 'Mobile Web',
        currentPeriod: { value: 7584, trend: 'up', trendPercentage: 5.5 },
        previousPeriod: { value: 7187 },
        febAvg: { value: 7420 },
        janAvg: { value: 7005 },
        decAvg: { value: 6827 },
        trendData: generateTrendData(7200, 0.02)
      },
      {
        id: 'confirmtckt',
        l1Category: 'Bookings',
        l2Category: 'Bookings',
        name: 'Confirmtckt',
        currentPeriod: { value: 8864, trend: 'up', trendPercentage: 7.3 },
        previousPeriod: { value: 8258 },
        febAvg: { value: 7554 },
        janAvg: { value: 7568 },
        decAvg: { value: 6925 },
        trendData: generateTrendData(8000, 0.025)
      },
      {
        id: 'phonepe',
        l1Category: 'Bookings',
        l2Category: 'Bookings',
        name: 'Phonepe',
        currentPeriod: { value: 10240, trend: 'up', trendPercentage: 4.6 },
        previousPeriod: { value: 9791 },
        febAvg: { value: 8957 },
        janAvg: { value: 9195 },
        decAvg: { value: 8963 },
        trendData: generateTrendData(9500, 0.02)
      }
    ]
  },
  {
    id: 'conversion',
    name: 'Conversion and Market share',
    metrics: [
      {
        id: 'overall-conversion',
        l1Category: 'Funnel conversion - Overall',
        l2Category: 'Conversion and Market share',
        name: 'Overall conversion',
        currentPeriod: { value: 0.71, trend: 'down', trendPercentage: 9.0 },
        previousPeriod: { value: 0.78 },
        febAvg: { value: 0.68 },
        janAvg: { value: 0.69 },
        decAvg: { value: 0.74 },
        trendData: generateTrendData(0.7, 0.05)
      },
      {
        id: 'brand-app-conversion',
        l1Category: 'Funnel conversion - Overall',
        l2Category: 'Conversion and Market share',
        name: 'Brand app conversion',
        currentPeriod: { value: '1.38%', trend: 'down', trendPercentage: 8.6 },
        previousPeriod: { value: '1.51%' },
        febAvg: { value: '1.34%' },
        janAvg: { value: '1.38%' },
        decAvg: { value: '1.43%' },
        trendData: generateTrendData(1.4, 0.03)
      },
      {
        id: 'trains-app-conversion',
        l1Category: 'Funnel conversion - Overall',
        l2Category: 'Conversion and Market share',
        name: 'Trains app conversion',
        currentPeriod: { value: '0.42%', trend: 'down', trendPercentage: 4.5 },
        previousPeriod: { value: '0.44%' },
        febAvg: { value: '0.38%' },
        janAvg: { value: '0.40%' },
        decAvg: { value: '0.40%' },
        trendData: generateTrendData(0.4, 0.02)
      },
      {
        id: 'market-share-domestic',
        l1Category: 'Funnel conversion - Overall',
        l2Category: 'Conversion and Market share',
        name: 'Market Share Domestic',
        currentPeriod: { value: '', trend: 'stable'},
        previousPeriod: { value: '4.02%' },
        febAvg: { value: '3.97%' },
        janAvg: { value: '4.16%' },
        decAvg: { value: '3.88%' },
        trendData: generateTrendData(4, 0.01)
      },
      {
        id: 'market-share-overall',
        l1Category: 'Funnel conversion - Overall',
        l2Category: 'Conversion and Market share',
        name: 'Market Share Overall',
        currentPeriod: { value: '', trend: 'stable' },
        previousPeriod: { value: '3.49%' },
        febAvg: { value: '3.46%' },
        janAvg: { value: '3.59%' },
        decAvg: { value: '3.45%' },
        trendData: generateTrendData(3.5, 0.01)
      },
      {
        id: 'overall-pax',
        l1Category: 'Funnel conversion - Overall',
        l2Category: 'Conversion and Market share',
        name: 'Overall daily average pax flown through ixigo',
        currentPeriod: { value: '', trend: 'stable' },
        previousPeriod: { value: 21145 },
        febAvg: { value: 21877 },
        janAvg: { value: 21878 },
        decAvg: { value: 20677 },
        trendData: generateTrendData(21000, 0.01)
      }
    ]
  },
  {
    id: 'pricing',
    name: 'Pricing & Offers',
    metrics: [
      {
        id: 'avg-discount-brand-app',
        l1Category: 'Funnel conversion - Overall',
        l2Category: 'Pricing & Offers',
        name: 'Avg Discount- Brand App (Dom)',
        currentPeriod: { value: 460, trend: 'down', trendPercentage: 4.8 },
        previousPeriod: { value: 483 },
        febAvg: { value: 530 },
        janAvg: { value: 545 },
        decAvg: { value: 540 },
        trendData: generateTrendData(490, 0.03)
      },
      {
        id: 'avg-discount-trains-app',
        l1Category: 'Funnel conversion - Overall',
        l2Category: 'Pricing & Offers',
        name: 'Avg Discount- Trains App (Dom)',
        currentPeriod: { value: 497, trend: 'down', trendPercentage: 8.6 },
        previousPeriod: { value: 544 },
        febAvg: { value: 672 },
        janAvg: { value: 629 },
        decAvg: { value: 524 },
        trendData: generateTrendData(550, 0.05)
      },
      {
        id: 'atv-dom',
        l1Category: 'Funnel conversion - Overall',
        l2Category: 'Pricing & Offers',
        name: 'ATV- Dom',
        currentPeriod: { value: '', trend: 'stable' },
        previousPeriod: { value: 10356 },
        febAvg: { value: 12211 },
        janAvg: { value: 11684 },
        decAvg: { value: 11722 },
        trendData: generateTrendData(11000, 0.02)
      },
      {
        id: 'discount-atv-brand-app',
        l1Category: 'Funnel conversion - Overall',
        l2Category: 'Pricing & Offers',
        name: 'Discount/ATV- Brand App',
        currentPeriod: { value: '4.70%', trend: 'up', trendPercentage: 0.6 },
        previousPeriod: { value: '4.67%' },
        febAvg: { value: '4.42%' },
        janAvg: { value: '4.76%' },
        decAvg: { value: '4.67%' },
        trendData: generateTrendData(4.6, 0.02)
      }
    ]
  }
];

// Helper to determine color class based on trend
export const getTrendColorClass = (trend?: string): string => {
  if (!trend) return 'bg-metric-neutral';
  return trend === 'up' ? 'bg-metric-positive' : trend === 'down' ? 'bg-metric-negative' : 'bg-metric-neutral';
};

// Get formatted percentage with + or - sign
export const getFormattedPercentage = (value?: number): string => {
  if (!value) return '0%';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};
