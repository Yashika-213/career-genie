"""Train a Decision Tree classifier on the generated dataset and save it with joblib.

Bundle saved: model, feature_columns, classes, and the config vocabularies needed
by predict.py to build an aligned feature vector at inference time.
"""
import os
import json
import numpy as np
import pandas as pd
import joblib
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

from ml_config import (
    SKILL_VOCAB, INTEREST_VOCAB, DOMAIN_VOCAB, EDUCATION_ORDINAL,
    feature_columns,
)

HERE = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(HERE, "dataset.csv")
MODEL_DIR = os.path.join(HERE, "model")
MODEL_PATH = os.path.join(MODEL_DIR, "career_model.joblib")
# Lightweight exported tree used by predict.py for fast (sub-second) inference,
# so the Node bridge never pays sklearn's slow import cost at request time.
TREE_PATH = os.path.join(MODEL_DIR, "career_tree.json")


def build_features(df: pd.DataFrame) -> pd.DataFrame:
    """Turn the raw dataframe into the numeric feature matrix the model expects."""
    feat = pd.DataFrame()

    # Binary skill columns (already 0/1 in the CSV)
    for s in SKILL_VOCAB:
        feat[s] = df[s].astype(int)

    # Binary interest columns
    for it in INTEREST_VOCAB:
        feat[f"int_{it}"] = df[f"int_{it}"].astype(int)

    # Education as ordinal
    feat["education"] = df["education"].map(EDUCATION_ORDINAL).fillna(0).astype(int)

    # Domain one-hot
    for d in DOMAIN_VOCAB:
        feat[f"dom_{d}"] = (df["domain"] == d).astype(int)

    # Guarantee column order
    return feat[feature_columns()]


def main():
    if not os.path.exists(DATASET_PATH):
        raise SystemExit("dataset.csv not found — run `python generate_dataset.py` first.")

    df = pd.read_csv(DATASET_PATH)
    X = build_features(df)
    y = df["career"].astype(str)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = DecisionTreeClassifier(
        max_depth=12,
        min_samples_leaf=5,
        criterion="gini",
        random_state=42,
    )
    model.fit(X_train, y_train)

    train_acc = accuracy_score(y_train, model.predict(X_train))
    test_acc = accuracy_score(y_test, model.predict(X_test))

    print("=" * 60)
    print("CareerGenie — Decision Tree Career Recommender")
    print("=" * 60)
    print(f"Training samples : {len(X_train)}")
    print(f"Test samples     : {len(X_test)}")
    print(f"Features         : {X.shape[1]}")
    print(f"Train accuracy   : {train_acc:.3f}")
    print(f"Test accuracy    : {test_acc:.3f}")
    print("-" * 60)
    print(classification_report(y_test, model.predict(X_test), zero_division=0))

    os.makedirs(MODEL_DIR, exist_ok=True)

    # 1) Save the full scikit-learn model with joblib (source of truth / retraining).
    bundle = {
        "model": model,
        "feature_columns": feature_columns(),
        "classes": list(model.classes_),
        "skill_vocab": SKILL_VOCAB,
        "interest_vocab": INTEREST_VOCAB,
        "domain_vocab": DOMAIN_VOCAB,
        "education_ordinal": EDUCATION_ORDINAL,
    }
    joblib.dump(bundle, MODEL_PATH)

    # 2) Export the learned tree structure to JSON for fast inference.
    t = model.tree_
    tree_export = {
        "children_left": t.children_left.tolist(),
        "children_right": t.children_right.tolist(),
        "feature": t.feature.tolist(),
        "threshold": t.threshold.tolist(),
        # value[node] shape is (1, n_classes) -> flatten to class counts per node
        "value": [v[0].tolist() for v in t.value],
        "classes": list(model.classes_),
        "feature_columns": feature_columns(),
        "skill_vocab": SKILL_VOCAB,
        "interest_vocab": INTEREST_VOCAB,
        "domain_vocab": DOMAIN_VOCAB,
        "education_ordinal": EDUCATION_ORDINAL,
    }
    with open(TREE_PATH, "w", encoding="utf-8") as f:
        json.dump(tree_export, f)

    print("-" * 60)
    print(f"[careergenie-ml] sklearn model saved -> {MODEL_PATH}")
    print(f"[careergenie-ml] fast tree exported -> {TREE_PATH}")


if __name__ == "__main__":
    main()
