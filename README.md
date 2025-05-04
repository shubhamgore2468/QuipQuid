# QuipQuid: Budget Planner App

An intelligent, conversational budget planning application that helps users track expenses, manage budgets, and get financial insights through natural language interactions.

## Project Overview

This budget planner application uses advanced RAG (Retrieval-Augmented Generation) techniques to provide a seamless, conversation-based financial management experience. Users can interact with the app through text, or by uploading images of receipts, making expense tracking and splitting effortless and intuitive.


### Installation

1. Clone the repository
```bash
git clone https://github.com/shubhamgore2468/QuipQuid
cd quip-quid
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend
npm install

# Install RAG dependencies
cd ../rag
pip install -r requirements.txt
```

3. Configure environment variables
```bash
# Create .env files in each directory following the .env.example templates
```

4. Start development servers
```bash
# Start rag server
cd ../rag
python3 app.py

# Start backend server
cd ../backend
python3 app.py

# Start frontend development server
cd ../frontend
npm run dev
```

## Development Workflow

1. RAG workflows and endpoints are defined in the `rag/` directory
2. API endpoints are implemented in the `backend/` directory
3. User interface components are built in the `frontend/` directory
4. Integration tests ensure proper communication between all systems