# app.py
from flask import Flask, request, jsonify
import joblib
import numpy as np
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

MODELS_DIR = "models"
models = {}

# Load models if they exist
if os.path.exists(os.path.join(MODELS_DIR, "model_crop.joblib")):
    models['crop'] = joblib.load(os.path.join(MODELS_DIR, "model_crop.joblib"))
if os.path.exists(os.path.join(MODELS_DIR, "model_yield.joblib")):
    models['yield'] = joblib.load(os.path.join(MODELS_DIR, "model_yield.joblib"))

@app.route('/')
def home():
    return jsonify({
        "message": "Unified ML service running successfully ✅",
        "available_models": list(models.keys())
    })

# ────────────── Crop Prediction ──────────────
@app.route('/predict/crop', methods=['POST'])
def predict_crop():
    if 'crop' not in models:
        return jsonify({'error': 'crop model not found. Train using train_crop.py'}), 500

    payload = request.get_json() or {}
    try:
        # expected features
        required_features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        features = [payload.get(f) for f in required_features]
        if any(v is None for v in features):
            return jsonify({'error': f'Missing feature(s). Required: {", ".join(required_features)}'}), 400

        X = np.array(features, dtype=float).reshape(1, -1)
        model = models['crop']['model']
        le = models['crop']['label_encoder']

        pred_idx = model.predict(X)[0]
        pred_label = le.inverse_transform([pred_idx])[0]
        return jsonify({'prediction': pred_label})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ────────────── Yield Prediction ──────────────
@app.route('/predict/yield', methods=['POST'])
def predict_yield():
    if 'yield' not in models:
        return jsonify({'error': 'yield model not found. Train using train_yield.py'}), 500

    payload = request.get_json() or {}

    try:
        model_info = models['yield']
        model = model_info['model']
        features_list = model_info['features']
        le_state = model_info.get('label_encoder_state')
        le_crop = model_info.get('label_encoder_crop')

        # Create a copy of payload to safely add encoded features
        input_data = payload.copy()

        # Encode categorical features
        if le_crop and 'Crop' in payload:
            if payload['Crop'] not in le_crop.classes_:
                return jsonify({'error': f"Unknown crop '{payload['Crop']}'"}), 400
            input_data['Crop_encoded'] = int(le_crop.transform([payload['Crop']])[0])

        if le_state and 'State' in payload:
            if payload['State'] not in le_state.classes_:
                return jsonify({'error': f"Unknown state '{payload['State']}'"}), 400
            input_data['State_encoded'] = int(le_state.transform([payload['State']])[0])

        # Prepare feature vector in exact order
        X = []
        for f in features_list:
            if f not in input_data:
                return jsonify({'error': f"Missing feature '{f}'"}), 400
            X.append(float(input_data[f]))

        X = np.array(X).reshape(1, -1)
        pred = model.predict(X)[0]

        return jsonify({'prediction': round(float(pred), 2)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5001)), debug=True)
