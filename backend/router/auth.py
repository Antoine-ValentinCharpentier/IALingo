from fastapi import APIRouter, HTTPException, Request, Depends, status

from pydantic import BaseModel

import requests
import jwt

from sqlalchemy.orm import Session
from models.database import get_db
from models.database import UserModel

from middlewares.auth import JWTBearer

from services.auth import get_user_by_email, get_password_hash, verify_password, create_tokens, verify_jwt_token
from config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_TOKEN_URL

router = APIRouter()

class TokenRequest(BaseModel):
    code: str

class TokenRefreshRequest(BaseModel):
    token: str

class UserRegister(BaseModel):
    username: str
    email: str
    password: str
        
class UserLogin(BaseModel):
    email: str
    password: str
            
@router.post("/local/register", status_code=status.HTTP_201_CREATED)
def register(user: UserRegister, db: Session = Depends(get_db)):
    
    db_user = get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    
    new_user = UserModel(
            sub="",
            username=user.username,
            email=user.email,
            hashed_password=hashed_password,
            refresh_token="",
            from_google=False
        )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User registered successfully"}

@router.post("/local/login")
def login(body: UserLogin, db: Session = Depends(get_db)):
    
    user = get_user_by_email(db, body.email)
    
    if user and user.from_google == True:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please login with Google !"
        )
    elif not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect pseudo or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token, refresh_token = create_tokens(user.id)
    
    data = {}
    data['accessToken'] = access_token
    data['refreshToken'] = refresh_token
    data['user'] = user

    return {"message": "Tokens stored successfully", "data": data}
    
@router.post("/google/login")
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
    user = db.query(UserModel).filter(UserModel.sub == user_id).first()
        
    if not user:
        user = UserModel(
            sub=user_id,
            username=payload['name'],
            email=payload['email'],
            hashed_password="",
            refresh_token="",
            from_google=True
        )
        db.add(user)
        db.commit()
    else:
        if user.from_google == False:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Please use the local login !"
            )
    
    access_token, refresh_token = create_tokens(user.id)
    
    user.refresh_token = refresh_token
    db.commit()
    
    data = {}
    data['accessToken'] = access_token
    data['refreshToken'] = refresh_token
    data['user'] = user

    return {"message": "Tokens stored successfully", "data": data}

@router.post("/token/refresh")
def refresh_access_token(token : TokenRefreshRequest, db: Session = Depends(get_db)):
    refresh_token = token.token
    
    payload = verify_jwt_token(refresh_token)

    db_user = db.query(UserModel).filter(UserModel.id == payload['sub']).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="No refresh token available")
    
    if db_user.refresh_token is None:
        raise HTTPException(status_code=400, detail="No refresh token available")

    access_token, refresh_token = create_tokens(db_user.id)

    db_user.refresh_token = refresh_token

    db.commit()

    data = {}
    data['accessToken'] = access_token
    data['refreshToken'] = refresh_token
    data['user'] = db_user

    return {"message": "Access token refreshed", "data": data}


@router.post("/logout", dependencies=[Depends(JWTBearer())])
async def logout(request: Request, db: Session = Depends(get_db)):
    user_payload = request.state.user
    user_id = user_payload.get("sub") 

    if not user_id:
        raise HTTPException(status_code=400, detail="Invalid token payload")

    user = db.query(UserModel).filter(UserModel.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.refresh_token = None

    db.add(user)
    db.commit()

    return {"message": "User successfully logged out"}

@router.get("/users")
async def get_all_users(db: Session = Depends(get_db)):
    users = db.query(UserModel).all() 
    return users