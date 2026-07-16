// Seed data for CareerGenie. Full roadmaps, resources and project ideas per career.

export interface SeedResource {
  type: 'doc' | 'video' | 'practice';
  title: string;
  url: string;
  is_free?: boolean;
}
export interface SeedSkill {
  name: string;
  description: string;
  hours: number;
  category: 'Foundation' | 'Core' | 'Advanced' | 'Tools';
  resources: SeedResource[];
}
export interface SeedProject {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}
export interface SeedCareer {
  slug: string;
  title: string;
  description: string;
  avg_salary: string;
  demand_level: 'Medium' | 'High' | 'Very High';
  icon: string;
  skills: SeedSkill[];
  projects: SeedProject[];
}

// Compact resource helper
const r = (
  type: SeedResource['type'],
  title: string,
  url: string,
  is_free = true,
): SeedResource => ({ type, title, url, is_free });

// Reusable resource bundles for skills shared across careers
const RES = {
  python: [
    r('doc', 'Official Python Tutorial', 'https://docs.python.org/3/tutorial/'),
    r('video', 'Python Full Course — freeCodeCamp', 'https://www.youtube.com/watch?v=rfscVS0vtbw'),
    r('practice', 'HackerRank Python', 'https://www.hackerrank.com/domains/python'),
  ],
  git: [
    r('doc', 'Pro Git Book', 'https://git-scm.com/book/en/v2'),
    r('video', 'Git & GitHub Crash Course', 'https://www.youtube.com/watch?v=RGOj5yH7evk'),
    r('practice', 'Learn Git Branching', 'https://learngitbranching.js.org/'),
  ],
  numpy: [
    r('doc', 'NumPy Absolute Basics', 'https://numpy.org/doc/stable/user/absolute_beginners.html'),
    r('video', 'NumPy Tutorial — freeCodeCamp', 'https://www.youtube.com/watch?v=QUT1VHiLmmI'),
    r('practice', 'Kaggle: Python & NumPy', 'https://www.kaggle.com/learn/python'),
  ],
  pandas: [
    r('doc', '10 Minutes to pandas', 'https://pandas.pydata.org/docs/user_guide/10min.html'),
    r('video', 'Pandas Tutorial — Corey Schafer', 'https://www.youtube.com/watch?v=ZyhVh-qRZPA'),
    r('practice', 'Kaggle: Pandas Course', 'https://www.kaggle.com/learn/pandas'),
  ],
  statistics: [
    r('doc', 'Seeing Theory (Visual Stats)', 'https://seeing-theory.brown.edu/'),
    r('video', 'Statistics — StatQuest', 'https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9'),
    r('practice', 'Khan Academy Statistics', 'https://www.khanacademy.org/math/statistics-probability'),
  ],
  ml: [
    r('doc', 'scikit-learn User Guide', 'https://scikit-learn.org/stable/user_guide.html'),
    r('video', 'Machine Learning — Andrew Ng', 'https://www.youtube.com/playlist?list=PLkDaE6sCZn6FNC6YRfRQc_FbeQrF8BwGI'),
    r('practice', 'Kaggle: Intro to ML', 'https://www.kaggle.com/learn/intro-to-machine-learning'),
  ],
  sql: [
    r('doc', 'PostgreSQL Tutorial', 'https://www.postgresqltutorial.com/'),
    r('video', 'SQL Full Course — freeCodeCamp', 'https://www.youtube.com/watch?v=HXV3zeQKqGY'),
    r('practice', 'SQLZoo', 'https://sqlzoo.net/'),
  ],
  html: [
    r('doc', 'MDN: HTML Basics', 'https://developer.mozilla.org/en-US/docs/Learn/HTML'),
    r('video', 'HTML Crash Course', 'https://www.youtube.com/watch?v=UB1O30fR-EE'),
    r('practice', 'freeCodeCamp Responsive Web', 'https://www.freecodecamp.org/learn/2022/responsive-web-design/'),
  ],
  css: [
    r('doc', 'MDN: CSS', 'https://developer.mozilla.org/en-US/docs/Learn/CSS'),
    r('video', 'CSS Crash Course', 'https://www.youtube.com/watch?v=yfoY53QXEnI'),
    r('practice', 'CSS Diner (Selectors)', 'https://flukeout.github.io/'),
  ],
  javascript: [
    r('doc', 'MDN: JavaScript Guide', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide'),
    r('video', 'JavaScript Full Course', 'https://www.youtube.com/watch?v=PkZNo7MFNFg'),
    r('practice', 'JavaScript30', 'https://javascript30.com/'),
  ],
  react: [
    r('doc', 'React Official Docs', 'https://react.dev/learn'),
    r('video', 'React Course — freeCodeCamp', 'https://www.youtube.com/watch?v=bMknfKXIFA8'),
    r('practice', 'Frontend Mentor Challenges', 'https://www.frontendmentor.io/challenges'),
  ],
  node: [
    r('doc', 'Node.js Guides', 'https://nodejs.org/en/learn'),
    r('video', 'Node.js & Express Course', 'https://www.youtube.com/watch?v=Oe421EPjeBE'),
    r('practice', 'The Odin Project: NodeJS', 'https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs'),
  ],
};

export const CAREERS: SeedCareer[] = [
  {
    slug: 'ai-engineer',
    title: 'AI Engineer',
    description:
      'Designs and ships intelligent systems — from ML models to LLM-powered applications using RAG, transformers and modern AI tooling.',
    avg_salary: '₹12–28 LPA',
    demand_level: 'Very High',
    icon: '🤖',
    skills: [
      { name: 'Python', description: 'Core language for all AI/ML work.', hours: 40, category: 'Foundation', resources: RES.python },
      { name: 'Git & GitHub', description: 'Version control and collaboration.', hours: 15, category: 'Tools', resources: RES.git },
      { name: 'NumPy', description: 'Numerical computing with n-dim arrays.', hours: 20, category: 'Foundation', resources: RES.numpy },
      { name: 'Pandas', description: 'Data manipulation and analysis.', hours: 25, category: 'Foundation', resources: RES.pandas },
      { name: 'Statistics', description: 'Probability & inference for ML.', hours: 30, category: 'Foundation', resources: RES.statistics },
      { name: 'Machine Learning', description: 'Supervised & unsupervised algorithms.', hours: 50, category: 'Core', resources: RES.ml },
      {
        name: 'Deep Learning', description: 'Neural networks with PyTorch/TensorFlow.', hours: 55, category: 'Core',
        resources: [
          r('doc', 'PyTorch Tutorials', 'https://pytorch.org/tutorials/'),
          r('video', 'Deep Learning — 3Blue1Brown', 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi'),
          r('practice', 'Kaggle: Intro to Deep Learning', 'https://www.kaggle.com/learn/intro-to-deep-learning'),
        ],
      },
      {
        name: 'NLP', description: 'Processing and understanding text.', hours: 40, category: 'Advanced',
        resources: [
          r('doc', 'Hugging Face NLP Course', 'https://huggingface.co/learn/nlp-course'),
          r('video', 'NLP Playlist — StatQuest', 'https://www.youtube.com/playlist?list=PLblh5JKOoLUIxGDQs4LFFD--41Vzf-ME1'),
          r('practice', 'Kaggle: NLP', 'https://www.kaggle.com/learn/natural-language-processing'),
        ],
      },
      {
        name: 'Transformers', description: 'Attention-based architectures behind LLMs.', hours: 35, category: 'Advanced',
        resources: [
          r('doc', 'The Illustrated Transformer', 'https://jalammar.github.io/illustrated-transformer/'),
          r('video', 'Transformers Explained', 'https://www.youtube.com/watch?v=zxQyTK8quyY'),
          r('practice', 'Hugging Face Transformers Docs', 'https://huggingface.co/docs/transformers/index'),
        ],
      },
      {
        name: 'LangChain', description: 'Framework for building LLM apps.', hours: 25, category: 'Advanced',
        resources: [
          r('doc', 'LangChain Docs', 'https://python.langchain.com/docs/introduction/'),
          r('video', 'LangChain Crash Course', 'https://www.youtube.com/watch?v=lG7Uxts9SXs'),
          r('practice', 'LangChain Tutorials', 'https://python.langchain.com/docs/tutorials/'),
        ],
      },
      {
        name: 'RAG', description: 'Retrieval-Augmented Generation systems.', hours: 25, category: 'Advanced',
        resources: [
          r('doc', 'RAG Explained (Pinecone)', 'https://www.pinecone.io/learn/retrieval-augmented-generation/'),
          r('video', 'Build a RAG App', 'https://www.youtube.com/watch?v=tcqEUSNCn8I'),
          r('practice', 'LlamaIndex RAG Tutorial', 'https://docs.llamaindex.ai/en/stable/understanding/'),
        ],
      },
      {
        name: 'LLMs', description: 'Working with & fine-tuning large models.', hours: 40, category: 'Advanced',
        resources: [
          r('doc', 'Anthropic Claude Docs', 'https://docs.anthropic.com/'),
          r('video', 'Intro to LLMs — Karpathy', 'https://www.youtube.com/watch?v=zjkBMFhNj_g'),
          r('practice', 'Hugging Face Models Hub', 'https://huggingface.co/models'),
        ],
      },
    ],
    projects: [
      { title: 'House Price Prediction', description: 'Regression model predicting home prices from features.', difficulty: 'Beginner' },
      { title: 'Spam Detection', description: 'Text classifier to flag spam messages with NLP.', difficulty: 'Beginner' },
      { title: 'Face Recognition', description: 'CNN-based face identification system.', difficulty: 'Intermediate' },
      { title: 'Movie Recommendation Engine', description: 'Collaborative-filtering recommender.', difficulty: 'Intermediate' },
      { title: 'RAG Chatbot over PDFs', description: 'Ask questions across your documents using embeddings + an LLM.', difficulty: 'Advanced' },
    ],
  },
  {
    slug: 'data-scientist',
    title: 'Data Scientist',
    description:
      'Turns raw data into insight and predictive models — combining statistics, machine learning and strong data storytelling.',
    avg_salary: '₹10–24 LPA',
    demand_level: 'Very High',
    icon: '📊',
    skills: [
      { name: 'Python', description: 'Primary language for data science.', hours: 40, category: 'Foundation', resources: RES.python },
      { name: 'Statistics & Probability', description: 'Foundations for inference & modeling.', hours: 35, category: 'Foundation', resources: RES.statistics },
      { name: 'Pandas', description: 'Data wrangling and analysis.', hours: 25, category: 'Foundation', resources: RES.pandas },
      {
        name: 'Data Visualization', description: 'Communicating findings with charts.', hours: 20, category: 'Core',
        resources: [
          r('doc', 'Matplotlib Tutorials', 'https://matplotlib.org/stable/tutorials/index.html'),
          r('video', 'Data Visualization in Python', 'https://www.youtube.com/watch?v=DAQNHzOcO5A'),
          r('practice', 'Kaggle: Data Visualization', 'https://www.kaggle.com/learn/data-visualization'),
        ],
      },
      { name: 'SQL', description: 'Querying relational databases.', hours: 25, category: 'Core', resources: RES.sql },
      { name: 'Machine Learning', description: 'Predictive modeling algorithms.', hours: 50, category: 'Core', resources: RES.ml },
      {
        name: 'Feature Engineering', description: 'Creating strong model inputs.', hours: 25, category: 'Advanced',
        resources: [
          r('doc', 'Feature Engineering Guide', 'https://www.feature-engine.trainindata.com/en/latest/'),
          r('video', 'Feature Engineering Techniques', 'https://www.youtube.com/watch?v=6WDFfaYtN6s'),
          r('practice', 'Kaggle: Feature Engineering', 'https://www.kaggle.com/learn/feature-engineering'),
        ],
      },
      {
        name: 'Model Evaluation', description: 'Metrics, cross-validation, tuning.', hours: 20, category: 'Advanced',
        resources: [
          r('doc', 'sklearn Model Evaluation', 'https://scikit-learn.org/stable/modules/model_evaluation.html'),
          r('video', 'ROC & AUC — StatQuest', 'https://www.youtube.com/watch?v=4jRBRDbJemM'),
          r('practice', 'Kaggle: ML Explainability', 'https://www.kaggle.com/learn/machine-learning-explainability'),
        ],
      },
      {
        name: 'Big Data (Spark)', description: 'Processing data at scale.', hours: 30, category: 'Advanced',
        resources: [
          r('doc', 'PySpark Docs', 'https://spark.apache.org/docs/latest/api/python/'),
          r('video', 'PySpark Tutorial', 'https://www.youtube.com/watch?v=_C8kWso4ne4'),
          r('practice', 'Databricks Community Edition', 'https://community.cloud.databricks.com/'),
        ],
      },
      {
        name: 'MLOps', description: 'Deploying & monitoring models.', hours: 30, category: 'Advanced',
        resources: [
          r('doc', 'MLflow Docs', 'https://mlflow.org/docs/latest/index.html'),
          r('video', 'MLOps Explained', 'https://www.youtube.com/watch?v=ZVWg18AXXuE'),
          r('practice', 'Made With ML — MLOps', 'https://madewithml.com/'),
        ],
      },
    ],
    projects: [
      { title: 'Sales Prediction', description: 'Forecast future sales with time-series/regression.', difficulty: 'Beginner' },
      { title: 'Customer Segmentation', description: 'Cluster customers with K-Means for marketing.', difficulty: 'Intermediate' },
      { title: 'Churn Prediction', description: 'Predict which customers will leave a service.', difficulty: 'Intermediate' },
      { title: 'A/B Test Analysis', description: 'Statistically evaluate an experiment end-to-end.', difficulty: 'Advanced' },
    ],
  },
  {
    slug: 'data-analyst',
    title: 'Data Analyst',
    description:
      'Answers business questions with data — cleaning, analyzing and visualizing to drive decisions through dashboards and reports.',
    avg_salary: '₹5–12 LPA',
    demand_level: 'High',
    icon: '📈',
    skills: [
      {
        name: 'Excel', description: 'Spreadsheets, formulas and pivot tables.', hours: 20, category: 'Foundation',
        resources: [
          r('doc', 'Excel Help & Learning', 'https://support.microsoft.com/en-us/excel'),
          r('video', 'Excel Full Course', 'https://www.youtube.com/watch?v=Vl0H-qTclOg'),
          r('practice', 'Excel Exercises', 'https://excel-practice-online.com/'),
        ],
      },
      { name: 'SQL', description: 'Extract and aggregate data from databases.', hours: 30, category: 'Core', resources: RES.sql },
      { name: 'Statistics', description: 'Descriptive & inferential statistics.', hours: 25, category: 'Core', resources: RES.statistics },
      { name: 'Python for Analysis', description: 'Pandas-based analysis workflows.', hours: 30, category: 'Core', resources: RES.pandas },
      {
        name: 'Data Cleaning', description: 'Handling messy, missing & dirty data.', hours: 20, category: 'Core',
        resources: [
          r('doc', 'Pandas Cleaning Guide', 'https://pandas.pydata.org/docs/user_guide/missing_data.html'),
          r('video', 'Data Cleaning in Pandas', 'https://www.youtube.com/watch?v=bDhvCp3_lYw'),
          r('practice', 'Kaggle: Data Cleaning', 'https://www.kaggle.com/learn/data-cleaning'),
        ],
      },
      {
        name: 'Data Visualization (BI)', description: 'Tableau / Power BI dashboards.', hours: 25, category: 'Advanced',
        resources: [
          r('doc', 'Power BI Learn', 'https://learn.microsoft.com/en-us/power-bi/'),
          r('video', 'Tableau Full Course', 'https://www.youtube.com/watch?v=aHaOIvR00So'),
          r('practice', 'Tableau Public', 'https://public.tableau.com/'),
        ],
      },
      {
        name: 'Dashboards', description: 'Designing clear, interactive reports.', hours: 15, category: 'Advanced',
        resources: [
          r('doc', 'Dashboard Design Guide', 'https://www.tableau.com/learn/whitepapers/dashboard-design-best-practices'),
          r('video', 'Build a Power BI Dashboard', 'https://www.youtube.com/watch?v=TmhQCQr_DCA'),
          r('practice', 'Maven Analytics Challenges', 'https://mavenanalytics.io/data-playground'),
        ],
      },
      {
        name: 'Business Communication', description: 'Storytelling & stakeholder reporting.', hours: 15, category: 'Advanced',
        resources: [
          r('doc', 'Storytelling with Data', 'https://www.storytellingwithdata.com/blog'),
          r('video', 'Data Storytelling', 'https://www.youtube.com/watch?v=8EMW7io4rSI'),
          r('practice', 'Present a Portfolio Dashboard', 'https://www.datacamp.com/blog/data-analyst-portfolio'),
        ],
      },
    ],
    projects: [
      { title: 'Sales Dashboard', description: 'Interactive BI dashboard over retail sales.', difficulty: 'Beginner' },
      { title: 'HR Attrition Analysis', description: 'Find drivers of employee attrition.', difficulty: 'Intermediate' },
      { title: 'COVID Data Explorer', description: 'Clean and visualize public health data.', difficulty: 'Intermediate' },
    ],
  },
  {
    slug: 'web-developer',
    title: 'Web Developer',
    description:
      'Builds complete websites and web apps — from markup and styling to interactive frontends and connected backends.',
    avg_salary: '₹4–14 LPA',
    demand_level: 'High',
    icon: '🌐',
    skills: [
      { name: 'HTML', description: 'Structure and semantics of web pages.', hours: 15, category: 'Foundation', resources: RES.html },
      { name: 'CSS', description: 'Styling and layout with modern CSS.', hours: 25, category: 'Foundation', resources: RES.css },
      { name: 'JavaScript', description: 'Interactivity and DOM programming.', hours: 45, category: 'Foundation', resources: RES.javascript },
      { name: 'Git & GitHub', description: 'Version control workflows.', hours: 15, category: 'Tools', resources: RES.git },
      {
        name: 'Responsive Design', description: 'Mobile-first, adaptive layouts.', hours: 15, category: 'Core',
        resources: [
          r('doc', 'MDN Responsive Design', 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design'),
          r('video', 'Flexbox & Grid', 'https://www.youtube.com/watch?v=phWxA89Dy94'),
          r('practice', 'Flexbox Froggy', 'https://flexboxfroggy.com/'),
        ],
      },
      { name: 'React', description: 'Component-based UI library.', hours: 45, category: 'Core', resources: RES.react },
      { name: 'Node.js', description: 'JavaScript on the server.', hours: 35, category: 'Core', resources: RES.node },
      {
        name: 'REST APIs', description: 'Designing and consuming HTTP APIs.', hours: 25, category: 'Advanced',
        resources: [
          r('doc', 'REST API Tutorial', 'https://restfulapi.net/'),
          r('video', 'Build a REST API', 'https://www.youtube.com/watch?v=pKd0Rpw7O48'),
          r('practice', 'Public APIs to Practice', 'https://github.com/public-apis/public-apis'),
        ],
      },
      {
        name: 'Databases', description: 'Storing data (SQL & NoSQL).', hours: 30, category: 'Advanced', resources: RES.sql,
      },
      {
        name: 'Deployment', description: 'Shipping apps to the web.', hours: 15, category: 'Advanced',
        resources: [
          r('doc', 'Vercel Docs', 'https://vercel.com/docs'),
          r('video', 'Deploy a Full Stack App', 'https://www.youtube.com/watch?v=71wSzpLyW9k'),
          r('practice', 'Deploy on Render', 'https://render.com/docs'),
        ],
      },
    ],
    projects: [
      { title: 'Personal Portfolio', description: 'Responsive portfolio site from scratch.', difficulty: 'Beginner' },
      { title: 'Todo App with Backend', description: 'Full CRUD app with React + Node + DB.', difficulty: 'Intermediate' },
      { title: 'Blog Platform', description: 'Multi-user blog with auth and comments.', difficulty: 'Intermediate' },
      { title: 'E-commerce Store', description: 'Cart, checkout and product catalog.', difficulty: 'Advanced' },
    ],
  },
  {
    slug: 'frontend-developer',
    title: 'Frontend Developer',
    description:
      'Crafts polished, accessible user interfaces — specializing in modern JavaScript frameworks, styling and performance.',
    avg_salary: '₹4–15 LPA',
    demand_level: 'High',
    icon: '🎨',
    skills: [
      { name: 'HTML', description: 'Semantic, accessible markup.', hours: 15, category: 'Foundation', resources: RES.html },
      { name: 'CSS', description: 'Modern layout and styling.', hours: 25, category: 'Foundation', resources: RES.css },
      { name: 'JavaScript', description: 'Language of the browser.', hours: 45, category: 'Foundation', resources: RES.javascript },
      { name: 'Git & GitHub', description: 'Version control workflows.', hours: 15, category: 'Tools', resources: RES.git },
      {
        name: 'TypeScript', description: 'Typed JavaScript for safer code.', hours: 25, category: 'Core',
        resources: [
          r('doc', 'TypeScript Handbook', 'https://www.typescriptlang.org/docs/handbook/intro.html'),
          r('video', 'TypeScript Course', 'https://www.youtube.com/watch?v=30LWjhZzg50'),
          r('practice', 'Type Challenges', 'https://github.com/type-challenges/type-challenges'),
        ],
      },
      { name: 'React', description: 'Building component UIs.', hours: 45, category: 'Core', resources: RES.react },
      {
        name: 'State Management', description: 'Managing app state (Context/Redux/Zustand).', hours: 20, category: 'Advanced',
        resources: [
          r('doc', 'Redux Toolkit Docs', 'https://redux-toolkit.js.org/'),
          r('video', 'React State Management', 'https://www.youtube.com/watch?v=5-1LM2NySR0'),
          r('practice', 'Build a State-heavy App', 'https://ui.dev/react-state'),
        ],
      },
      {
        name: 'Tailwind & UI', description: 'Utility-first styling and design systems.', hours: 15, category: 'Advanced',
        resources: [
          r('doc', 'Tailwind CSS Docs', 'https://tailwindcss.com/docs/installation'),
          r('video', 'Tailwind Crash Course', 'https://www.youtube.com/watch?v=UBOj6rqRUME'),
          r('practice', 'Frontend Mentor', 'https://www.frontendmentor.io/challenges'),
        ],
      },
      {
        name: 'Testing', description: 'Unit & component testing.', hours: 20, category: 'Advanced',
        resources: [
          r('doc', 'Testing Library Docs', 'https://testing-library.com/docs/'),
          r('video', 'React Testing Tutorial', 'https://www.youtube.com/watch?v=7dTTFW7yACQ'),
          r('practice', 'Vitest Examples', 'https://vitest.dev/guide/'),
        ],
      },
      {
        name: 'Web Performance', description: 'Optimizing load & runtime performance.', hours: 15, category: 'Advanced',
        resources: [
          r('doc', 'web.dev Performance', 'https://web.dev/learn/performance/'),
          r('video', 'Web Performance Basics', 'https://www.youtube.com/watch?v=0fONene3OIA'),
          r('practice', 'Lighthouse Audits', 'https://developer.chrome.com/docs/lighthouse/overview/'),
        ],
      },
    ],
    projects: [
      { title: 'Landing Page Clone', description: 'Pixel-perfect responsive clone of a product page.', difficulty: 'Beginner' },
      { title: 'Weather App', description: 'Consume a public API with loading & error states.', difficulty: 'Beginner' },
      { title: 'Kanban Board', description: 'Drag-and-drop board with persistent state.', difficulty: 'Intermediate' },
      { title: 'Design System', description: 'Reusable component library with docs.', difficulty: 'Advanced' },
    ],
  },
  {
    slug: 'backend-developer',
    title: 'Backend Developer',
    description:
      'Builds the server side of applications — APIs, databases, authentication and the infrastructure that powers apps at scale.',
    avg_salary: '₹5–18 LPA',
    demand_level: 'High',
    icon: '⚙️',
    skills: [
      { name: 'Programming (Node.js)', description: 'Server-side JavaScript fundamentals.', hours: 40, category: 'Foundation', resources: RES.node },
      { name: 'Git & GitHub', description: 'Version control workflows.', hours: 15, category: 'Tools', resources: RES.git },
      { name: 'Databases (SQL)', description: 'Relational data modeling & queries.', hours: 30, category: 'Core', resources: RES.sql },
      {
        name: 'REST APIs', description: 'Designing robust HTTP APIs.', hours: 30, category: 'Core',
        resources: [
          r('doc', 'REST API Tutorial', 'https://restfulapi.net/'),
          r('video', 'API Design Best Practices', 'https://www.youtube.com/watch?v=_YlYuNMTCc8'),
          r('practice', 'Build an Express API', 'https://expressjs.com/en/starter/hello-world.html'),
        ],
      },
      {
        name: 'Authentication', description: 'Sessions, JWT and OAuth.', hours: 25, category: 'Advanced',
        resources: [
          r('doc', 'JWT Introduction', 'https://jwt.io/introduction'),
          r('video', 'Auth in Node.js', 'https://www.youtube.com/watch?v=Ud5xKCYQTjM'),
          r('practice', 'OWASP Auth Cheat Sheet', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'),
        ],
      },
      {
        name: 'Caching', description: 'Speeding up apps with Redis.', hours: 15, category: 'Advanced',
        resources: [
          r('doc', 'Redis Docs', 'https://redis.io/docs/latest/'),
          r('video', 'Redis Crash Course', 'https://www.youtube.com/watch?v=jgpVdJB2sKQ'),
          r('practice', 'Try Redis', 'https://redis.io/learn/'),
        ],
      },
      {
        name: 'Message Queues', description: 'Async processing with queues.', hours: 20, category: 'Advanced',
        resources: [
          r('doc', 'RabbitMQ Tutorials', 'https://www.rabbitmq.com/tutorials'),
          r('video', 'Message Queues Explained', 'https://www.youtube.com/watch?v=xErwDaOc-Gs'),
          r('practice', 'Kafka Quickstart', 'https://kafka.apache.org/quickstart'),
        ],
      },
      {
        name: 'Docker', description: 'Containerizing applications.', hours: 20, category: 'Advanced',
        resources: [
          r('doc', 'Docker Get Started', 'https://docs.docker.com/get-started/'),
          r('video', 'Docker Tutorial', 'https://www.youtube.com/watch?v=3c-iBn73dDE'),
          r('practice', 'Play with Docker', 'https://labs.play-with-docker.com/'),
        ],
      },
      {
        name: 'System Design', description: 'Designing scalable architectures.', hours: 35, category: 'Advanced',
        resources: [
          r('doc', 'System Design Primer', 'https://github.com/donnemartin/system-design-primer'),
          r('video', 'System Design Basics', 'https://www.youtube.com/watch?v=quLrc3PbuIw'),
          r('practice', 'System Design Exercises', 'https://github.com/karanpratapsingh/system-design'),
        ],
      },
    ],
    projects: [
      { title: 'URL Shortener API', description: 'REST API with database and redirects.', difficulty: 'Beginner' },
      { title: 'Auth Service', description: 'JWT-based signup/login microservice.', difficulty: 'Intermediate' },
      { title: 'Rate-Limited API Gateway', description: 'Caching + rate limiting with Redis.', difficulty: 'Advanced' },
      { title: 'Job Queue Worker', description: 'Background processing with a message queue.', difficulty: 'Advanced' },
    ],
  },
  {
    slug: 'fullstack-developer',
    title: 'Full Stack Developer',
    description:
      'Owns features end-to-end — comfortable across frontend, backend, databases and deployment to ship complete products.',
    avg_salary: '₹6–20 LPA',
    demand_level: 'Very High',
    icon: '🧩',
    skills: [
      { name: 'HTML & CSS', description: 'Markup and styling foundations.', hours: 30, category: 'Foundation', resources: RES.css },
      { name: 'JavaScript', description: 'Core language across the stack.', hours: 45, category: 'Foundation', resources: RES.javascript },
      { name: 'Git & GitHub', description: 'Version control workflows.', hours: 15, category: 'Tools', resources: RES.git },
      { name: 'React', description: 'Frontend UI framework.', hours: 45, category: 'Core', resources: RES.react },
      { name: 'Node.js & Express', description: 'Backend runtime and framework.', hours: 40, category: 'Core', resources: RES.node },
      { name: 'Databases', description: 'SQL & NoSQL data stores.', hours: 30, category: 'Core', resources: RES.sql },
      {
        name: 'REST/GraphQL APIs', description: 'Building and consuming APIs.', hours: 30, category: 'Advanced',
        resources: [
          r('doc', 'GraphQL Docs', 'https://graphql.org/learn/'),
          r('video', 'REST vs GraphQL', 'https://www.youtube.com/watch?v=yWzKJPw_VzM'),
          r('practice', 'Apollo Tutorials', 'https://www.apollographql.com/tutorials/'),
        ],
      },
      {
        name: 'Authentication', description: 'Secure user auth flows.', hours: 25, category: 'Advanced',
        resources: [
          r('doc', 'JWT Introduction', 'https://jwt.io/introduction'),
          r('video', 'Full Stack Auth', 'https://www.youtube.com/watch?v=mbsmsi7l3r4'),
          r('practice', 'Auth0 Docs', 'https://auth0.com/docs'),
        ],
      },
      {
        name: 'Docker & CI/CD', description: 'Containerize and automate delivery.', hours: 25, category: 'Advanced',
        resources: [
          r('doc', 'GitHub Actions Docs', 'https://docs.github.com/en/actions'),
          r('video', 'CI/CD Pipeline Tutorial', 'https://www.youtube.com/watch?v=R8_veQiYBjI'),
          r('practice', 'Play with Docker', 'https://labs.play-with-docker.com/'),
        ],
      },
      {
        name: 'Deployment', description: 'Shipping full stack apps.', hours: 15, category: 'Advanced',
        resources: [
          r('doc', 'Vercel Docs', 'https://vercel.com/docs'),
          r('video', 'Deploy MERN App', 'https://www.youtube.com/watch?v=71wSzpLyW9k'),
          r('practice', 'Deploy on Render', 'https://render.com/docs'),
        ],
      },
    ],
    projects: [
      { title: 'Notes App (MERN)', description: 'Full CRUD notes app with auth.', difficulty: 'Beginner' },
      { title: 'Social Media Clone', description: 'Posts, likes, follows across the stack.', difficulty: 'Intermediate' },
      { title: 'Real-time Chat', description: 'WebSocket chat with rooms and presence.', difficulty: 'Advanced' },
      { title: 'SaaS Dashboard', description: 'Multi-tenant app with billing-style features.', difficulty: 'Advanced' },
    ],
  },
];

export const DEMO_USER = {
  name: 'Demo Student',
  email: 'demo@careergenie.app',
  education: "Master's",
  preferred_domain: 'Artificial Intelligence',
};
