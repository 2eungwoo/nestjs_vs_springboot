from fastapi import FastAPI
from pydantic import BaseModel
import hashlib

app = FastAPI()

class HashRequest(BaseModel):
    productName: str
    quantity: int
    price: int

@app.post("/hash")
def generate_hash(body: HashRequest):
    buffer = f"{body.productName}:{body.quantity}:{body.price}"
    digest = hashlib.sha256(buffer.encode()).hexdigest()
    return {"hash": digest}
