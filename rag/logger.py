import logging
import os
from datetime import datetime

# Create logs directory if it doesn't exist
os.makedirs("logs", exist_ok=True)

# Generate log filename with timestamp
log_filename = f"logs/receipt_processor_{datetime.now().strftime('%Y%m%d')}.log"

def setup_logger(name=__name__):
    """
    Set up and configure a logger instance with file and console handlers.
    
    Args:
        name: The name of the logger (default: module name)
        
    Returns:
        A configured logger instance
    """
    # Configure the logger
    logger = logging.getLogger(name)
    
    # Only add handlers if they don't exist
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        
        # Create formatter
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        
        # File handler for persistent logs
        file_handler = logging.FileHandler(log_filename)
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(formatter)
        
        # Console handler for immediate feedback
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        console_handler.setFormatter(formatter)
        
        # Add handlers to logger
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)
    
    return logger

# Create a default logger
logger = setup_logger("receipt_processor")

def log_receipt_processing(receipt_file, size_bytes):
    """Log information about a receipt being processed"""
    logger.info(f"Processing receipt: {receipt_file}, Size: {size_bytes} bytes")

def log_processing_success(merchant, total, category):
    """Log successful receipt processing"""
    logger.info(f"Successfully processed receipt from {merchant} with total: {total} in category: {category}")

def log_processing_error(error_message):
    """Log receipt processing error"""
    logger.error(f"Error processing receipt: {error_message}")

def log_missing_field(field_name):
    """Log missing required field in response"""
    logger.error(f"Missing required field in Claude response: {field_name}")