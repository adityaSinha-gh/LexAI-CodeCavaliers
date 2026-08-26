
"""
This file is where your friend plugs in the real AI model.
 
Right now both functions call a local Ollama model as a placeholder,
so the Node backend can already connect and get real responses back.
When the real model is ready, just replace what's INSIDE these two
functions. Keep the function names and inputs/outputs the same, and
main.py never needs to change.
"""
 
import httpx
 
OLLAMA_HOST = "http://localhost:11434"
OLLAMA_MODEL = "llama3"
 
 
async def generate_response(conversation_id: str, message: str) -> str:
    """
    Takes the student's message, returns the AI tutor's reply (a string).
    """
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": message,
        "stream": False,
    }
 
    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(f"{OLLAMA_HOST}/api/generate", json=payload)
 
    data = resp.json()
    return data["response"]
 
 
async def translate_text(text: str, target_language: str) -> str:
    """
    Takes text + a target language, returns the translated text (a string).
    """
    prompt = (
        f"Translate the following text into {target_language}. "
        f"Return only the translated text, nothing else.\n\n{text}"
    )
 
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
    }
 
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(f"{OLLAMA_HOST}/api/generate", json=payload)
 
    data = resp.json()
    return data["response"].strip()
