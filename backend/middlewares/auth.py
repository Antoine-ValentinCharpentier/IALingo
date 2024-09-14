from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

import jwt
import requests
import base64

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa

from config import GOOGLE_CLIENT_ID

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)
        self.google_jwks = requests.get("https://www.googleapis.com/oauth2/v3/certs").json()["keys"]

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
            
            access_token = credentials.credentials
            payload = self.verify_jwt(access_token)
            
            request.state.user = payload
            
            return payload
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")

    def verify_jwt(self, token: str) -> bool:
        payload = None
        
        unverified_header = jwt.get_unverified_header(token)
        key_id = unverified_header.get("kid")
        
        public_key = self.get_jwk_from_jwks(key_id)
        if public_key is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        try:
            payload = jwt.decode(
                token, 
                public_key, 
                algorithms=["RS256"], 
                audience=GOOGLE_CLIENT_ID
            )
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expired")
        except :
            raise HTTPException(status_code=401, detail="Invalid token")

        return payload

    def get_jwk_from_jwks(self, key_id) :
        public_key = None
        for key in self.google_jwks:
            if key["kid"] == key_id:
                public_key = self.jwk_to_pem(key)
                break  
        return public_key
    
    def jwk_to_pem(self, jwk):
        n = int.from_bytes(base64.urlsafe_b64decode(jwk['n'] + '=='), byteorder='big')
        e = int.from_bytes(base64.urlsafe_b64decode(jwk['e'] + '=='), byteorder='big')

        public_key = rsa.RSAPublicNumbers(e=e, n=n).public_key()

        pem = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        
        return pem