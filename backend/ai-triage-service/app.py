from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
import json
from config import MODEL_PATH, PORT

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Load triage rules from JSON model
with open(MODEL_PATH) as f:
    TRIAGE_RULES = json.load(f)

@app.route('/predict', methods=['POST'])
def predict_specialist():
    data = request.get_json()
    symptoms = data.get("symptoms", [])

    for rule in TRIAGE_RULES:
        if any(symptom in rule["symptoms"] for symptom in symptoms):
            return jsonify({"specialist": rule["specialist"]})

    return jsonify({"specialist": "General Physician"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT)
