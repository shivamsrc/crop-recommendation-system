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
# try to load models if present
if os.path.exists(os.path.join(MODELS_DIR, "model_crop.joblib")):
    models['crop'] = joblib.load(os.path.join(MODELS_DIR, "model_crop.joblib"))
if os.path.exists(os.path.join(MODELS_DIR, "model_yield.joblib")):
    models['yield'] = joblib.load(os.path.join(MODELS_DIR, "model_yield.joblib"))

@app.route('/')
def home():
    return jsonify({"message": "Unified ML service running", "available": list(models.keys())})

# Crop recommendation (classification)
@app.route('/predict/crop', methods=['POST'])
def predict_crop():
    if 'crop' not in models:
        return jsonify({'error':'crop model not found. Train using train_crop.py'}), 500
    payload = request.get_json() or {}
    try:
        # expect keys: N,P,K,temperature,humidity,ph,rainfall
        features = [payload.get(k) for k in ('N','P','K','temperature','humidity','ph','rainfall')]
        if any(v is None for v in features):
            return jsonify({'error':'missing feature(s). required: N,P,K,temperature,humidity,ph,rainfall'}), 400
        X = np.array(features, dtype=float).reshape(1, -1)
        model = models['crop']['model']
        le = models['crop']['label_encoder']
        pred_idx = model.predict(X)[0]
        pred_label = le.inverse_transform([pred_idx])[0]
        return jsonify({'prediction': pred_label})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Yield prediction (regression)
@app.route('/predict/yield', methods=['POST'])
def predict_yield():
    if 'yield' not in models:
        return jsonify({'error':'yield model not found. Train using train_yield.py'}), 500
    payload = request.get_json() or {}
    try:
        model_info = models['yield']
        model = model_info['model']
        features_list = model_info.get('features')
        le_state = model_info.get('label_encoder_state')

        # Encode state if necessary
        if le_state and 'State' in payload:
            if payload['State'] not in le_state.classes_:
                return jsonify({'error': f"Unknown state '{payload['State']}'"}), 400
            payload['State_encoded'] = int(le_state.transform([payload['State']])[0])
            del payload['State']

        # Prepare features
        features = []
        for f in features_list:
            v = payload.get(f)
            if v is None:
                return jsonify({'error': f"missing feature '{f}'"}, 400)
            features.append(float(v))

        X = np.array(features).reshape(1, -1)
        pred = model.predict(X)[0]
        return jsonify({'prediction': float(pred)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # run on 5001 to avoid conflict with any frontend dev server
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5001)), debug=True)
