# AI Marketplace

This project is a demo React application that selects the best large language model (LLM) for a question and queries the model in real time. It supports OpenAI, Anthropic, and Google's Generative AI.

## Getting Started

1. **Install dependencies**
   ```sh
   npm install
   ```
2. **Create an environment file**
   ```sh
   cp .env.example .env
   ```
3. **Add your API keys**
   Edit `.env` and fill in the keys for any providers you want to use:
   ```sh
   VITE_OPENAI_API_KEY=your_openai_key
   VITE_ANTHROPIC_API_KEY=your_anthropic_key
   VITE_GOOGLE_API_KEY=your_google_key
   ```
   All three services offer free tiers or trial credits on sign-up:
   - [OpenAI](https://platform.openai.com/)
   - [Anthropic](https://console.anthropic.com/)
   - [Google Generative AI](https://makersuite.google.com/)
4. **Run the development server**
   ```sh
   npm run dev
   ```
   When keys are present the app will call the actual APIs; otherwise it falls back to simulated answers.
   You can also paste keys directly in the app if you prefer not to store them in `.env`.

## Overview

The UI lets you chat with different models. The application automatically picks the model that best fits the prompt and keeps track of token usage and cost.
