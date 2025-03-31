from fastapi import FastAPI, Request
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
nodeSchemaCollection = db["nodeSchema"]
requestParamsCollection = db["requestParams"]
responseStatusCollection = db["responseStatus"]

def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc

@app.get("/items")
async def get_items():
    items = list(nodeSchemaCollection.find())
    return {"data": [serialize_doc(item) for item in items]}

@app.get("/items/{item_id}")
async def get_item(item_id: str):
    item = nodeSchemaCollection.find_one({"_id": ObjectId(item_id)})
    if item:
        return {"data": serialize_doc(item)}
    return {"error": "Item not found"}

@app.get("/node-types")
async def get_nodeTypes():
    node_types = list(nodeSchemaCollection.find())
    return {"data": [serialize_doc(item) for item in node_types]}

@app.get("/request-params")
async def get_requestParams():
    params = list(requestParamsCollection.find())
    return {"data": [serialize_doc(param) for param in params]}

@app.post("/request-params")
async def create_requestParam(request: Request):
    try:
        param_data = await request.json()
        result = requestParamsCollection.insert_one(param_data)
        return {"success": True, "id": str(result.inserted_id)}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/response-status")
async def get_responseStatus():
    status = list(responseStatusCollection.find())
    return {"data": [serialize_doc(status) for status in status]}

# 启动服务：uvicorn main:app --reload
