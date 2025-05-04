from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends, BackgroundTasks
from fastapi.responses import JSONResponse
from typing import Optional, Dict, Any, List
import os
import uuid
from datetime import datetime
import json
import base64
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from api.chat import router as chat
from api.billSplit import router as expense
from api.addGoals import router as goals
from api.addBudget import router as budget


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-powered budget tracking application with multi-modal expense input and RAG-based insights",
    version="1.0.0",
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix=settings.API_STR + "/chat", tags=["Chat"])
app.include_router(expense.router, prefix=settings.API_STR + "/split-bill", tags=["Bill Split"])
app.include_router(expense.router, prefix=settings.API_STR + "/addGoals", tags=["Add Goals"])
app.include_router(goals.router, prefix=settings.API_STR + "/addGoals", tags=["Add Goals"])
app.include_router(budget.router, prefix=settings.API_STR + "/addGoals", tags=["Add Goals"])

@app.get("/")
def read_root():
    return {"Hello": "World"}

