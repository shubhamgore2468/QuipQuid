import os
from typing import Dict, List, Optional, Any
from enum import Enum
import psycopg2
import psycopg2.extras
from pydantic import BaseModel

from langchain_core.prompts import ChatPromptTemplate
from langchain_anthropic import ChatAnthropic
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI

from logger import logger, log_processing_error, setup_logger

# Create a dedicated logger for budget planner
budget_logger = setup_logger("budget_planner")

# Define state for the budget planner graph
class RequestType(str, Enum):
    GET = "GET"
    POST = "POST"

class WhatType(str, Enum):
    READJUST_BUDGET = "Readjust budget"
    NEW_EXPENSE = "New Expense"
    CREATE_GOALS = "Create Goals"

class GraphState(BaseModel):
    prompt: str
    request_type: Optional[RequestType] = None
    get_data: Optional[bool] = None
    what_type: Optional[WhatType] = None
    sql_query: Optional[str] = None
    db_data: Optional[Any] = None
    response: Optional[str] = None
    generate_post: Optional[bool] = None

class BudgetPlanner:
    """Budget planning system using LangGraph and Claude"""
    
    def __init__(self, api_key: str, model_name: str = "gpt-4o", 
                postgres_connection: Optional[str] = None):
        """
        Initialize the budget planner
        
        Args:
            api_key: Anthropic API key
            model_name: Claude model name to use
            postgres_connection: PostgreSQL connection string
        """
        budget_logger.info("Initializing BudgetPlanner")
        self.model = ChatOpenAI(
            model="gpt-4o",  # or gpt-3.5-turbo
            temperature=0,
            openai_api_key=api_key  # use the correct variable name
        )
        self.api_key = api_key
        self.postgres_connection = postgres_connection
        
        budget_logger.info(f"Using Claude model: {model_name}")
        self.llm = ChatOpenAI(
            model=model_name,
            temperature=0,
            openai_api_key=api_key,
            max_tokens=1000
        )
        budget_logger.info("Creating workflow graph")
        self.workflow = self._create_workflow()
        budget_logger.info("BudgetPlanner initialization complete")
    
    def _determine_request_type(self, state: GraphState) -> Dict:
        """Determine if the request is GET or POST."""
        budget_logger.info("Determining request type")
        prompt_template = """
        Based on the following user prompt, determine if this is a "GET", meaning the user is asking some info regarding its account or data that can be present in the database
        or a "POST", meaning the user wants to log purchases, update or add budgets or goals.
        
        User prompt: {prompt}
        
        Respond with either "GET" or "POST".
        """
        
        prompt = ChatPromptTemplate.from_template(prompt_template)
        budget_logger.debug(f"Sending prompt to determine request type for: {state.prompt[:50]}...")
        response = self.llm.invoke(prompt.format(prompt=state.prompt))
        
        if "GET" in response.content:
            request_type = RequestType.GET
            budget_logger.info("Request type determined: GET")
        else:
            request_type = RequestType.POST
            budget_logger.info("Request type determined: POST")
            
        return {"request_type": request_type}

    def _determine_get_data(self, state: GraphState) -> Dict:
        """Determine if we need to get data for a GET request."""
        budget_logger.info("Determining if data retrieval is needed")
        prompt_template = """
        Based on the following user prompt for a GET request, determine if we need to query the database.
        
        User prompt: {prompt}
        
        Respond with either "Yes" or "No".
        """
        
        prompt = ChatPromptTemplate.from_template(prompt_template)
        response = self.llm.invoke(prompt.format(prompt=state.prompt))
        
        get_data = "Yes" in response.content
        budget_logger.info(f"Data retrieval decision: {get_data}")
        return {"get_data": get_data}

    def _determine_post_type(self, state: GraphState) -> Dict:
        """Determine what type of POST request this is."""
        budget_logger.info("Determining POST request type")
        prompt_template = """
        Based on the following user prompt for a POST request, determine what type of operation this is.
        
        User prompt: {prompt}
        
        Choose one of the following:
        - Readjust budget
        - New Expense
        - Create Goals
        
        Respond with just one of these options.
        """
        
        prompt = ChatPromptTemplate.from_template(prompt_template)
        response = self.llm.invoke(prompt.format(prompt=state.prompt))
        
        if "Readjust budget" in response.content:
            what_type = WhatType.READJUST_BUDGET
            budget_logger.info("POST type determined: Readjust budget")
        elif "New Expense" in response.content:
            what_type = WhatType.NEW_EXPENSE
            budget_logger.info("POST type determined: New Expense")
        else:
            what_type = WhatType.CREATE_GOALS
            budget_logger.info("POST type determined: Create Goals")
            
        return {"what_type": what_type}

    def _generate_sql_query(self, state: GraphState) -> Dict:
        """Generate an SQL query based on the request type and what type."""
        budget_logger.info(f"Generating SQL query for request type: {state.request_type}")
        if state.request_type == RequestType.GET:
            budget_logger.debug("Using GET query template")
            template = """
            Generate a PostgreSQL query to retrieve budget information based on the user's request.
            The database has the following tables:
            - users (id, email, hashed_password, full_name, is_active, created_at, updated_at, plaid_access_token)
            - budgets (id, expense_category, percentage, amount, start_date, end_date, created_at)
            - expenses (id, user_id, amount, description, category, input_type, merchant, date, created_at, raw_data, processed_text)
            - goals (id, name, target_amount, current_amount, deadline, created_at)
            
            User request: {prompt}
            use user_id = 1
                
            Return only the SQL query, nothing else. The ouput SQL query qould be directly executed in the database.
            """
        else:  # POST
            if state.what_type == WhatType.READJUST_BUDGET:
                budget_logger.debug("Using READJUST_BUDGET query template")
                template = """
                Generate a PostgreSQL query to update the budget based on the user's request.
                The database has the following tables:
                - users (id, email, hashed_password, full_name, is_active, created_at, updated_at, plaid_access_token)
                - budgets (id, expense_category, percentage, amount, start_date, end_date, created_at)
                - expenses (id, user_id, amount, description, category, input_type, merchant, date, created_at, raw_data, processed_text)
                - goals (id, name, target_amount, current_amount, deadline, created_at)
                
                User request: {prompt}
                use user_id = 1
                
                Return only the SQL query, nothing else. The ouput SQL query qould be directly executed in the database.
                """
            elif state.what_type == WhatType.NEW_EXPENSE:
                budget_logger.debug("Using NEW_EXPENSE query template")
                template = """
                Generate a PostgreSQL query to add a new expense based on the user's request.
                The database has the following tables:
                - users (id, email, hashed_password, full_name, is_active, created_at, updated_at, plaid_access_token)
                - budgets (id, expense_category, percentage, amount, start_date, end_date, created_at)
                - expenses (id, user_id, amount, description, category, input_type, merchant, date, created_at, raw_data, processed_text)
                - goals (id, name, target_amount, current_amount, deadline, created_at)
                
                Note that the expense category should be one of: food, transportation, housing, utilities, entertainment, 
                healthcare, shopping, education, personal, savings, investments, other.
                
                The input_type should be one of: text, audio, image, plaid.
                
                User request: {prompt}
                use user_id = 1
                
                Return only the SQL query, nothing else. The ouput SQL query qould be directly executed in the database.
                """
            else:  # CREATE_GOALS
                budget_logger.debug("Using CREATE_GOALS query template")
                template = """
                Generate a PostgreSQL query to add new budget goals based on the user's request.
                The database has the following tables:
                - users (id, email, hashed_password, full_name, is_active, created_at, updated_at, plaid_access_token)
                - budgets (id, expense_category, percentage, amount, start_date, end_date, created_at)
                - expenses (id, user_id, amount, description, category, input_type, merchant, date, created_at, raw_data, processed_text)
                - goals (id, name, target_amount, current_amount, deadline, created_at)
                
                User request: {prompt}
                use user_id = 1
                
                Return only the SQL query, nothing else. The ouput SQL query qould be directly executed in the database.
                """
        
        prompt = ChatPromptTemplate.from_template(template)
        response = self.llm.invoke(prompt.format(prompt=state.prompt))
        
        sql_query = response.content.strip()
        budget_logger.info("SQL query generated")
        budget_logger.info(f"Generated SQL query: {sql_query}")
        return {"sql_query": sql_query}

    def _get_data_from_db(self, state: GraphState) -> Dict:
        """Execute the SQL query and get data from the database."""
        budget_logger.info("Executing SQL query against database")
        if not self.postgres_connection:
            budget_logger.error("No PostgreSQL connection string provided")
            return {"db_data": {"error": "Database connection not configured"}}
            
        try:
            budget_logger.debug("Establishing database connection")
            conn = psycopg2.connect(self.postgres_connection)
            cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
            
            try:
                budget_logger.debug(f"Executing query: {state.sql_query}")
                cursor.execute(state.sql_query)
                if state.request_type == RequestType.GET:
                    budget_logger.debug("Fetching results for GET request")
                    data = cursor.fetchall()
                    # Convert DictRow objects to regular dictionaries
                    db_data = [dict(row) for row in data]
                    budget_logger.info(f"Retrieved {len(db_data)} rows from database")
                else:  # POST
                    budget_logger.debug("Committing transaction for POST request")
                    conn.commit()
                    db_data = {"success": True, "rows_affected": cursor.rowcount}
                    budget_logger.info(f"POST operation affected {cursor.rowcount} rows")
            except Exception as e:
                log_processing_error(f"Database error: {str(e)}")
                budget_logger.error(f"Error executing SQL query: {str(e)}")
                db_data = {"error": str(e)}
            finally:
                budget_logger.debug("Closing database cursor and connection")
                cursor.close()
                conn.close()
        except Exception as e:
            log_processing_error(f"Failed to connect to database: {str(e)}")
            budget_logger.error(f"Database connection error: {str(e)}")
            db_data = {"error": f"Connection error: {str(e)}"}
        
        return {"db_data": db_data}

    def _determine_generate_post(self, state: GraphState) -> Dict:
        """Determine if we need to generate a POST after getting data."""
        budget_logger.info("Determining if POST generation is needed after data retrieval")
        if state.request_type == RequestType.GET:
            prompt_template = """
            Based on the user's request and the data we retrieved, determine if we need to generate a POST request.
            
            User request: {prompt}
            Retrieved data: {db_data}
            
            Respond with either "POST" or "Response".
            """
            
            prompt = ChatPromptTemplate.from_template(prompt_template)
            response = self.llm.invoke(prompt.format(prompt=state.prompt, db_data=state.db_data))
            
            generate_post = "POST" in response.content
            budget_logger.info(f"Decision to generate POST: {generate_post}")
        else:
            generate_post = False
            budget_logger.info("No need to determine POST generation for a POST request")
            
        return {"generate_post": generate_post}

    def _create_query(self, state: GraphState) -> Dict:
        """Create a query based on the data we retrieved."""
        budget_logger.info("Creating new query based on retrieved data")
        prompt_template = """
        Create a new query based on the user's original request and the data we retrieved.
        
        User request: {prompt}
        Retrieved data: {db_data}
        
        Generate a new query that will help fulfill the user's request.
        """
        
        prompt = ChatPromptTemplate.from_template(prompt_template)
        response = self.llm.invoke(prompt.format(prompt=state.prompt, db_data=state.db_data))
        
        new_prompt = response.content.strip()
        budget_logger.info("Created new query")
        budget_logger.debug(f"New query: {new_prompt[:50]}...")
        return {"prompt": new_prompt}

    def _generate_response(self, state: GraphState) -> Dict:
        """Generate a response to the user."""
        budget_logger.info("Generating response to user")
        if state.request_type == RequestType.GET:
            budget_logger.debug("Using GET response template")
            template = """
            You are a budget planning assistant chatbot for a mobile app. Create a short response to the user
            based on the data retrieved from the database.
            
            User request: {prompt}
            Data from database: {db_data}
            
            Format the response in a clear and concise way. If there are any visualizations or tables that would be helpful,
            describe how they should be formatted.
            """
        else:  # POST
            budget_logger.debug("Using POST response template")
            template = """
            You are a budget planning assistant chatbot for a mobile app. 
            Generate a short confirmation response for the user, based on the users prompt, saying that it was successful.
            
            User request: {prompt}
            Result of operation: {db_data}
            
            Confirm what was done and provide any relevant feedback.
            """
        
        prompt = ChatPromptTemplate.from_template(template)
        response = self.llm.invoke(prompt.format(prompt=state.prompt, db_data=state.db_data))
        
        user_response = response.content.strip()
        budget_logger.info("Response generated successfully")
        return {"response": user_response}

    def _should_get_data(self, state: GraphState) -> str:
        """Conditional routing for get_data decision"""
        route = "get_data_true" if state.get_data else "get_data_false"
        budget_logger.info(f"Routing based on get_data: {route}")
        return route

    def _what_type_router(self, state: GraphState) -> str:
        """Conditional routing for what_type decision"""
        if state.what_type == WhatType.READJUST_BUDGET:
            route = "readjust_budget"
        elif state.what_type == WhatType.NEW_EXPENSE:
            route = "new_expense"
        else:
            route = "create_goals"
        budget_logger.info(f"Routing based on what_type: {route}")
        return route

    def _post_or_response(self, state: GraphState) -> str:
        """Conditional routing for post_or_response decision"""
        route = "generate_post" if state.generate_post else "generate_response"
        budget_logger.info(f"Routing based on generate_post: {route}")
        return route

    def _create_workflow(self):
        """Create the LangGraph workflow for budget planning"""
        budget_logger.info("Creating LangGraph workflow")
        # Build the graph
        workflow = StateGraph(GraphState)

        # Add nodes
        budget_logger.debug("Adding nodes to workflow graph")
        workflow.add_node("determine_request_type", self._determine_request_type)
        workflow.add_node("determine_get_data", self._determine_get_data)
        workflow.add_node("determine_post_type", self._determine_post_type)
        workflow.add_node("generate_sql_query_get", self._generate_sql_query)
        workflow.add_node("generate_sql_query_readjust", self._generate_sql_query)
        workflow.add_node("generate_sql_query_new_expense", self._generate_sql_query)
        workflow.add_node("generate_sql_query_goals", self._generate_sql_query)
        workflow.add_node("get_data_from_db", self._get_data_from_db)
        workflow.add_node("determine_generate_post", self._determine_generate_post)
        workflow.add_node("create_query", self._create_query)
        workflow.add_node("generate_response", self._generate_response)

        # Add edges
        budget_logger.debug("Adding edges to workflow graph")
        # For GET request
        workflow.add_conditional_edges(
            "determine_request_type",
            lambda state: state.request_type == RequestType.GET,
            {True: "determine_get_data", False: "determine_post_type"}
        )

        # For determining whether to get data
        workflow.add_conditional_edges(
            "determine_get_data",
            self._should_get_data,
            {"get_data_true": "generate_sql_query_get", "get_data_false": END}
        )

        # For handling different POST types
        workflow.add_conditional_edges(
            "determine_post_type",
            self._what_type_router,
            {
                "readjust_budget": "generate_sql_query_readjust",
                "new_expense": "generate_sql_query_new_expense",
                "create_goals": "generate_sql_query_goals"
            }
        )

        # For database operations
        workflow.add_edge("generate_sql_query_get", "get_data_from_db")
        workflow.add_edge("generate_sql_query_readjust", "get_data_from_db")
        workflow.add_edge("generate_sql_query_new_expense", "get_data_from_db")
        workflow.add_edge("generate_sql_query_goals", "get_data_from_db")

        # For handling database results based on request type
        workflow.add_conditional_edges(
            "get_data_from_db",
            lambda state: state.request_type == RequestType.GET,
            {True: "determine_generate_post", False: "generate_response"}
        )

        # For deciding whether to create a new query or generate response
        workflow.add_conditional_edges(
            "determine_generate_post",
            self._post_or_response,
            {"generate_post": "create_query", "generate_response": "generate_response"}
        )

        # Complete the loop or end
        workflow.add_edge("create_query", "determine_request_type")
        workflow.add_edge("generate_response", END)

        # Set the entry point
        workflow.set_entry_point("determine_request_type")

        # Compile the graph
        budget_logger.info("Compiling workflow graph")
        return workflow.compile()

    def process_query(self, user_query: str) -> str:
        """
        Process a user query through the budget planning system
        
        Args:
            user_query: The user's budget-related query
            
        Returns:
            Response to the user's query
        """
        budget_logger.info(f"Processing budget query: {user_query[:50]}...")
        
        try:
            budget_logger.debug("Invoking workflow with user query")
            result = self.workflow.invoke({"prompt": user_query})
            budget_logger.info("Budget query processed successfully")
            print(f"Result: {result}")
            return result['response']
        except Exception as e:
            error_msg = f"Error processing budget query: {str(e)}"
            log_processing_error(error_msg)
            budget_logger.error(error_msg, exc_info=True)
            return f"Error processing your request: {str(e)}"