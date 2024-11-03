# Disease Simulation App

This project is a web-based application that simulates the spread of a disease through a population. It allows users to adjust various parameters to observe their effects on the infection curve over time.

## Features

- **Interactive Simulation**: Adjust parameters such as population size, initial infections, transmission probabilities, and more to see how they influence disease spread.
- **Visualization**: Real-time charts display the infection curve, highlighting key metrics like peak infections and total infections.
- **Detailed Logs**: Option to enable verbose logging for in-depth analysis of each simulation step.

## Technologies Used

- **Backend**: Python with Flask for the API and simulation logic.
- **Frontend**: React.js with Material-UI for the user interface.

## Getting Started

### Prerequisites

- **Backend**:
  - Python 3.x
  - Flask
  - Flask-CORS

- **Frontend**:
  - Node.js
  - npm (Node Package Manager)

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/cloudisity/Simulation.git
   ```

2. **Backend Setup**:

   ```bash
   cd Simulation/backend
   pip install -r requirements.txt
   ```

3. **Frontend Setup**:

   ```bash
   cd ../simulation-frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**:

   ```bash
   cd backend
   python api.py
   ```

   The backend server will run on `http://localhost:5000/`.

2. **Start the Frontend Development Server**:

   ```bash
   cd ../simulation-frontend
   npm start
   ```

   The frontend will typically be accessible at `http://localhost:3000/`.

## Project Structure

```plaintext
Simulation/
├── backend/
│   ├── api.py
│   ├── hw3.py
│   ├── simulation.py
│   ├── requirements.txt
│   └── ...
├── simulation-frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   │   ├── InfectionChart.js
│   │   │   ├── ParameterForm.js
│   │   │   ├── SliderOnly.js
│   │   │   ├── SliderWithInput.js
│   │   │   ├── VerboseLogs.js
│   │   │   └── ...
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── ...
├── LICENSE
└── README.md
```

## Usage

1. **Adjust Parameters**: Use the sliders and input fields to set simulation parameters such as population size, infection rates, and recovery probabilities.

2. **Run Simulation**: Click the "Run Simulation" button to execute the simulation with the specified parameters.

3. **View Results**: Observe the infection curve and review detailed logs if verbose mode is enabled.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or feedback, please open an issue in this repository.
