
export type TrendDirection = 'up' | 'down' | 'stable';

export interface MetricValue {
  value: string | number;
  trend?: TrendDirection;
  trendPercentage?: number;
}

export interface TrendPoint {
  x: number;
  y: number;
}

export interface Metric {
  id: string;
  l1Category: string;
  l2Category: string;
  name: string;
  currentPeriod: MetricValue;
  previousPeriod: MetricValue;
  febAvg: MetricValue;
  janAvg: MetricValue;
  decAvg: MetricValue;
  trendData: TrendPoint[];
}

export interface Category {
  id: string;
  name: string;
  metrics: Metric[];
}

export interface Period {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}
