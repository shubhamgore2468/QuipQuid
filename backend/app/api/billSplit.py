from uuid import UUID
from fastapi import APIRouter, Depends, Query, HTTPException
from app.schemas.billSplit import SplitItemRequest, BillSplitModel, SplitBillItem
from app.schemas.transaction import UserTransactionSummary
from app.db.postgresql import get_db
from datetime import datetime
from sqlalchemy.orm import Session

# Import through the centralized models module
from app.models import Transaction

router = APIRouter()

@router.get("/split", response_model=BillSplitModel)
async def get_split_bill():
    '''
    Get the split bill details.
    '''
    # This would return the current bill with splitting information
    pass


@router.post('/split_item', response_model=SplitBillItem)
async def split_item(request: SplitItemRequest, db: Session = Depends(get_db)):
    '''
    Split the bill item amongst users.
    Add the individual item split to the transactions table
    and then return the split item details.
    '''
    try:
        # Calculate amount per person
        amount_per_person = (request.item.price * request.item.quantity) / len(request.users)
        
        # Create transactions for each user
        for user_id in request.users:
            transaction = Transaction(
                bill_id=request.bill_id,
                user_id=user_id,
                item_name=request.item.name,
                amount=amount_per_person,
                merchant_name=request.merchant_name,
                category=request.item.category,
                transaction_date=request.date or datetime.utcnow(),
            )
            
            db.add(transaction)
        
        # Commit all transactions
        db.commit()
        
        # Create and return the response
        split_item = SplitBillItem(
            category=request.item.category,
            name=request.item.name,
            price=request.item.price,
            quantity=request.item.quantity,
            split_between=[str(user_id) for user_id in request.users],
            amount_per_person=amount_per_person
        )
        
        return split_item
        
    except Exception as err:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(err))


@router.get("/user-transactions/", response_model=UserTransactionSummary)
async def get_user_transactions(
    user_id: int = Query(..., description="User ID"),
    bill_id: UUID = Query(..., description="Bill ID"),
    db: Session = Depends(get_db)
):
    """
    Get the total split amount for each user.
    """
    # Query transactions
    transaction_query = db.query(Transaction).filter(
        Transaction.user_id == user_id,
        Transaction.bill_id == bill_id
    ).all()
    
    # Calculate totals
    total_amount = sum(t.amount for t in transaction_query)
    
    # Create the response
    user_summary = UserTransactionSummary(
        user_id=user_id,
        bill_id=bill_id,
        total_amount=total_amount,
        transaction_count=len(transaction_query),
        transactions=transaction_query
    )
    
    return user_summary