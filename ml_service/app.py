from flask import Flask, request, jsonify
import os
from PIL import Image
import numpy as np

PORT = int(os.getenv("FLASK_PORT", 5002))
MODEL_PATH = os.getenv("MODEL_PATH", "models/fault_model.h5")

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "fault_cnn.keras")
LABELS = ["plumbing", "electrical", "carpentry", "other"]

app = Flask(__name__)

model = None
try:
    if os.path.exists(MODEL_PATH):
        from tensorflow.keras.models import load_model
        model = load_model(MODEL_PATH)
        print("✅ Loaded model from", MODEL_PATH)
    else:
        print("⚠️  Model not found; using heuristic fallback.")
except Exception as e:
    print("⚠️  Failed to load model:", e)

def preprocess(img: Image.Image):
    img = img.convert("RGB").resize((224, 224))
    arr = np.array(img) / 255.0
    return np.expand_dims(arr, axis=0)

def heuristic(filename: str):
    name = (filename or "").lower()
    if "pipe" in name or "tap" in name or "leak" in name: return "plumbing", 0.65
    if "wire" in name or "bulb" in name or "light" in name: return "electrical", 0.62
    if "wood" in name or "door" in name: return "carpentry", 0.55
    return "other", 0.5

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "image required"}), 400
    file = request.files["image"]
    category, conf = "other", 0.5

    try:
        if model:
            img = Image.open(file.stream)
            x = preprocess(img)
            preds = model.predict(x)
            idx = int(np.argmax(preds[0]))
            category = LABELS[idx] if idx < len(LABELS) else "other"
            conf = float(np.max(preds[0]))
        else:
            category, conf = heuristic(file.filename)
    except Exception as e:
        print("Prediction error:", e)
        category, conf = heuristic(file.filename)

    return jsonify({"category": category, "confidence": conf})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5002, debug=False)
