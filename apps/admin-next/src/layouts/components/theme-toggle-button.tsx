import IconButton from '@mui/material/IconButton';
import { useColorScheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ThemeToggleButton() {
  const { mode, setMode } = useColorScheme();

  if (!mode) {
    return null;
  }

  const nextMode = mode === 'dark' ? 'light' : 'dark';

  return (
    <IconButton
      onClick={() => setMode(nextMode)}
      aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <Iconify icon={mode === 'dark' ? 'solar:sun-2-bold' : 'solar:moon-bold'} />
    </IconButton>
  );
}
