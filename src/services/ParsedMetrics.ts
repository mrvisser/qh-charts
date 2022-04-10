export type CsvLocale = 'ca' | 'us';

export type MetricValue<T> = {
  time: number;
  value: T;
};

export type ParsedMetrics = {
  locale: CsvLocale;
  data: Record<string, number>;
};
