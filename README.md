# Verdandi

<p align="center">
<img align="center" width="150px" height="180px" src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Nornir_by_Lund.jpg"
</p>

<p style="text-align: justify;">Verdandi is a Node Schema and Component Definition JSON Editor for Yggdrail. <a href="https://github.com/world-in-progress/verdandi">https://github.com/world-in-progress/verdandi</a></p>


<p style="text-align: justify;">Verdandi, along with the other two Norns, weaves the web of fate at the roots of Yggdrasil, determining the destinies of both gods and humans. Yggdrasil is not only a physical connection but also a symbol of fate. As the Norn who presides over the “present,” Verdandi's duty is to ensure that the fate of the current moment unfolds correctly.</p>


## How to launch Verdandi

First, properly configure your MongoDB database in `main.py`.
```
client = MongoClient("mongodb://localhost:27017/") //Your MongoDB URL
db = client["test"] //Your MongoDB database name
nodeSchemaCollection = db["nodeSchema"] //Your Node Schema collection name
requestParamsCollection = db["requestParams"] //Your Request Params collection name
responseStatusCollection = db["responseStatus"] //Your Response Status collection name
```

Second, start the backend.
```
cd .\backend\
uvicorn main:app --reload
```

Finally, open a new terminal and start the frontend.
```
npm run dev
```

## Verdandi is still under developing...
