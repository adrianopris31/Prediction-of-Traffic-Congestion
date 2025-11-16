from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    hour = data['hour']
    weather = data['weather']
    event = data['event']
    weekday = data['weekday']

    with open('model/london_data_normalized.pkl', 'rb') as f:
        model = pickle.load(f)

    input_data = np.array([[hour, weather, event, weekday]])

    prediction = model.predict(input_data)

    return jsonify({'prediction': prediction[0]})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)