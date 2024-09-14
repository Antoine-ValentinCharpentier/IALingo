from fastapi import APIRouter, HTTPException, Request, Depends

from pydantic import BaseModel

import requests
import jwt

from sqlalchemy.orm import Session
from models.database import get_db
from models.user import UserModel

from middlewares.auth import JWTBearer

from config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_TOKEN_URL

router = APIRouter()

class TokenRequest(BaseModel):
    code: str

class TokenRefreshRequest(BaseModel):
    token: str
    
@router.post("/token")
def auth_callback(code: TokenRequest, db: Session = Depends(get_db)):
    token_data = {
        'code': code,
        'client_id': GOOGLE_CLIENT_ID,
        'client_secret': GOOGLE_CLIENT_SECRET,
        'redirect_uri': GOOGLE_REDIRECT_URI,
        'grant_type': 'authorization_code',
    }

    response = requests.post(GOOGLE_TOKEN_URL, data=token_data)
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to fetch token from Google")
    
    token_json = response.json()

    payload = jwt.decode(token_json['id_token'], options={"verify_signature": False})
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=400, detail="Invalid token from Google")
    
    user_id = payload['sub']
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    
    if user:
        user.access_token = token_json['access_token']
        user.refresh_token = token_json['refresh_token']
        user.id_token = token_json['id_token']
    else: 
        new_user = UserModel(
            user_id=user_id,
            access_token=token_json['access_token'],
            refresh_token=token_json['refresh_token'],
            id_token=token_json['id_token']
        )
        db.add(new_user)

    db.commit()
    
    data = {}
    data['accessToken'] = token_json['id_token']
    data['refreshToken'] = token_json['refresh_token']
    data['user'] = payload

    return {"message": "Tokens stored successfully", "data": data}

@router.post("/token/refresh")
def refresh_access_token(token : TokenRefreshRequest, db: Session = Depends(get_db)):
    refresh_token = token.token

    db_user = db.query(UserModel).filter(UserModel.refresh_token == refresh_token).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="No refresh token available")

    refresh_data = {
        'client_id': GOOGLE_CLIENT_ID,
        'client_secret': GOOGLE_CLIENT_SECRET,
        'refresh_token': refresh_token,
        'grant_type': 'refresh_token',
    }

    response = requests.post(GOOGLE_TOKEN_URL, data=refresh_data)

    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to refresh token")

    token_json = response.json()

    db_user.access_token = token_json['access_token']
    db_user.id_token = token_json['id_token']

    db.commit()

    data = {}
    data['accessToken'] = token_json['id_token']
    data['refreshToken'] = refresh_token
    data['user'] = jwt.decode(token_json['id_token'], options={"verify_signature": False})

    return {"message": "Access token refreshed", "data": data}


@router.post("/logout", dependencies=[Depends(JWTBearer())])
async def logout(request: Request, db: Session = Depends(get_db)):
    user_payload = request.state.user
    user_id = user_payload.get("sub") 

    if not user_id:
        raise HTTPException(status_code=400, detail="Invalid token payload")

    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.access_token = None
    user.refresh_token = None
    user.id_token = None

    db.add(user)
    db.commit()

    return {"message": "User successfully logged out"}

@router.get("/users")
async def get_all_users(db: Session = Depends(get_db)):
    users = db.query(UserModel).all() 
    return users