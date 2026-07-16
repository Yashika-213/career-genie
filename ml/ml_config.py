"""Shared configuration for CareerGenie ML: vocabularies, career profiles and encoders.

Kept in one place so generate_dataset.py, train.py and predict.py always agree on
feature ordering and label names.
"""

# --- Feature vocabularies (order matters; it defines the feature columns) ---
SKILL_VOCAB = [
    "python", "sql", "javascript", "html_css", "react", "nodejs",
    "statistics", "machine_learning", "deep_learning", "nlp",
    "data_visualization", "excel", "cloud", "docker", "git",
]

INTEREST_VOCAB = [
    "ai_ml", "data_analysis", "web_design", "backend_systems",
    "building_products", "research", "automation",
]

EDUCATION_LEVELS = ["High School", "Diploma", "Bachelor's", "Master's", "PhD"]
EDUCATION_ORDINAL = {name: i for i, name in enumerate(EDUCATION_LEVELS)}

DOMAIN_VOCAB = [
    "Artificial Intelligence", "Data Science", "Data Analytics",
    "Web Development", "Software Development",
]

# Career labels — must match the DB career titles exactly.
CAREERS = [
    "AI Engineer", "Data Scientist", "Data Analyst", "Web Developer",
    "Frontend Developer", "Backend Developer", "Full Stack Developer",
]

# --- Per-career generative profiles ---
# core_skills / core_interests appear with high probability; everything else is noise.
CAREER_PROFILES = {
    "AI Engineer": {
        "core_skills": ["python", "machine_learning", "deep_learning", "nlp", "statistics", "git"],
        "core_interests": ["ai_ml", "research"],
        "domain": "Artificial Intelligence",
        "edu_weights": [0, 1, 4, 6, 3],  # leans higher education
    },
    "Data Scientist": {
        "core_skills": ["python", "statistics", "machine_learning", "sql", "data_visualization"],
        "core_interests": ["ai_ml", "data_analysis", "research"],
        "domain": "Data Science",
        "edu_weights": [0, 1, 5, 6, 2],
    },
    "Data Analyst": {
        "core_skills": ["excel", "sql", "statistics", "data_visualization", "python"],
        "core_interests": ["data_analysis"],
        "domain": "Data Analytics",
        "edu_weights": [1, 3, 6, 3, 0],
    },
    "Web Developer": {
        "core_skills": ["html_css", "javascript", "react", "nodejs", "git"],
        "core_interests": ["web_design", "building_products"],
        "domain": "Web Development",
        "edu_weights": [2, 4, 6, 2, 0],
    },
    "Frontend Developer": {
        "core_skills": ["html_css", "javascript", "react", "git"],
        "core_interests": ["web_design", "building_products"],
        "domain": "Web Development",
        "edu_weights": [2, 4, 6, 2, 0],
        "rare_skills": ["docker", "cloud"],  # frontend rarely lists these
    },
    "Backend Developer": {
        "core_skills": ["nodejs", "python", "sql", "docker", "cloud", "git"],
        "core_interests": ["backend_systems", "automation"],
        "domain": "Software Development",
        "edu_weights": [1, 3, 6, 3, 1],
        "rare_skills": ["html_css", "react"],
    },
    "Full Stack Developer": {
        "core_skills": ["html_css", "javascript", "react", "nodejs", "sql", "docker", "git"],
        "core_interests": ["web_design", "backend_systems", "building_products"],
        "domain": "Web Development",
        "edu_weights": [1, 4, 6, 3, 0],
    },
}

# --- Aliases: map user-facing labels (from the frontend form) to vocab keys ---
SKILL_ALIASES = {
    "python": "python",
    "sql": "sql", "mysql": "sql", "postgresql": "sql", "database": "sql", "databases": "sql",
    "javascript": "javascript", "js": "javascript",
    "html/css": "html_css", "html": "html_css", "css": "html_css", "html_css": "html_css",
    "react": "react", "reactjs": "react",
    "node.js": "nodejs", "node": "nodejs", "nodejs": "nodejs", "express": "nodejs",
    "statistics": "statistics", "stats": "statistics", "probability": "statistics",
    "machine learning": "machine_learning", "ml": "machine_learning", "machine_learning": "machine_learning",
    "deep learning": "deep_learning", "dl": "deep_learning", "neural networks": "deep_learning",
    "nlp": "nlp", "natural language processing": "nlp",
    "data visualization": "data_visualization", "data viz": "data_visualization",
    "tableau": "data_visualization", "power bi": "data_visualization",
    "excel": "excel", "spreadsheets": "excel",
    "cloud": "cloud", "aws": "cloud", "azure": "cloud", "gcp": "cloud",
    "docker": "docker", "kubernetes": "docker", "containers": "docker",
    "git": "git", "github": "git", "version control": "git",
}

INTEREST_ALIASES = {
    "ai/ml": "ai_ml", "ai": "ai_ml", "ml": "ai_ml", "artificial intelligence": "ai_ml", "ai_ml": "ai_ml",
    "data analysis": "data_analysis", "analytics": "data_analysis", "data_analysis": "data_analysis",
    "web design": "web_design", "web_design": "web_design", "ui/ux": "web_design", "design": "web_design",
    "backend systems": "backend_systems", "backend_systems": "backend_systems", "backend": "backend_systems",
    "building products": "building_products", "building_products": "building_products", "products": "building_products",
    "research": "research",
    "automation": "automation", "devops": "automation",
}


def feature_columns():
    """Full ordered list of feature column names used by the model."""
    cols = list(SKILL_VOCAB) + [f"int_{i}" for i in INTEREST_VOCAB]
    cols.append("education")
    cols += [f"dom_{d}" for d in DOMAIN_VOCAB]
    return cols
