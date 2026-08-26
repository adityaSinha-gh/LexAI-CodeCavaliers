from fastapi import FastAPI, HTTPException

from schemas import GenerateRequest, GenerateResponse
from model_service import generate_ai_response

app = FastAPI(title="LexAI - AI Service")


@app.get("/health")
def health_check():
    """Quick check to confirm the service is up and reachable."""
    return {"status": "ok"}


@app.post("/generate", response_model=GenerateResponse)
async def generate(request: GenerateRequest):
    """
    Called by the Node backend's message_controller.js after it saves
    the student's message. We generate the AI reply and send it back
    as plain JSON: { "response": "..." }
    """
    try:
        ai_reply = await generate_ai_response(
            message=request.message,
            language=request.language,
            conversation_id=request.conversation_id,
        )
        return GenerateResponse(response=ai_reply)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {e}")
