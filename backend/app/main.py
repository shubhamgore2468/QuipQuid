
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
from app.core.config import settings
from app.api.chat import router as chat
from app.api.billSplit import router as expense
from app.api.addGoals import router as goals
from app.api.addBudget import router as budget
from app.api.billSplit import router as split_bill_router
from app.init_db import init_db


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

# app.include_router(chat.router, prefix=settings.API_STR + "/chat", tags=["Chat"])
app.include_router(split_bill_router, prefix=settings.API_STR + "/split-bill", tags=["Bill Split"])
# app.include_router(expense.router, prefix=settings.API_STR + "/addGoals", tags=["Add Goals"])
# app.include_router(goals.router, prefix=settings.API_STR + "/addGoals", tags=["Add Goals"])
# app.include_router(budget.router, prefix=settings.API_STR + "/addGoals", tags=["Add Goals"])
@app.on_event("startup")
def on_startup():
    # This will run once, when the FastAPI application starts,
    # creating any missing tables before you handle requests.
    init_db()


@app.get("/")
def read_root():
    return {"Hello": "World"}

