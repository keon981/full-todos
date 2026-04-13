from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    username: str = Field(max_length=255, unique=True)


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str = Field(max_length=255)
