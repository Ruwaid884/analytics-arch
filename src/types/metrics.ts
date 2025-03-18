
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

export interface AdditionalFields {
  novAvg?: string | number;
  oct?: string | number;
  sep?: string | number;
  aug?: string | number;
  july?: string | number;
  june?: string | number;
  mayAvg?: string | number;
  aprAvg?: string | number;
  marAvg?: string | number;
  febAvgLastYear?: string | number;
  janAvgLastYear?: string | number;
  [key: string]: string | number | undefined;
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
  additionalFields?: AdditionalFields;
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
