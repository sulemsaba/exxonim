import type { ReactNode, ComponentProps } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';

// ----------------------------------------------------------------------

export type LabelColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export type LabelVariant = 'filled' | 'outlined' | 'soft' | 'inverted';

export interface LabelProps extends ComponentProps<'span'> {
  sx?: SxProps<Theme>;
  disabled?: boolean;
  color?: LabelColor;
  variant?: LabelVariant;
  endIcon?: ReactNode;
  startIcon?: ReactNode;
}
