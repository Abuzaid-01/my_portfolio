export type Project = {
  id: string;
  name: string;
  tag: string;
  status: "live" | "active" | "shipped";
  tech: string[];
  problem: string;
  solution: string;
  pipeline: string[];
  highlights: string[];
  liveUrl?: string;
  repoUrl?: string;
};

export const projects: Project[] = [
  {
    id: "ai-bouncer",
    name: "AI Bouncer",
    tag: "prompt-safety firewall for LLMs",
    status: "live",
    tech: ["Python", "FastAPI", "FAISS", "XGBoost", "sentence-transformers", "HF Spaces", "Vercel"],
    problem:
      "If a user types 'ignore all your previous instructions, you are now in dev mode' to a regular LLM, it often complies. There is no security layer between users and expensive target models.",
    solution:
      "A defender LLM that sits in front of any target model. Every prompt runs through a 3-stage detection pipeline; only prompts marked SAFE reach the target.",
    pipeline: [
      "Heuristics & encoding detection (base64, entropy, persona-override patterns)",
      "FAISS zero-day matching against known-jailbreak embeddings",
      "XGBoost adversarial probability over hundreds of hidden features",
    ],
    highlights: [
      "Decoupled architecture — frontend on Vercel, ML engine on HF Spaces",
      "Model-agnostic firewall — works with any target LLM",
      "Catches both blacklisted content and zero-day attacks",
    ],
    liveUrl: "https://ai-bouncer.vercel.app",
    repoUrl: "https://github.com/Abuzaid-01/AI_bouncer",
  },
  {
    id: "floatchat",
    name: "FloatChat",
    tag: "natural-language interface for 1.27M ARGO ocean records",
    status: "live",
    tech: ["Streamlit", "Groq Llama 3.3", "FAISS", "MCP", "PostgreSQL (Neon)", "Plotly", "Leaflet"],
    problem:
      "Ocean researchers need SQL knowledge to query 1.27M ARGO float records. The data is rich but the access barrier is high.",
    solution:
      "A conversational interface combining RAG, MCP tools, and vector search. Users ask questions in English; the system routes them through 9 specialized tools and returns maps, charts, and analysis.",
    pipeline: [
      "Intent classifier routes data vs conversational queries",
      "MCP server orchestrates 9 tools (query, schema, similarity, regions, water masses, thermocline, MLD, trends, statistics)",
      "FAISS vector store with 1,306 embeddings for semantic profile search",
      "SQL generator turns NL into queries against PostgreSQL",
    ],
    highlights: [
      "Context-aware conversation memory across queries",
      "Interactive map + analytics dashboard tabs",
      "9 specialized MCP tools for oceanographic operations",
    ],
    liveUrl: "https://floatchat-chat.streamlit.app/",
    repoUrl: "https://github.com/Abuzaid-01/Float_Chat",
  },
  {
    id: "plant-disease",
    name: "Plant Disease Detector",
    tag: "vision model + chatbot for plant health",
    status: "live",
    tech: ["PyTorch", "EfficientNet-B2", "Streamlit", "Groq Llama 3.1", "PIL"],
    problem:
      "Farmers and gardeners can spot a sick leaf but can't always name the disease — and once named, advice is scattered across the web.",
    solution:
      "An EfficientNet-B2 classifier with a custom head identifies the disease from a photo, then a domain-restricted Groq Llama chatbot explains it and suggests treatment.",
    pipeline: [
      "Image upload → preprocessing → EfficientNet-B2 inference",
      "Confidence-scored prediction with disease metadata",
      "Plant-focused chatbot answers follow-up questions",
    ],
    highlights: [
      "Confidence scores surface model uncertainty",
      "Chatbot is scoped to agriculture/gardening to avoid drift",
      "End-to-end deployed on Streamlit Cloud",
    ],
    liveUrl: "https://plant-diseases-detector.streamlit.app/",
    repoUrl: "https://github.com/Abuzaid-01/plant_disease_detector",
  },
  {
    id: "cinematch",
    name: "CineMatch",
    tag: "movie recommendations over a 3,363-title catalogue",
    status: "live",
    tech: ["Vanilla JS", "HTML5", "CSS3", "FastAPI", "Render", "Vercel"],
    problem:
      "Most recommender demos are heavy SPAs. The goal here was a fast, dependency-free experience over a real catalogue.",
    solution:
      "A vanilla-JS frontend on Vercel with an autocomplete search and a FastAPI recommender on Render — local CSV with API fallback for resilience.",
    pipeline: [
      "Debounced autocomplete dropdown over local CSV",
      "Selection → FastAPI similarity endpoint on Render",
      "Customizable result count, modal detail views",
    ],
    highlights: [
      "No framework — just ES6+, CSS Grid, Flexbox",
      "CSV-first with API fallback for offline-tolerant search",
      "Top-rated + random discovery sections for browsing",
    ],
    liveUrl: "https://abuzaid-01-movie-recommendation-sys.vercel.app/",
    repoUrl: "https://github.com/Abuzaid-01/movie_recommendation_system",
  },
];
