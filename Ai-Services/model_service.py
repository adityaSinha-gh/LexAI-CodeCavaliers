"""
Connects to a locally running Ollama model and turns it into a
multilingual AI tutor ("LexAI").

Prerequisite (one-time setup, on whichever machine runs this service):
    1. Install Ollama: https://ollama.com/download
    2. Pull a model, e.g.:  ollama pull llama3
    3. Ollama runs its own local server automatically at
       http://localhost:11434 once installed - nothing else to start.

If you swap models later, just change MODEL_NAME below.
"""

import httpx

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3"  # must match a model you've pulled with `ollama pull <name>`

# This is the tutor's "personality" + instruction to always reply in the
# student's chosen language, no matter what language they typed in.
SYSTEM_PROMPT = (
    "You are LexAI, a friendly and patient AI tutor for college students. "
    "Explain concepts clearly, simply, and step by step, using examples "
    "where helpful. Always reply in {language}, even if the student's "
    "message was written in a different language."
)


async def generate_ai_response(message: str, language: str, conversation_id: str) -> str:
    prompt = (
        f"{SYSTEM_PROMPT.format(language=language)}\n\n"
        f"Student: {message}\n"
        f"LexAI:"
    )

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False,  # get the full reply in one response, not token-by-token
            },
        )
        response.raise_for_status()
        data = response.json()
        return data["response"].strip()
