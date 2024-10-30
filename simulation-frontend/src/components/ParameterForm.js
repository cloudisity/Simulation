// src/components/ParameterForm.js

import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Tooltip,
  Divider
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { styled } from '@mui/system';

// Styled components for better aesthetics
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: '#ffffff',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  fontWeight: 'bold',
}));

const ParameterForm = ({ params, handleChange, runSimulation, loading, paramDescriptions }) => {
  // Helper function to display more readable labels
  const getLabel = (key) => {
    const labels = {
      N: "Population Size",
      I: "Initial Infected",
      m: "Average Interactions",
      de: "Exposed Duration (days)",
      di: "Infected Duration (days)",
      tpe: "Transmission Probability (Exposed)",
      tpi: "Transmission Probability (Infected)",
      rp: "Recovery Probability",
      vp: "Vaccination Probability",
      mp: "Mask-Wearing Probability",
      ap: "Asymptomatic Probability",
      ip: "Isolation Probability",
      max: "Maximum Simulation Days",
      seed: "Random Seed",
      verbose: "Verbose Logging",
    };
    return labels[key] || key;
  };

  // Helper function to render text inputs for discrete parameters
  const renderTextInput = (key) => (
    <Grid item xs={12} sm={6}>
      <Tooltip title={paramDescriptions[key]} arrow>
        <TextField
          label={getLabel(key)}
          name={key}
          value={params[key]}
          onChange={handleChange}
          type="number"
          InputProps={{ inputProps: { min: 0, step: 1 } }}
          variant="outlined"
          fullWidth
          size="small"
        />
      </Tooltip>
    </Grid>
  );

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h5" gutterBottom>
        Simulation Parameters
      </Typography>
      <Divider />
      
      {/* Basic Parameters */}
      <SectionTitle variant="subtitle1">Basic Parameters</SectionTitle>
      <Grid container spacing={3}>
        {renderTextInput('N')}
        {renderTextInput('I')}
        {renderTextInput('max')}
        {renderTextInput('seed')}
      </Grid>

      {/* Disease Parameters */}
      <SectionTitle variant="subtitle1">Disease Parameters</SectionTitle>
      <Grid container spacing={3}>
        {renderTextInput('m')}
        {renderTextInput('de')}
        {renderTextInput('di')}
        {renderTextInput('tpe')}
        {renderTextInput('tpi')}
        {renderTextInput('rp')}
      </Grid>

      {/* Behavior Parameters */}
      <SectionTitle variant="subtitle1">Behavior Parameters</SectionTitle>
      <Grid container spacing={3}>
        {renderTextInput('vp')}
        {renderTextInput('mp')}
        {renderTextInput('ap')}
        {renderTextInput('ip')}
      </Grid>

      {/* Advanced Settings */}
      <SectionTitle variant="subtitle1">Advanced Settings</SectionTitle>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={params.verbose}
                onChange={handleChange}
                name="verbose"
                color="primary"
              />
            }
            label={getLabel('verbose')}
          />
        </Grid>
      </Grid>

      {/* Run Simulation Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={runSimulation}
        disabled={loading}
        startIcon={<PlayArrow />}
        fullWidth
        sx={{ marginTop: 3, padding: '12px 0', fontSize: '16px' }}
      >
        {loading ? 'Running Simulation...' : 'Run Simulation'}
      </Button>
    </StyledPaper>
  );
};

export default ParameterForm;
