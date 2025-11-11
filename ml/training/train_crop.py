# train_crop.py
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, accuracy_score
import os

os.makedirs("models", exist_ok=True)
csv_path = "../datasets/Crop_recommendation.csv"

print("Loading:", csv_path)
df = pd.read_csv(csv_path)
df = df.dropna()

feature_cols = ['N','P','K','temperature','humidity','ph','rainfall']
X = df[feature_cols]
y = df['label']

le = LabelEncoder()
y_enc = le.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(X, y_enc, test_size=0.2, random_state=42, stratify=y_enc)

model = RandomForestClassifier(n_estimators=300, random_state=42)
model.fit(X_train, y_train)

pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, pred))
print(classification_report(y_test, pred, target_names=le.classes_))

joblib.dump({'model': model, 'label_encoder': le}, "../models/model_crop.joblib", compress=3, protocol=4)

print("Saved models/model_crop.joblib")
