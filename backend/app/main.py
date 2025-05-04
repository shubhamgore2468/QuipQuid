from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends, BackgroundTasks
from fastapi.responses import JSONResponse
from typing import Optional, Dict, Any, List
import os
import uuid
from datetime import datetime
import json
import base64
from pydantic import BaseModel
import RAGServiceClient

app = FastAPI()

'''Init rag client'''
def get_rag_client():
    pass

app.get("/api/rag")
async def chat_message(
        message: str = Form(...),
        user_id: int = Form(...),
        session_id: Optional[str] = Form(None),
        context: Optional[str] = Form(None),
        ragClient: RAGServiceClient = Depends(get_rag_client)
):
    chat_payload = {
        "message": message,
        "user_id": user_id,
        "session_id": session_id,
        "context": context
    }
    response = await ragClient.method(chat_payload)
    return response

@app.get("/")
def read_root():
    return {"Hello": "World"}

