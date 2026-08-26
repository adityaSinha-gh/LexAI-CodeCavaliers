from pydantic import BaseModel


# What the Node backend sends us (see message_controller.js -> createMessage)
class GenerateRequest(BaseModel):
    conversation_id: str
    message: str
    language: str


# What we send back to the Node backend
class GenerateResponse(BaseModel):
    response: str
