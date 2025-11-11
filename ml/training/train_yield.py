# train_yield.py
import pandas as pd
import joblib
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import LabelEncoder
from math import sqrt
import os

# Create models folder if it doesn't exist
os.makedirs("../models", exist_ok=True)

# Load dataset
csv_path = "../datasets/crop_yield.csv"
print("Loading:", csv_path)
df = pd.read_csv(csv_path)
df = df.dropna()

# Compute yield if possible
if 'Production' in df.columns and 'Area' in df.columns:
    df = df[df['Area'] > 0].copy()
    df['yield'] = df['Production'] / df['Area']

# Encode 'State' if available
le_state = None
if 'State' in df.columns:
    le_state = LabelEncoder()
    df['State_encoded'] = le_state.fit_transform(df['State'])
    print(f"Encoded {len(le_state.classes_)} states.")

# Encode 'Crop' if available
le_crop = None
if 'Crop' in df.columns:
    le_crop = LabelEncoder()
    df['Crop_encoded'] = le_crop.fit_transform(df['Crop'])
    print(f"Encoded {len(le_crop.classes_)} crops.")

# Choose numeric features (exclude irrelevant or target columns)
numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
feature_cols = [
    c for c in numeric_cols 
    if c not in ('yield', 'Yield', 'Production', 'Crop_Year')
]
print("Using features:", feature_cols)

# Prepare data
X = df[feature_cols]
y = df['yield']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train smaller RandomForest model for Render memory
model = RandomForestRegressor(
    n_estimators=50,  # smaller model
    max_depth=10,
    random_state=42
)
model.fit(X_train, y_train)

# Evaluate
pred = model.predict(X_test)
rmse = sqrt(mean_squared_error(y_test, pred))
print("RMSE:", rmse)

# Save model, features, and encoders
joblib.dump({
    'model': model,
    'features': feature_cols,
    'label_encoder_state': le_state,
    'label_encoder_crop': le_crop  # <-- Add this line
}, "../models/model_yield.joblib", compress=3, protocol=4)

print("✅ Saved ../models/model_yield.joblib")
