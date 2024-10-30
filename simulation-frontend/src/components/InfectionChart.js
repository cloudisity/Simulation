// src/components/InfectionChart.js

import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Divider
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#ffffff',
}));

const SimulationSummary = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  color: theme.palette.text.primary,
}));

const InfectionChart = ({ infectionCurve, summary }) => {
  if (!infectionCurve || infectionCurve.length === 0) return null;

  const peak = Math.max(...infectionCurve);
  const peakDay = infectionCurve.indexOf(peak);

  const chartData = infectionCurve.map((value, index) => ({
    day: index,
    infections: value,
  }));

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h5" gutterBottom>
        Infection Curve
      </Typography>
      <Divider />
      <Box mt={2}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              label={{ value: 'Day', position: 'insideBottomRight', offset: -10 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={['dataMin - 1', 'dataMax + 1']}
              label={{ value: 'Infections', angle: -90, position: 'insideLeft', offset: 10 }}
              tick={{ fontSize: 12 }}
            />
            <RechartsTooltip
              contentStyle={{ backgroundColor: '#f5f5f5', borderRadius: '10px' }}
              itemStyle={{ color: '#1976d2' }}
            />
            <Legend verticalAlign="top" height={36}/>
            <Line
              type="monotone"
              dataKey="infections"
              stroke="#1976d2"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              animationDuration={1500}
            />
            <ReferenceDot
              x={peakDay}
              y={peak}
              r={8}
              fill="#ff5252"
              stroke="none"
              label={{ value: 'Peak Infection', position: 'top', fill: '#ff5252', fontWeight: 'bold' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Simulation Summary */}
      <SimulationSummary variant="h6" gutterBottom>
        Simulation Summary
      </SimulationSummary>
      {summary && (
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          <li><strong>Peak Infections:</strong> {summary.peakInfections}</li>
          <li><strong>Day of Peak Infection:</strong> {summary.dayOfPeak}</li>
          <li><strong>Total Infections:</strong> {summary.totalInfections}</li>
          <li><strong>Percentage of Population Infected:</strong> {summary.percentageInfected}%</li>
        </ul>
      )}
    </StyledPaper>
  );
};

export default InfectionChart;
