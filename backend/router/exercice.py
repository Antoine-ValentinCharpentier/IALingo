from fastapi import APIRouter, Request

router = APIRouter()

@router.get("")
async def get_exercise(request: Request):
    user_payload = getattr(request.state, "user", None)
    return user_payload