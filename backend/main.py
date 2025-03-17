from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient("mongodb://localhost:27017/")
db = client["test"] 
collection = db["test"]

def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc

@app.get("/items")
async def get_items():
    items = list(collection.find())
    return {"data": [serialize_doc(item) for item in items]}

@app.get("/items/{item_id}")
async def get_item(item_id: str):
    item = collection.find_one({"_id": ObjectId(item_id)})
    if item:
        return {"data": serialize_doc(item)}
    return {"error": "Item not found"}

@app.get("/node-types")
async def get_node_types():
    node_types = list(collection.find())
    return {"data": [serialize_doc(item) for item in node_types]}

# 启动服务：uvicorn main:app --reload
