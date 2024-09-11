from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.responses import JSONResponse

import os
import jwt
import requests
import base64

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa


def get_jwks_from_google():
    return requests.get("https://www.googleapis.com/oauth2/v3/certs").json()["keys"]

def get_jwk_from_jwks(jwks, key_id) :
    public_key = None
    for key in jwks:
        if key["kid"] == key_id:
            public_key = jwk_to_pem(key)
            break  
    return public_key
  
def jwk_to_pem(jwk):
    n = int.from_bytes(base64.urlsafe_b64decode(jwk['n'] + '=='), byteorder='big')
    e = int.from_bytes(base64.urlsafe_b64decode(jwk['e'] + '=='), byteorder='big')

    public_key = rsa.RSAPublicNumbers(e=e, n=n).public_key()

    pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    
    return pem

security = HTTPBearer()

google_public_keys = get_jwks_from_google()

async def has_access(request: Request, credentials: HTTPAuthorizationCredentials= Depends(security)):
    token = credentials.credentials
    if not token :
        return JSONResponse(content={"detail": "Authentification required"}, status_code=403)
  
    try:
        unverified_header = jwt.get_unverified_header(token)
        key_id = unverified_header.get("kid")
        
        public_key = get_jwk_from_jwks(google_public_keys, key_id)
        if public_key is None:
            raise jwt.ExpiredSignatureError
        
        payload = jwt.decode(
            token, 
            public_key, 
            algorithms=["RS256"], 
            audience=os.getenv("GOOGLE_CLIENT_ID", "")
        )

        request.state.user = payload
        
    except jwt.ExpiredSignatureError:
        return JSONResponse(content={"detail": "Token expired"}, status_code=401)
    except jwt.PyJWTError:
        return JSONResponse(content={"detail": "Invalid token"}, status_code=401) 