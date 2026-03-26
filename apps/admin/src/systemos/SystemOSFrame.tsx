import type { PropsWithChildren } from 'react';

import './SystemOSWorkspace.css';

import type { SystemOSTheme } from './types';

export interface SystemOSFrameProps extends PropsWithChildren {
  theme?: SystemOSTheme;
  padded?: boolean;
}

export function SystemOSFrame({ theme = 'dark', padded = true, children }: SystemOSFrameProps) {
  return (
    <div className="systemos-admin systemos-frame" data-theme={theme}>
      {padded ? <div className="content">{children}</div> : children}
    </div>
  );
}
