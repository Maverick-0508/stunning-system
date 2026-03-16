# AI Content Generator

A Python Flask web app that generates content and summarizes documents using **Google's Gemini generative AI models**.

## Features

- **Content Generation** – Provide a topic, choose a content type (blog post, social media post, essay, etc.) and tone, then let Gemini write it for you.
- **Document Summarization** – Paste any text and get a concise, detailed, or bullet-point summary in seconds.
- Clean, dark-themed responsive UI

## Prerequisites

- Python 3.10+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

## Setup (Local / GitHub Codespaces)

```bash
# 1. Clone the repo (already done in Codespaces)
git clone <repo-url>
cd stunning-system

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure your API key
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=<your-key>

# 4. Run the app
python app.py
```

Open `http://localhost:5000` in your browser.

## Project Structure

```
.
├── app.py               # Flask application & Gemini API integration
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variable template
├── templates/
│   └── index.html       # Frontend HTML
└── static/
    ├── style.css        # Styles
    └── script.js        # Client-side logic
```

## Environment Variables

| Variable         | Description                                         |
|------------------|-----------------------------------------------------|
| `GEMINI_API_KEY` | Your Google Gemini API key (required)               |
| `FLASK_DEBUG`    | Set to `true` to enable debug mode (default: false) |

## API Endpoints

| Method | Path        | Description                        |
|--------|-------------|------------------------------------|
| GET    | `/`         | Serve the web UI                   |
| POST   | `/generate` | Generate content from a topic      |
| POST   | `/summarize`| Summarize a provided document      |

### `/generate` payload
```json
{
  "topic": "The impact of AI on healthcare",
  "content_type": "blog post",
  "tone": "professional"
}
```

### `/summarize` payload
```json
{
  "document": "Paste your full document text here...",
  "length": "concise"
}
```
