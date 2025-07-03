 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/README.md b/README.md
index c3a697eff46172d56eb0c80b0b190894b00215d6..425c8c609071246eda6c2322618a61d0fdbd91eb 100644
--- a/README.md
+++ b/README.md
@@ -1 +1,34 @@
-# app
+# AI Marketplace
+
+This project is a demo React application that selects the best large language model (LLM) for a question and queries the model in real time. It supports OpenAI, Anthropic, and Google's Generative AI.
+
+## Getting Started
+
+1. **Install dependencies**
+   ```sh
+   npm install
+   ```
+2. **Create an environment file**
+   ```sh
+   cp .env.example .env
+   ```
+3. **Add your API keys**
+   Edit `.env` and fill in the keys for any providers you want to use:
+   ```sh
+   VITE_OPENAI_API_KEY=your_openai_key
+   VITE_ANTHROPIC_API_KEY=your_anthropic_key
+   VITE_GOOGLE_API_KEY=your_google_key
+   ```
+   All three services offer free tiers or trial credits on sign‑up:
+   - [OpenAI](https://platform.openai.com/)
+   - [Anthropic](https://console.anthropic.com/)
+   - [Google Generative AI](https://makersuite.google.com/)
+4. **Run the development server**
+   ```sh
+   npm run dev
+   ```
+   When keys are present the app will call the actual APIs; otherwise it falls back to simulated answers.
+
+## Overview
+
+The UI lets you chat with different models. The application automatically picks the model that best fits the prompt and keeps track of token usage and cost.
 
EOF
)
