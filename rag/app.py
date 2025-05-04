import os
import uvicorn
from dotenv import load_dotenv
from logger import logger

# Load environment variables
load_dotenv()

# This is the main entry point for the application
if __name__ == "__main__":
    # Check for environment variables
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        logger.error("ANTHROPIC_API_KEY environment variable is not set")
        print("Error: ANTHROPIC_API_KEY environment variable is not set")
        exit(1)
    
    # Get configuration from environment or use defaults
    port = 8000
    host = "0.0.0.0"
    reload = True
    
    # Log startup information
    logger.info(f"Starting Receipt Processor API on {host}:{port}")
    logger.info(f"Auto-reload is {'enabled' if reload else 'disabled'}")
    
    # Run the FastAPI application
    uvicorn.run("api:app", host=host, port=port, reload=reload)