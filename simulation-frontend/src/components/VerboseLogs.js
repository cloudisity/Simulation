// src/components/VerboseLogs.js

import React from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#ffffff',
}));

const VerboseLogs = ({ verboseLogs }) => {
  if (!verboseLogs || verboseLogs.length === 0) return null;

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h5" gutterBottom>
        Verbose Logs
      </Typography>
      <Divider />
      <Box mt={2}>
        <div style={{
          maxHeight: '300px',
          overflowY: 'auto',
          backgroundColor: '#f0f4f8',
          padding: '15px',
          borderRadius: '8px',
          fontFamily: 'Monospace',
          fontSize: '14px',
        }}>
          {verboseLogs.map((log, index) => (
            <Typography key={index} variant="body2" gutterBottom>
              {log}
            </Typography>
          ))}
        </div>
      </Box>
    </StyledPaper>
  );
};

export default VerboseLogs;
