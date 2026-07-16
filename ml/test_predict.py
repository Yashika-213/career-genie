"""Sanity checks for the trained model. Run: `python test_predict.py`."""
from predict import predict

CASES = [
    {
        "name": "AI-leaning profile",
        "payload": {
            "skills": ["Python", "Machine Learning", "Deep Learning", "NLP", "Statistics"],
            "interests": ["AI/ML", "Research"],
            "education": "Master's",
            "domain": "Artificial Intelligence",
        },
        "expected": "AI Engineer",
    },
    {
        "name": "Data analyst profile",
        "payload": {
            "skills": ["Excel", "SQL", "Data Visualization", "Statistics"],
            "interests": ["Data Analysis"],
            "education": "Bachelor's",
            "domain": "Data Analytics",
        },
        "expected": "Data Analyst",
    },
    {
        "name": "Frontend profile",
        "payload": {
            "skills": ["HTML/CSS", "JavaScript", "React"],
            "interests": ["Web Design", "Building Products"],
            "education": "Bachelor's",
            "domain": "Web Development",
        },
        "expected": "Frontend Developer",
    },
    {
        "name": "Backend profile",
        "payload": {
            "skills": ["Node.js", "SQL", "Docker", "Cloud"],
            "interests": ["Backend Systems", "Automation"],
            "education": "Bachelor's",
            "domain": "Software Development",
        },
        "expected": "Backend Developer",
    },
]


def main():
    passed = 0
    for case in CASES:
        result = predict(case["payload"])
        ok = result["career"] == case["expected"]
        passed += ok
        flag = "PASS" if ok else "WARN"
        print(f"[{flag}] {case['name']}: predicted={result['career']} "
              f"(conf={result['confidence']:.2f}) expected={case['expected']}")
    print("-" * 55)
    print(f"{passed}/{len(CASES)} cases matched the expected label.")


if __name__ == "__main__":
    main()
