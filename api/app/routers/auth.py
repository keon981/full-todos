from app.database.db import SessionDep
from app.schemas.auth import UserRequest
from fastapi import APIRouter
from pwdlib import PasswordHash

router = APIRouter()
password_hash = PasswordHash.recommended()
DUMMY_HASH = password_hash.hash("dummypassword")


# 登出
@router.delete("/")
def logout():
    pass


def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)


# 登入
@router.post("/login")
def login(
    session: SessionDep,
    user: UserRequest,
):
    pass


# 註冊
@router.post("/register")
def register():
    pass
