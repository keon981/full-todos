from contextlib import asynccontextmanager

import requests
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlmodel import Session, select

from app.config import get_settings
from app.database.db import create_table, engine
from app.routers import todos


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_table()
    yield


app = FastAPI(lifespan=lifespan)

settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)

app.include_router(todos.router, prefix="/todos", tags=["todos"])


@app.get("/")
async def root():
    return {"message": "Hallo API!"}


def get_ip_address():
    try:
        # comment:
        ip = requests.get("https://api.ipify.org").text
        return ip
    except requests.RequestException as e:
        return f"Error occurred: {e}"


@app.get("/ip")
async def get_client_ip(request: Request):
    client_host = request.client.host if request.client else None
    return JSONResponse(content={"ip": get_ip_address(), "ll": "ㄋㄋ"})


@app.get("/health")
def health():
    with Session(engine) as session:
        session.exec(select(1))
        return {"status": "healthy"}
