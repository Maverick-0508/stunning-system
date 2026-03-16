import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = Flask(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-1.5-flash"


def get_model():
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not set. Please configure your API key.")
    return genai.GenerativeModel(MODEL_NAME)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    topic = (data.get("topic") or "").strip()
    content_type = (data.get("content_type") or "blog post").strip()
    tone = (data.get("tone") or "neutral").strip()

    if not topic:
        return jsonify({"error": "Topic is required."}), 400

    prompt = (
        f"Write a {content_type} about the following topic: {topic}.\n"
        f"Use a {tone} tone.\n"
        f"Make it engaging, informative, and well-structured."
    )

    try:
        model = get_model()
        response = model.generate_content(prompt)
        return jsonify({"result": response.text})
    except ValueError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        return jsonify({"error": f"Content generation failed: {str(e)}"}), 500


@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.get_json()
    document = (data.get("document") or "").strip()
    length = (data.get("length") or "concise").strip()

    if not document:
        return jsonify({"error": "Document text is required."}), 400

    prompt = (
        f"Summarize the following document in a {length} manner.\n"
        f"Highlight the key points and main ideas.\n\n"
        f"Document:\n{document}"
    )

    try:
        model = get_model()
        response = model.generate_content(prompt)
        return jsonify({"result": response.text})
    except ValueError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        return jsonify({"error": f"Summarization failed: {str(e)}"}), 500


if __name__ == "__main__":
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(debug=debug, host="0.0.0.0", port=5000)
