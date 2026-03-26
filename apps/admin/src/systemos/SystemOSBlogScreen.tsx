import type { SystemOSTheme } from './types';
import type { SystemOSBlogManagerProps } from './types';

import { SystemOSBlogManager } from './SystemOSBlogManager';
import { SystemOSFrame } from './SystemOSFrame';

export interface SystemOSBlogScreenProps extends SystemOSBlogManagerProps {
  theme?: SystemOSTheme;
  padded?: boolean;
}

export function SystemOSBlogScreen({ theme = 'dark', padded = true, ...props }: SystemOSBlogScreenProps) {
  return (
    <SystemOSFrame theme={theme} padded={padded}>
      <SystemOSBlogManager {...props} />
    </SystemOSFrame>
  );
}
