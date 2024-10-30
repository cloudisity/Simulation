import React, { useState } from 'react';
import { Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import {
  Container, Grid, Paper, Typography, TextField, Button,
  Checkbox, FormControlLabel, AppBar, Toolbar, CircularProgress,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
} from 'recharts';

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

  // State to manage loading state
  const [loading, setLoading] = useState(false);

  // State to manage About dialog
  const [aboutOpen, setAboutOpen] = useState(false);

  // Functions to handle About dialog open/close
  const handleAboutOpen = () => {
    setAboutOpen(true);
  };

  const handleAboutClose = () => {
    setAboutOpen(false);
  };

  // Handle changes in the input fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    // Simple validation example: Ensure numerical values are non-negative
    if (type === 'number' && newValue < 0) {
      alert(`${name} cannot be negative.`);
      return;
    }

    setParams((prevParams) => ({
      ...prevParams,
      [name]: newValue,
    }));
  };

  // Function to run the simulation by calling the backend API
  const runSimulation = () => {
    setLoading(true);

    // Prepare the config object by parsing parameter values to the correct data types
    const config = {};
    for (const key in params) {
      let value = params[key];
      if (typeof value === 'string' && value !== '') {
        if (value.includes(',')) {
          // Handle tuples (e.g., for subpopulations)
          value = value.split(',').map((v) => parseFloat(v.trim()));
        } else {
          value = parseFloat(value);
        }
      }
      config[key] = value;
    }

    axios
      .post('http://localhost:5000/run_simulation', { config })
      .then((response) => {
        setInfectionCurve(response.data.infection_curve);
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
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Disease Simulation App
          </Typography>
          <Button color="inherit" onClick={handleAboutOpen}>
            About
          </Button>
        </Toolbar>
      </AppBar>

      {/* About Dialog */}
      <Dialog open={aboutOpen} onClose={handleAboutClose}>
        <DialogTitle>About This Simulation</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            This simulation models the spread of a disease through a population using adjustable parameters.
          </Typography>
          <Typography gutterBottom>
            You can change variables such as the initial number of infected individuals, transmission probabilities, recovery rates, and more to see how they affect the infection curve.
          </Typography>
          <Typography gutterBottom>
            The purpose of this simulation is to provide insight into how diseases spread and the impact of different factors on an outbreak.
          </Typography>
          {/* Add more content as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAboutClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main Content */}
      <Container maxWidth="md" style={{ marginTop: '20px' }}>
        <Grid container spacing={2}>
          {/* Simulation Parameters Form */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h6" gutterBottom>
                Simulation Parameters
              </Typography>
              <Grid container spacing={2}>
                {Object.keys(params).map((key) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <Tooltip title={paramDescriptions[key] || ''} arrow>
                      {typeof params[key] === 'boolean' ? (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={params[key]}
                              onChange={handleChange}
                              name={key}
                            />
                          }
                          label={key}
                        />
                      ) : (
                        <TextField
                          label={key}
                          name={key}
                          value={params[key]}
                          onChange={handleChange}
                          type="number"
                          InputProps={{ inputProps: { step: 'any' } }}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      )}
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
              <Button
                variant="contained"
                color="primary"
                onClick={runSimulation}
                disabled={loading}
                startIcon={<PlayArrow />}
                style={{ marginTop: '20px' }}
                fullWidth
              >
                {loading ? 'Running Simulation...' : 'Run Simulation'}
              </Button>
              {loading && <CircularProgress style={{ marginTop: '10px' }} />}
            </Paper>
          </Grid>

          {/* Infection Curve Chart */}
          <Grid item xs={12} md={6}>
            {infectionCurve.length > 0 && (
              <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h6" gutterBottom>
                  Infection Curve
                </Typography>
                <LineChart
                  width={500}
                  height={300}
                  data={infectionCurve.map((value, index) => ({
                    day: index,
                    infections: value,
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="day"
                    label={{ value: 'Day', position: 'insideBottomRight', offset: -5 }}
                  />
                  <YAxis
                    label={{ value: 'Infections', angle: -90, position: 'insideLeft' }}
                  />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#f5f5f5', borderRadius: '10px' }}
                    itemStyle={{ color: '#1976d2' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="infections"
                    stroke="#1976d2"
                    activeDot={{ r: 8 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <footer style={{ marginTop: '20px', padding: '10px', textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          Disease Simulation App
        </Typography>
      </footer>
    </>
  );
}

export default App;
