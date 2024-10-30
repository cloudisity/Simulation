from flask import Flask, request, jsonify
from flask_cors import CORS
import hw3  # Assuming hw3 contains the 'sim' function
import logging

# Set up logging configuration
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)

@app.route('/run_simulation', methods=['POST'])
def run_simulation():
    try:
        data = request.json
        config = data.get('config')
        if not config:
            return jsonify({'error': 'Configuration data not provided'}), 400

        # Log the configuration being received
        app.logger.info(f"Received configuration: {config}")

        # Run the simulation with the given configuration
        results, verbose_logs = hw3.sim(config)

        # Log the results before sending them
        app.logger.info(f"Simulation results: {results}")

        # Return the results and verbose logs
        return jsonify({'infection_curve': results, 'seir_data': [], 'verbose_logs': verbose_logs})
    except Exception as e:
        app.logger.error(f"Error running simulation: {str(e)}")
        return jsonify({'error': f"An unexpected error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
