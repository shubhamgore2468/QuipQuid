import json
import base64
from typing import List, Dict, Any, TypedDict, Annotated
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage, AIMessage
from langgraph.graph import StateGraph, add_messages
from logger import logger, log_processing_error

class State(TypedDict):
    """State schema for the receipt processing workflow"""
    messages: Annotated[List[Any], add_messages]
    receipt_data: Dict[str, Any]

class ReceiptProcessor:
    """Handles receipt processing with LangGraph and Anthropic Claude"""
    
    def __init__(self, api_key: str, model_name: str = "claude-3-7-sonnet-20250219"):
        """
        Initialize the receipt processor
        
        Args:
            api_key: Anthropic API key
            model_name: Claude model name to use
        """
        self.model = ChatAnthropic(
            model=model_name,
            temperature=0,
            anthropic_api_key=api_key,
            max_tokens=1000
        )
        self.workflow = self._create_workflow()
    
    def _process_receipt(self, state: State) -> Dict[str, Any]:
        """
        Process the receipt image using Claude's vision capabilities
        
        Args:
            state: Current state containing messages and receipt data
            
        Returns:
            Updated state with Claude's response and parsed receipt data
        """
        try:
            response = self.model.invoke(state["messages"])
            
            # Try to parse the response as JSON
            try:
                json_start = response.content.find('{')
                json_end = response.content.rfind('}') + 1
                if json_start >= 0 and json_end > json_start:
                    json_str = response.content[json_start:json_end]
                    receipt_data = json.loads(json_str)
                else:
                    # Fallback: assume the entire response might be JSON
                    receipt_data = json.loads(response.content)
            except json.JSONDecodeError as e:
                log_processing_error(f"Failed to parse response as JSON: {str(e)}")
                receipt_data = {
                    "error": "Failed to parse response as JSON",
                    "raw_response": response.content
                }
            
            return {
                "messages": [AIMessage(content=response.content)],
                "receipt_data": receipt_data
            }
        except Exception as e:
            log_processing_error(f"Error in receipt processing: {str(e)}")
            raise
    
    def _create_workflow(self):
        """
        Create the LangGraph workflow for receipt processing
        
        Returns:
            Compiled LangGraph workflow
        """
        # Create the graph
        workflow = StateGraph(State)
        
        # Add the processing node
        workflow.add_node("process_receipt", self._process_receipt)
        
        # Define the edges - simple linear flow in this case
        workflow.set_entry_point("process_receipt")
        workflow.set_finish_point("process_receipt")
        
        # Compile the graph
        return workflow.compile()
    
    def process_image(self, image_data: bytes, content_type: str) -> Dict[str, Any]:
        """
        Process a receipt image and extract structured data
        
        Args:
            image_data: Raw image bytes
            content_type: MIME type of the image
            
        Returns:
            Structured receipt data
        """
        try:
            # Encode the image to base64
            base64_image = base64.b64encode(image_data).decode("utf-8")
            
            # Construct the prompt with the image
            prompt = [
                HumanMessage(
                    content=[
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": content_type,
                                "data": base64_image
                            }
                        },
                        {
                            "type": "text",
                            "text": """
                            Analyze this receipt image and extract the following information in JSON format:
                            
                            1. merchant_name: The name of the store or business
                            2. date: The date of the transaction (in YYYY-MM-DD format)
                            3. items: An array of items purchased, each with:
                               - name: The name of the item
                               - price: The price of the item (as a float)
                               - quantity: The quantity purchased (if available, default to 1)
                            4. total: The total bill amount (as a float)
                            5. category: The expense category, which must be ONE of the following values:
                               "food", "transportation", "housing", "utilities", "entertainment", 
                               "healthcare", "shopping", "education", "personal", "savings", 
                               "investments", "other"
                            6. description: A brief description of what kind of bill this is (e.g., "Lunch at Chipotle", "Monthly gym membership", "Groceries at Whole Foods")
                            
                            Return ONLY the JSON object with no explanations before or after.
                            """
                        }
                    ]
                )
            ]
            
            # Initialize state with the prompt
            initial_state = {
                "messages": prompt,
                "receipt_data": {}
            }
            
            # Execute the workflow
            logger.info("Sending receipt to Claude for processing")
            result = self.workflow.invoke(initial_state)
            
            # Return the receipt data
            return result["receipt_data"]
        except Exception as e:
            log_processing_error(str(e))
            raise