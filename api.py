from flask import Flask, request, jsonify
from hw3 import sim  # Import your simulation function
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/run_simulation', methods=['POST'])
def run_simulation():
    data = request.get_json()
    config = data.get('config', {})
    # Run the simulation with the provided config
    infection_curve = sim(config)
    # Return the results as JSON
    return jsonify({'infection_curve': infection_curve})

if __name__ == '__main__':
    app.run(debug=True)
