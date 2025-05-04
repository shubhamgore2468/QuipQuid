

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from schemas.billSplit import Bill, BillItem, SplitItemRequest, BillSplitModel, SplitBillItem

router = APIRouter()


@router.get("/split", response_model=BillSplitModel)
async def get_split_bill():
    '''
    Get the split bill details.
    '''
    # This would return the current bill with splitting information
    pass

@router.post('split_item', response_model=BillItem)
async def split_item(request: SplitItemRequest):
    '''    Split the bill item amongst users.'''
    amount_per_person = request.item.price * request.item.quantity / len(request.users)
    return SplitBillItem(
        name=request.item.name,
        price=request.item.price,
        quantity=request.item.quantity,
        split_between=request.users,
        amount_per_person=amount_per_person
    )