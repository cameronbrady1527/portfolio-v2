/*
 *  DATA STORAGE FOR PROJECTS
 *  Storage of data v1
 *  Idea from https://github.com/adenekan41
 */

const PROJECTS_DATA = [
  {
    title: "Portfolio",
    description: "Display of projects, services, experiences, and accomplishments",  // short one line-description
    about: "TODO",  // longer description - view when open 
    demoLink: "https://cameronbrady.dev",
    imageUrl: "TODO",
    codeRepo: "https://github.com/cameronbrady1527/portfolio-v2",
    type: ["project"],
    technologies: ["Next.js", "React", "Typescript", "Tailwind"],
    status: "dev"
  },
  {
    title: "Strava Stats",
    description: "Display, analyze, and export your Strava activity data",
    about: "A web application that displays your Strava activities with advanced filtering, statistics, and best efforts tracking.",
    demoLink: "https://yourstravastats.netlify.app",
    imageUrl: "TODO",
    codeRepo: "https://github.com/cameronbrady1527/strava-stats",
    type: ["project"],
    technologies: ["JavaScript", "CSS", "HTML", "Strava API v3"],
    status: "prod"
  },
  {
    title: "Sesha",
    description: "Article generation platform baked with AI and source aggregation",
    about: "AI-powered article generation platform that aggregates and processes multiple sources to produce structured articles with customizable presets and export capabilities.",
    demoLink: "TODO",
    imageUrl: "TODO", // ⭐
    codeRepo: "https://github.com/astral-ai-labs/sesha-v4",
    type: ["project", "ai"],
    technologies: ["Anthropic Claude Sonnet 4.5", "OpenAI GPT-5", "Next.js", "React", "Typescript", "Tailwind", "Supabase"],
    status: "prod"
  },
  {
    title: "ML Research Blog",
    description: "My dedicated blogspace to share insights in machine learning, programming, and neurosciece",
    about: "An open-source platform sharing machine learning research on neurological disorder early detection while fostering education and collaboration across technical and healthcare communities.",
    demoLink: "TODO",
    imageUrl: "TODO",
    codeRepo: "https://github.com/cameronbrady1527/ml-research-blog",
    type: ["project", "ml", "research"],
    technologies: ["Sanity CMS", "Next.js", "React", "Typescript", "Tailwind", "MDX"],
    status: "dev"
  },
  {
    title: "Parkinson's Detection",
    description: "ML pipeline for Parkinson's Disease detection from vocal biometrics",
    about: "Comprehensive machine learning pipeline for Parkinson's disease detection using voice measurements with automated data processing, outlier detection, and model evaluation.",
    demoLink: "https://parkinsons-detection-production.up.railway.app",
    imageUrl: "TODO",
    codeRepo: "https://github.com/cameronbrady1527/parkinsons-detection",
    type: ["project", "ml", "research"],
    technologies: ["Python", "FastAPI", "Scikit-learn", "Seaborn", "PyTest"],
    status: "prod"
  },
  {
    title: "Research Assistant",
    description: "An AI-powered research assistant that transforms academic literature search through natural language interaction.",
    about: "AI-powered research assistant with MCP server that connects to multiple academic databases, manages research workflows, and provides intelligent analysis through natural language interaction.",
    demoLink: "TODO",
    imageUrl: "TODO",
    codeRepo: "https://github.com/cameronbrady1527/research-assistant",
    type: ["project", "research", "ai"],
    technologies: ["Python", "MCP", "Claude Desktop"],
    status: "edev"
  },
  {
    title: "Nonprofit Revenue Scraper",
    description: "Scraper for collecting and analyzing nonprofit financial data",
    about: "A comprehensive Python toolkit for collecting and analyzing nonprofit financial data from ProPublica's Nonprofit Explorer API and 990 PDF tax forms. Features AI-powered PDF parsing, real-time GUI monitoring, and high-performance async processing to identify organizations with revenue between $250K - $1M.",
    demoLink: "TODO",
    imageUrl: "TODO",
    codeRepo: "https://github.com/cameronbrady1527/nonprofit-revenue-scraper",
    type: ["project", "ai", "research"],
    technologies: ["Python", "ProPublica API", "Gemini 2.5 Flash", "OCR", "Tkinter"],
    status: "dev"
  },
  {
    title: "Vocab Flashcards",
    description: "A webpage designed to help a user learn vocabulary words.",
    about: "Flashcards that go beyond just two sides. In a creative interface with flashcards and a dictionary, you see stats for each word, definitions, example uses, part of speech, and more! Export is supported for your own data analysis and addition of words.",
    demoLink: "https://learn-vocab-v1.vercel.app",
    imageUrl: "TODO",
    codeRepo: "https://github.com/cameronbrady1527/learn-vocab-v1",
    type: ["project"],
    technologies: ["JavaScript", "CSS", "HTML", "Excel"],
    status: "prod"
  },
  {
    title: "McDiver Graph Navigation Game",
    description: "Shortest path opimization graph algorithms for navigating a random maze",
    about: "CORNELL CS2110 PROJECT: Graph algorithms implementation for navigating maze-like sewer systems using Dijkstra's shortest path and optimized DFS/BFS traversal strategies.",
    demoLink: "TODO",
    imageUrl: "TODO",
    codeRepo: "https://github.com/cameronbrady1527/mcdiver-graph-navigation",
    type: ["project", "cornell"],
    technologies: ["Java"],
    status: "prod"
  },
  {
    title: "Interactive Target Game",
    description: "Java Swing GUI game featuring event-driven programming, custom graphics rendering, and interactive widgets for a target-clicking challenge.",
    about: "A Java Swing-based interactive game where players click on moving targets to score points. This assignment demonstrates GUI programming concepts including event-driven architecture, widget composition, layout management, and the Model-View-Controller design pattern.",
    demoLink: "TODO",
    imageUrl: "TODO",
    codeRepo: "https://github.com/cameronbrady1527/java-gui-practice",
    type: ["project", "cornell"],
    technologies: ["Java", "Swing"],
    status: "prod"
  },
  {
    title: "Recursive Expression Evaluation",
    description: "Polymorphic expression tree evaluator supporting RPN parsing, variable substitution, and spreadsheet formula evaluation using recursive algorithms.",
    about: "CORNELL CS2110 PROJECT - A comprehensive expression evaluation system that parses and evaluates mathematical formulas in Reverse Polish Notation (RPN). This project includes an interactive RPN calculator and a CSV spreadsheet evaluator that processes formulas in cells. The implementation demonstrates polymorphic expression trees, recursive evaluation, and integration with third-party libraries.",
    demoLink: "TODO",
    imageUrl: "TODO",
    codeRepo: "https://github.com/cameronbrady1527/recursive-expression-evaluation",
    type: ["project", "cornell"],
    technologies: ["Java", "Apache Commons CSV", "JUnit"],
    status: "prod"
  },
  {
    title: "DSA Spreadsheet Merger",
    description: "Custom linked list implementation with CSV file processing and database-style left outer join operations for merging tabular data.",
    about: "A Java application that performs database-style joins on CSV files using a custom singly linked list implementation. This project demonstrates linked data structures, file I/O, and the practical application of the left outer join operation commonly used in relational databases.",
    demoLink: "TODO",
    imageUrl: "TODO",
    codeRepo: "https://github.com/cameronbrady1527/dsa-spreadsheet-merger",
    type: ["project", "cornell"],
    technologies: ["Java", "JUnit"],
    status: "prod"
  },
  {
    title: "Course Management System (MICRO)",
    description: "Course management system featuring custom resizable array implementation, defensive programming with invariants, and comprehensive test-driven development.",
    about: "CORNELL CS2110 PROJECT - A micro course management system (CMSμ) that manages student enrollments in courses. This project implements fundamental data structures including a resizable array-based set, demonstrates defensive programming with assertions, and practices test-driven development. The system supports operations like enrollment management, schedule conflict detection, and credit limit validation.",
    demoLink: "TODO",
    imageUrl: "TODO",
    codeRepo: "https://github.com/cameronbrady1527/cms-micro",
    type: ["project", "cornell"],
    technologies: ["Java", "JUnit"],
    status: "prod"
  },

  // model
  // {
  //   title: "",
  //   description: "",
  //   about: "",
  //   demoLink: "",
  //   imageUrl: "",
  //   codeRepo: "",
  //   type: [""],
  //   technologies: [""],
  //   status: ""
  // },
];

export default PROJECTS_DATA;