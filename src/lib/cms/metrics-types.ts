export type CmsMetric = {
  metric: string;
  label: string;
};

export type CmsMetricsContent = {
  heading: string;
  metrics: CmsMetric[];
};
