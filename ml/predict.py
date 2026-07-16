"""Fast inference bridge for the Node backend.

Uses the exported decision-tree structure (model/career_tree.json) and performs a
pure-Python tree traversal, so it does NOT import scikit-learn/numpy at request
time (sklearn's import alone is several seconds). Startup is sub-second.

Reads a JSON object from stdin:
    { "skills": [...], "interests": [...], "education": "Master's", "domain": "..." }
Writes a JSON object to stdout:
    { "career": "AI Engineer", "confidence": 0.87, "probabilities": {...} }

On error, prints {"error": "..."} to stdout and exits with code 1.
"""
import sys
import os
import json

from ml_config import SKILL_ALIASES, INTEREST_ALIASES

HERE = os.path.dirname(os.path.abspath(__file__))
TREE_PATH = os.path.join(HERE, "model", "career_tree.json")

_tree = None


def load_tree():
    global _tree
    if _tree is None:
        if not os.path.exists(TREE_PATH):
            raise FileNotFoundError("Model not found. Run `python train.py` first.")
        with open(TREE_PATH, "r", encoding="utf-8") as f:
            _tree = json.load(f)
    return _tree


def normalize(values, alias_map):
    out = set()
    for v in values or []:
        key = str(v).strip().lower()
        if key in alias_map:
            out.add(alias_map[key])
    return out


def build_vector(payload, tree):
    skills = normalize(payload.get("skills", []), SKILL_ALIASES)
    interests = normalize(payload.get("interests", []), INTEREST_ALIASES)
    education = str(payload.get("education", "")).strip()
    domain = str(payload.get("domain", "")).strip()

    row = {}
    for s in tree["skill_vocab"]:
        row[s] = 1 if s in skills else 0
    for it in tree["interest_vocab"]:
        row[f"int_{it}"] = 1 if it in interests else 0
    row["education"] = tree["education_ordinal"].get(education, 0)
    for d in tree["domain_vocab"]:
        row[f"dom_{d}"] = 1 if domain == d else 0

    return [row[c] for c in tree["feature_columns"]]


def traverse(tree, x):
    """Walk the decision tree to a leaf, mirroring sklearn's threshold rule (<=)."""
    left = tree["children_left"]
    right = tree["children_right"]
    feature = tree["feature"]
    threshold = tree["threshold"]
    node = 0
    # A leaf has children_left[node] == -1 (sklearn TREE_LEAF).
    while left[node] != -1:
        if x[feature[node]] <= threshold[node]:
            node = left[node]
        else:
            node = right[node]
    return tree["value"][node]  # class counts at the leaf


def predict(payload):
    tree = load_tree()
    x = build_vector(payload, tree)
    counts = traverse(tree, x)
    total = float(sum(counts)) or 1.0
    classes = tree["classes"]
    probs = [c / total for c in counts]
    best_idx = max(range(len(probs)), key=lambda i: probs[i])
    return {
        "career": classes[best_idx],
        "confidence": round(probs[best_idx], 4),
        "probabilities": {classes[i]: round(probs[i], 4) for i in range(len(classes))},
    }


def main():
    try:
        raw = sys.stdin.read()
        payload = json.loads(raw) if raw.strip() else {}
        result = predict(payload)
        sys.stdout.write(json.dumps(result))
    except Exception as exc:  # noqa: BLE001 - surface any failure to Node as JSON
        sys.stdout.write(json.dumps({"error": str(exc)}))
        sys.exit(1)


if __name__ == "__main__":
    main()
