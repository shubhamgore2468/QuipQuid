
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.schemas.goal import Goal
# from app.schemas.transaction import User
router = APIRouter()

@router.post("/add_goal")
async def add_goal():
    """
    Add a goal.
    """

    # This would add a goal to the database
    pass

@router.get("/get_goal", response_model=Goal)
# async def get_goal(request: User):
#     """
#     Get the goal.
#     """
    
#     # This would return the current goal
#     pass

@router.put("/update_goal")
async def update_goal():
    """
    Update the goal.
    """
    # This would update the goal in the database
    pass
@router.delete("/delete_goal")
async def delete_goal():
    """
    Delete the goal.
    """
    # This would delete the goal from the database
    pass