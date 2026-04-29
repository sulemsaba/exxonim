import type { DashboardViewType } from '../config/dashboard-config';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export interface DashboardSwitcherProps {
  currentView: DashboardViewType;
  availableViews: Array<{
    id: DashboardViewType;
    label: string;
    description: string;
    icon: string;
  }>;
  onViewChange?: (viewId: DashboardViewType) => void;
}

export function DashboardSwitcher({ 
  currentView, 
  availableViews,
  onViewChange 
}: DashboardSwitcherProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const currentViewConfig = availableViews.find(view => view.id === currentView) || availableViews[0];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (viewId: DashboardViewType) => {
    if (onViewChange) {
      onViewChange(viewId);
    }
    handleClose();
  };

  // If only one view is available, don't show switcher
  if (availableViews.length <= 1) {
    return null;
  }

  return (
    <Box>
      <Button
        id="dashboard-view-switcher"
        aria-controls={open ? 'dashboard-view-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="outlined"
        size="small"
        startIcon={<Iconify icon={currentViewConfig.icon} width={18} />}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} width={18} />}
        sx={{ minWidth: 180, justifyContent: 'space-between' }}
      >
        {currentViewConfig.label}
      </Button>
      
      <Menu
        id="dashboard-view-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'dashboard-view-switcher',
        }}
        PaperProps={{
          sx: { minWidth: 220, maxWidth: 320 }
        }}
      >
        {availableViews.map((view) => (
          <MenuItem
            key={view.id}
            onClick={() => handleSelect(view.id)}
            selected={view.id === currentView}
            sx={{ py: 1.5 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Iconify 
                icon={view.icon} 
                width={20} 
                sx={{ 
                  color: view.id === currentView ? 'primary.main' : 'text.secondary',
                  mt: 0.25 
                }} 
              />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: view.id === currentView ? 600 : 400 }}>
                  {view.label}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}>
                  {view.description}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}