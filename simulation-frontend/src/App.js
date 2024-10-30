// src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import {
  Container, Grid, Paper, Typography, Button,
  AppBar, Toolbar, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { styled } from '@mui/system';

// Importing modular components
import ParameterForm from './components/ParameterForm';
import InfectionChart from './components/InfectionChart';
import VerboseLogs from './components/VerboseLogs';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const StyledFooter = styled('footer')(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2, 0),
  textAlign: 'center',
  backgroundColor: '#f5f5f5',
}));

function App() {
  // Initial default parameters for the simulation
  const [params, setParams] = useState({
    N: 1000,
    I: 10,
    m: 10,
    de: 3,
    di: 5,
    tpe: 0.01,
    tpi: 0.02,
    rp: 0.5,
    vp: 0.7,
    mp: 0.5,
    ap: 0.3,
    ip: 0.4,
    max: 100,
    seed: 42,
    verbose: false,
  });

  // Parameter descriptions for tooltips
  const paramDescriptions = {
    N: "Total number of agents in the simulation.",
    I: "Initial number of infected agents.",
    m: "Average number of interactions per agent per day.",
    de: "Duration (in days) of the exposed state.",
    di: "Duration (in days) of the infected state.",
    tpe: "Transmission probability during the exposed state.",
    tpi: "Transmission probability during the infected state.",
    rp: "Recovery probability after the infectious period.",
    vp: "Vaccination probability for agents.",
    mp: "Mask-wearing probability for agents.",
    ap: "Asymptomatic probability for infected agents.",
    ip: "Isolation probability for symptomatic agents.",
    max: "Maximum number of simulation days.",
    seed: "Random seed for reproducibility.",
    verbose: "Enable detailed logging of the simulation.",
  };

  // State to hold the infection curve data
  const [infectionCurve, setInfectionCurve] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  // State to hold simulation summary data
  const [summary, setSummary] = useState(null);

  // State to hold verbose logs
  const [verboseLogs, setVerboseLogs] = useState([]);

  // Functions to handle About dialog open/close
  const handleAboutOpen = () => {
    setAboutOpen(true);
  };

  const handleAboutClose = () => {
    setAboutOpen(false);
  };

  // Handle changes in the input fields
  const handleChange = (e, newValue) => {
    const { name, value, type, checked } = e.target || {};
    let updatedValue = newValue !== undefined ? newValue : type === 'checkbox' ? checked : value;

    // Parsing numerical values appropriately
    if (type === 'number') {
      updatedValue = parseFloat(updatedValue);
      if (isNaN(updatedValue)) {
        alert(`${name} must be a valid number.`);
        return;
      }
      if (updatedValue < 0) {
        alert(`${name} cannot be negative.`);
        return;
      }
    }

    setParams((prevParams) => ({
      ...prevParams,
      [name]: updatedValue,
    }));
  };

  // Function to run the simulation by calling the backend API
  const runSimulation = () => {
    setLoading(true);

    // Prepare the config object by ensuring 'verbose' is a boolean
    const config = { ...params, verbose: Boolean(params.verbose) };

    // Debugging: Log the config being sent
    console.log('Sending config to backend:', config);

    axios
      .post('http://localhost:5000/run_simulation', { config })
      .then((response) => {
        // Debugging: Log the full response
        console.log('Received response from backend:', response.data);

        const curve = response.data.infection_curve || [];
        setInfectionCurve(curve);

        // Handle verbose logs
        if (config.verbose) {
          setVerboseLogs(response.data.verbose_logs || []);
        } else {
          setVerboseLogs([]);
        }

        // Calculate summary metrics
        const peakInfections = curve.length > 0 ? Math.max(...curve) : 0;
        const dayOfPeak = curve.length > 0 ? curve.indexOf(peakInfections) : 0;
        const totalInfections = curve.reduce((sum, value) => sum + value, 0);
        const percentageInfected = config.max > 0 ? ((totalInfections / (config.N * config.max)) * 100).toFixed(2) : '0.00';

        setSummary({
          peakInfections,
          dayOfPeak,
          totalInfections,
          percentageInfected,
        });
      })
      .catch((error) => {
        console.error('There was an error running the simulation!', error);
        if (error.response && error.response.data && error.response.data.error) {
          alert(`Error: ${error.response.data.error}`);
        } else {
          alert('An error occurred while running the simulation. Please check your inputs.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {/* Header */}
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Disease Simulation App
          </Typography>
          <Button color="inherit" onClick={handleAboutOpen}>
            About
          </Button>
        </Toolbar>
      </StyledAppBar>

      {/* About Dialog */}
      <Dialog open={aboutOpen} onClose={handleAboutClose} maxWidth="sm" fullWidth>
        <DialogTitle>About This Simulation</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            This simulation models the spread of a disease through a population using adjustable parameters.
          </Typography>
          <Typography gutterBottom>
            You can modify variables such as the initial number of infected individuals, transmission probabilities, recovery rates, and more to observe their effects on the infection curve.
          </Typography>
          <Typography gutterBottom>
            The purpose of this simulation is to provide insight into how diseases spread and the impact of different factors on an outbreak.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAboutClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main Content */}
      <Container maxWidth="lg" style={{ marginTop: '40px', marginBottom: '40px' }}>
        <Grid container spacing={4}>
          {/* Simulation Parameters Form */}
          <Grid item xs={12} md={4}>
            <ParameterForm
              params={params}
              handleChange={handleChange}
              runSimulation={runSimulation}
              loading={loading}
              paramDescriptions={paramDescriptions}
            />
          </Grid>

          {/* Infection Curve Chart and Simulation Summary */}
          <Grid item xs={12} md={8}>
            {infectionCurve && infectionCurve.length > 0 && (
              <>
                <InfectionChart infectionCurve={infectionCurve} summary={summary} />
                <VerboseLogs verboseLogs={verboseLogs} />
              </>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <StyledFooter>
        <Typography variant="body2" color="textSecondary">
          Disease Simulation App &copy; 2024 Johnny Diaz
        </Typography>
      </StyledFooter>
    </>
  );
}

export default App;
