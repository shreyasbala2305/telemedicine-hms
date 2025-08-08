import os

# Basic configurations
MODEL_PATH = os.getenv("MODEL_PATH", "model/triage_rules.json")
PORT = int(os.getenv("PORT", 5006))
