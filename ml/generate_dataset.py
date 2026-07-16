"""Generate a realistic synthetic dataset mapping (skills, interests, education,
domain) -> recommended career. Deterministic (seeded) so results are reproducible.
"""
import csv
import os
import numpy as np

from ml_config import (
    SKILL_VOCAB, INTEREST_VOCAB, DOMAIN_VOCAB, EDUCATION_LEVELS,
    CAREERS, CAREER_PROFILES,
)

RNG = np.random.default_rng(42)
ROWS_PER_CAREER = 300
HERE = os.path.dirname(os.path.abspath(__file__))
OUT_PATH = os.path.join(HERE, "dataset.csv")

# Probabilities
P_CORE = 0.85        # a core skill/interest is present
P_NOISE = 0.12       # a non-core skill is present (noise)
P_RARE = 0.03        # a "rare" skill for this career
P_DOMAIN_MATCH = 0.80  # chosen domain matches the career's primary domain


def sample_row(career: str):
    profile = CAREER_PROFILES[career]
    core_skills = set(profile["core_skills"])
    rare_skills = set(profile.get("rare_skills", []))
    core_interests = set(profile["core_interests"])

    # Skills
    skill_flags = []
    for s in SKILL_VOCAB:
        if s in core_skills:
            p = P_CORE
        elif s in rare_skills:
            p = P_RARE
        else:
            p = P_NOISE
        skill_flags.append(int(RNG.random() < p))

    # Interests
    interest_flags = []
    for it in INTEREST_VOCAB:
        p = P_CORE if it in core_interests else P_NOISE
        interest_flags.append(int(RNG.random() < p))

    # Education (weighted per career)
    weights = np.array(profile["edu_weights"], dtype=float)
    weights = weights / weights.sum()
    education = RNG.choice(EDUCATION_LEVELS, p=weights)

    # Domain
    if RNG.random() < P_DOMAIN_MATCH:
        domain = profile["domain"]
    else:
        domain = RNG.choice(DOMAIN_VOCAB)

    return skill_flags, interest_flags, education, domain


def main():
    header = list(SKILL_VOCAB) + [f"int_{i}" for i in INTEREST_VOCAB] + ["education", "domain", "career"]
    rows = []
    for career in CAREERS:
        for _ in range(ROWS_PER_CAREER):
            skills, interests, education, domain = sample_row(career)
            rows.append(skills + interests + [education, domain, career])

    # Shuffle
    idx = RNG.permutation(len(rows))
    rows = [rows[i] for i in idx]

    with open(OUT_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(rows)

    print(f"[careergenie-ml] wrote {len(rows)} rows x {len(header)} cols -> {OUT_PATH}")


if __name__ == "__main__":
    main()
