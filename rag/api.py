import os
from enum import Enum
from typing import List, Dict, Any, Optional
from datetime import datetime
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv

from logger import (
    logger, 
    log_receipt_processing, 
    log_processing_success, 
    log_missing_field, 
    log_processing_error
)
from receipt_processor import ReceiptProcessor
from budget_planner import BudgetPlanner

# Load environment variables
load_dotenv()

# Configure API keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

# Get PostgreSQL connection string (optional)
POSTGRES_CONNECTION = os.getenv("POSTGRESQL_URL")

# Define expense categories
class ExpenseCategory(str, Enum):
    ''' can be added more acc. to the user preferences'''
    FOOD = "food"
    TRANSPORTATION = "transportation"
    HOUSING = "housing"
    UTILITIES = "utilities"
    ENTERTAINMENT = "entertainment"
    HEALTHCARE = "healthcare"
    SHOPPING = "shopping"
    EDUCATION = "education"
    PERSONAL = "personal"
    SAVINGS = "savings"
    INVESTMENTS = "investments"
    OTHER = "other"

# Response model
class ReceiptResponse(BaseModel):
    merchant_name: str
    date: str
    created_at: str
    items: List[Dict[str, Any]]
    total: float
    category: ExpenseCategory
    description: str

# Budget chat request model
class BudgetChatRequest(BaseModel):
    message: str

# Budget chat response model
class BudgetChatResponse(BaseModel):
    response: str

# Initialize FastAPI app
app = FastAPI(title="QuipQuid: Budget Planner")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, you might want to restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependencies to get processor instances
def get_receipt_processor():
    """Dependency that provides the ReceiptProcessor instance"""
    return ReceiptProcessor(api_key=OPENAI_API_KEY)

def get_budget_planner():
    """Dependency that provides the BudgetPlanner instance"""
    return BudgetPlanner(
        api_key=OPENAI_API_KEY,
        postgres_connection=POSTGRES_CONNECTION
    )


# Endpoint for budget chat
@app.post("/budget-chat", response_model=BudgetChatResponse)
async def budget_chat(
    request: BudgetChatRequest,
    planner: BudgetPlanner = Depends(get_budget_planner)
):
    """
    Process a budget-related chat message and generate a response
    
    Args:
        request: Chat message from the user
        planner: BudgetPlanner instance (injected by FastAPI)
        
    Returns:
        Response to the user's budget query
    """
    try:
        print(request)
        logger.info(f"Received budget chat: {request.message}")
        
        # Process the message
        response = planner.process_query(request.message)
        
        # Log successful processing
        logger.info("Budget chat processed successfully")
        
        # Return the response
        return BudgetChatResponse(response=response)
    except Exception as e:
        log_processing_error(str(e))
        raise HTTPException(status_code=500, detail=f"Error processing budget chat: {str(e)}")

# Endpoint to process receipt image
@app.post("/process-receipt", response_model=ReceiptResponse)
async def process_receipt_endpoint(
    file: UploadFile = File(...),
    processor: ReceiptProcessor = Depends(get_receipt_processor)
):
    """
    Process a receipt image and extract structured data.
    
    Args:
        file: Uploaded receipt image file
        processor: ReceiptProcessor instance (injected by FastAPI)
        
    Returns:
        Structured receipt data
    
    Raises:
        HTTPException: If processing fails
    """
    # Validate file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read the image file
        image_data = await file.read()
        
        # Log file information
        log_receipt_processing(file.filename, len(image_data))
        
        # Process the receipt
        receipt_data = processor.process_image(image_data, file.content_type)
        
        # Add current timestamp
        receipt_data["created_at"] = datetime.now().isoformat()
        
        # Validate required fields
        required_fields = ["merchant_name", "date", "items", "total", "category", "description"]
        for field in required_fields:
            if field not in receipt_data:
                log_missing_field(field)
                raise HTTPException(status_code=422, detail=f"Missing required field: {field}")
        
        # Log successful processing
        log_processing_success(
            receipt_data['merchant_name'], 
            receipt_data['total'],
            receipt_data['category']
        )
        
        # Return the processed data
        return receipt_data
    except Exception as e:
        log_processing_error(str(e))
        raise HTTPException(status_code=500, detail=f"Error processing receipt: {str(e)}")

# Create a simple index route
@app.get("/")
async def index():
    """Root endpoint that returns API information"""
    return {
        "name": "QuipQuid: Budget Planner",
        "version": "1.0.0",
        "documentation": "/docs",
        "health": "ok",
        "endpoints": [
            {
                "path": "/process-receipt",
                "method": "POST",
                "description": "Process a receipt image and extract structured data"
            },
            {
                "path": "/budget-chat",
                "method": "POST", 
                "description": "Chat with the budget planning assistant"
            }
        ]
    }

# Run the server when executed directly
if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("api:app", host=host, port=port, reload=True)