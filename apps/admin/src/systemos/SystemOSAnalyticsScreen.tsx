import type { SystemOSTheme } from './types';
import type { SystemOSAnalyticsDashboardProps } from './types';

import { SystemOSAnalyticsDashboard } from './SystemOSAnalyticsDashboard';
import { SystemOSFrame } from './SystemOSFrame';

export interface SystemOSAnalyticsScreenProps extends SystemOSAnalyticsDashboardProps {
  theme?: SystemOSTheme;
  padded?: boolean;
}

export function SystemOSAnalyticsScreen({ theme = 'dark', padded = true, ...props }: SystemOSAnalyticsScreenProps) {
  return (
    <SystemOSFrame theme={theme} padded={padded}>
      <SystemOSAnalyticsDashboard {...props} />
    </SystemOSFrame>
  );
}
