import os
from dotenv import load_dotenv

load_dotenv()

MODEL_PATH = os.getenv(
    "MODEL_PATH",
    "model/care_attention_model.joblib",
)

MODEL_VERSION = os.getenv(
    "MODEL_VERSION",
    "care-attention-v1.0.0",
)

FEATURE_VERSION = os.getenv(
    "FEATURE_VERSION",
    "patient-health-v1",
)

EXPECTED_MODEL_CLASSES = (
    "HIGH_ATTENTION",
    "REVIEW",
    "ROUTINE",
)

PORT = int(
    os.getenv(
        "PORT",
        "8091",
    )
)