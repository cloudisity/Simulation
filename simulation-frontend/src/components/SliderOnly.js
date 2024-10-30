// src/components/SliderOnly.js

import React from 'react';
import { Box, Slider, Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/system';

const Container = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const Label = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  fontWeight: 500,
}));

const SliderOnly = ({ label, name, value, onChange, min, max, step, tooltip }) => {
  const handleSliderChange = (event, newValue) => {
    onChange(event, newValue);
  };

  return (
    <Tooltip title={tooltip} arrow>
      <Container>
        <Label variant="subtitle1">{label}</Label>
        <Box display="flex" alignItems="center">
          <Slider
            name={name}
            value={typeof value === 'number' ? value : min}
            onChange={handleSliderChange}
            min={min}
            max={max}
            step={step}
            valueLabelDisplay="on"
            aria-labelledby={`${name}-slider`}
            sx={{
              flexGrow: 1,
              mr: 2,
              '& .MuiSlider-valueLabel': {
                backgroundColor: '#1976d2',
                color: '#fff',
                borderRadius: '4px',
                fontSize: '0.75rem',
              },
            }}
          />
        </Box>
      </Container>
    </Tooltip>
  );
};

export default SliderOnly;
