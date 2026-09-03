"""
Train the care-attention classification model.

This training pipeline uses the versioned patient-health-v1 feature
contract shared with the inference service.

The resulting model is a development/portfolio artifact trained on
synthetic data. It is NOT a clinically validated model.
"""

from pathlib import Path

import joblib
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)
from sklearn.model_selection import train_test_split

from app.utils.feature_schema import (
    FEATURE_NAMES,
    FEATURE_VERSION,
)


RANDOM_SEED = 42

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = (
    BASE_DIR
    / "training"
    / "data"
    / "patient_health_training.csv"
)

MODEL_DIR = BASE_DIR / "model"
MODEL_FILE = MODEL_DIR / "care_attention_model.joblib"


def load_dataset() -> pd.DataFrame:
    if not DATA_FILE.exists():
        raise FileNotFoundError(
            f"Training dataset not found: {DATA_FILE}"
        )

    dataset = pd.read_csv(DATA_FILE)

    required_columns = [
        *FEATURE_NAMES,
        "target",
    ]

    missing_columns = [
        column
        for column in required_columns
        if column not in dataset.columns
    ]

    if missing_columns:
        raise ValueError(
            "Training dataset is missing required columns: "
            f"{missing_columns}"
        )

    return dataset


def train_model(
    dataset: pd.DataFrame,
) -> tuple[
    RandomForestClassifier,
    pd.DataFrame,
    pd.Series,
]:
    X = dataset[list(FEATURE_NAMES)]
    y = dataset["target"]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=RANDOM_SEED,
        stratify=y,
    )

    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=10,
        min_samples_leaf=3,
        class_weight="balanced",
        random_state=RANDOM_SEED,
        n_jobs=-1,
    )

    model.fit(
        X_train,
        y_train,
    )

    return model, X_test, y_test


def evaluate_model(
    model: RandomForestClassifier,
    X_test: pd.DataFrame,
    y_test: pd.Series,
) -> None:
    predictions = model.predict(X_test)

    accuracy = accuracy_score(
        y_test,
        predictions,
    )

    print()
    print("=" * 70)
    print("MODEL EVALUATION")
    print("=" * 70)

    print()
    print(f"Accuracy: {accuracy:.4f}")

    print()
    print("Classification Report:")
    print(
        classification_report(
            y_test,
            predictions,
            digits=4,
        )
    )

    print("Confusion Matrix:")
    print(
        confusion_matrix(
            y_test,
            predictions,
        )
    )

    print()
    print("Feature Importance:")
    print("-" * 70)

    importance = pd.Series(
        model.feature_importances_,
        index=FEATURE_NAMES,
    ).sort_values(
        ascending=False,
    )

    for feature, value in importance.items():
        print(
            f"{feature:<40} {value:.4f}"
        )


def save_model(
    model: RandomForestClassifier,
) -> None:
    MODEL_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    artifact = {
        "model": model,
        "model_version": "care-attention-v1.0.0",
        "feature_version": FEATURE_VERSION,
        "feature_names": list(FEATURE_NAMES),
        "classes": list(model.classes_),
        "training_data": "synthetic-development-data",
        "random_seed": RANDOM_SEED,
    }

    joblib.dump(
        artifact,
        MODEL_FILE,
    )

    print()
    print("=" * 70)
    print("MODEL SAVED")
    print("=" * 70)
    print(f"Path: {MODEL_FILE}")
    print(f"Model version: care-attention-v1.0.0")
    print(f"Feature version: {FEATURE_VERSION}")
    print(f"Classes: {list(model.classes_)}")


def main() -> None:
    print("=" * 70)
    print("HMS CARE ATTENTION MODEL TRAINING")
    print("=" * 70)

    dataset = load_dataset()

    print()
    print(f"Dataset: {DATA_FILE}")
    print(f"Records: {len(dataset)}")
    print(f"Features: {len(FEATURE_NAMES)}")

    model, X_test, y_test = train_model(
        dataset,
    )

    evaluate_model(
        model,
        X_test,
        y_test,
    )

    save_model(
        model,
    )


if __name__ == "__main__":
    main()