import requests
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()


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


# end def
