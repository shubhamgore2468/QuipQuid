from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.billSplit import router as split_bill_router

# Import all models before creating the app to ensure they're registered with SQLAlchemy
from app.db.postgresql import Base, engine
from app.models import User, Expense, Transaction

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

# Include routers
app.include_router(split_bill_router, prefix=settings.API_STR + "/split-bill", tags=["Bill Split"])

@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    try:
        # Create all tables if they don't exist
        Base.metadata.create_all(bind=engine)
        print("Database tables initialized successfully")
    except Exception as e:
        print(f"Error initializing database: {e}")
        raise

@app.get("/")
def read_root():
    return {"Hello": "World", "status": "Running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}