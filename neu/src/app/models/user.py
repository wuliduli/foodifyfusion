from pydantic import BaseModel, EmailStr
from typing import List

class UserIn(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    email: EmailStr

class CustomFilterAddRequest(BaseModel):
    name: str
    values: List[str]