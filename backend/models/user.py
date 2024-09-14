from sqlalchemy import Column, Integer, String
from .database import Base

class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True)
    access_token = Column(String)
    refresh_token = Column(String)
    id_token = Column(String)
