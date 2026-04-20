import type { LinkProps } from '@mui/material/Link';

import { mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { styled, useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

const BRAND_MARK_SRC = '/assets/branding/exxonim-favicon-light.png';
const BRAND_MARK_INVERTED_SRC = '/assets/branding/exxonim-favicon-dark.png';
const BRAND_WORDMARK_SRC = '/assets/branding/exxonim-sidebar-logo.png';

export type LogoProps = LinkProps & {
  isSingle?: boolean;
  disabled?: boolean;
  inverted?: boolean;
};

export function Logo({
  sx,
  disabled,
  className,
  href = '/admin',
  isSingle = true,
  inverted = false,
  ...other
}: LogoProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Automatically invert logo in dark mode unless explicitly overridden
  const shouldInvert = inverted !== undefined ? inverted : isDarkMode;

  return (
    <LogoRoot
      component={RouterLink}
      href={href}
      aria-label="Exxonim"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          display: 'inline-flex',
          alignItems: 'center',
          ...(isSingle
            ? { width: 40, height: 40 }
            : {
                width: 'auto',
                height: 42,
                minWidth: 182,
              }),
          ...(disabled && { pointerEvents: 'none' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
      >
      <Box
        component="img"
        alt="Exxonim"
        src={isSingle ? (shouldInvert ? BRAND_MARK_INVERTED_SRC : BRAND_MARK_SRC) : BRAND_WORDMARK_SRC}
        sx={{
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'contain',
          objectPosition: 'left center',
        }}
      />
    </LogoRoot>
  );
}

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: 'transparent',
  verticalAlign: 'middle',
}));
