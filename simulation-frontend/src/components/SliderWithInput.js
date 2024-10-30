// src/components/SliderWithInput.js

import React from 'react';
import { Box, Slider, TextField, Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/system';

const Container = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const Label = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  fontWeight: 500,
}));

const SliderWithInput = ({ label, name, value, onChange, min, max, step, tooltip }) => {
  const handleSliderChange = (event, newValue) => {
    onChange(event, newValue);
  };

  const handleInputChange = (event) => {
    const newValue = event.target.value === '' ? '' : Number(event.target.value);
    onChange(event, newValue);
  };

  const handleBlur = () => {
    if (value < min) {
      onChange(null, min);
    } else if (value > max) {
      onChange(null, max);
    }
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
            valueLabelDisplay="auto"
            aria-labelledby={`${name}-slider`}
            sx={{ flexGrow: 1, mr: 2 }}
          />
          <TextField
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: step,
              min: min,
              max: max,
              type: 'number',
              'aria-labelledby': `${name}-slider`,
            }}
            variant="outlined"
            sx={{ width: 80 }}
          />
        </Box>
      </Container>
    </Tooltip>
  );
};

export default SliderWithInput;
