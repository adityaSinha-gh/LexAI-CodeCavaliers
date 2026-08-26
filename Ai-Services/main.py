
from fastapi import FastAPI
from schemas import GenerateRequest, GenerateResponse, TranslateRequest, TranslateResponse
from model_service import generate_response, translate_text
 
app = FastAPI()
 
 
@app.post("/generate", response_model=GenerateResponse)
async def generate(payload: GenerateRequest):
    """
    Called from message.controller.js -> createMessage()
    body sent by Node: { conversation_id, message }
    Node reads: data.response
    """
    text = await generate_response(payload.conversation_id, payload.message)
    return GenerateResponse(response=text)
 
 
@app.post("/translate", response_model=TranslateResponse)
async def translate(payload: TranslateRequest):
    """
    Called from message.controller.js -> translateMessage()
    body sent by Node: { text, target_language }
    Node reads: data.response
    """
    translated = await translate_text(payload.text, payload.target_language)
    return TranslateResponse(response=translated)
 
 
@app.get("/health")
async def health():
    return {"success": True, "status": "ok"}