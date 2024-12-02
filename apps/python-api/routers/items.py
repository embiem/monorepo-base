from fastapi import APIRouter
from models.item import Item

router = APIRouter()

@router.get("/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}

@router.post("/")
def create_item(item: Item):
    return item