import os

from dotenv import load_dotenv


load_dotenv()


MODEL_PATH = os.getenv(
    "MODEL_PATH",
    "model",
)

MODEL_VERSION = os.getenv(
    "MODEL_VERSION",
    "baseline-0.1.0",
)

PORT = int(
    os.getenv(
        "PORT",
        "8091",
    )
)