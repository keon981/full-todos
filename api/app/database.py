from sqlmodel import Session, SQLModel, create_engine

DATABASE_URL = "postgresql+psycopg://root:123456@localhost:5555/todos_db"

engine = create_engine(DATABASE_URL)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
