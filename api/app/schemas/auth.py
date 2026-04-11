from app.database.models.auth import UserBase
from sqlmodel import Field


# 登入和註冊
class UserRequest(UserBase):
    password: str = Field(min_length=6)
