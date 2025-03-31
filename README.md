# Verdandi

<p align="center">
<img align="center" width="150px" height="180px" src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Nornir_by_Lund.jpg" alt="Verdandi Logo" />
</p>

## Overview

Verdandi is a Node Schema and Component Definition JSON Editor for Yggdrail. It provides powerful tools for managing and editing node schemas and component definitions.

<p><a href="https://github.com/world-in-progress/yggdrasil">https://github.com/world-in-progress/yggdrasil</a></p>

> In Norse mythology, Verdandi is one of the three Norns who weaves the web of fate at the roots of Yggdrasil, determining the destinies of both gods and humans. As the Norn who presides over the "present," Verdandi's duty is to ensure that the fate of the current moment unfolds correctly.

## Quick Start

### 1. Database Configuration

Configure your MongoDB database in `main.py`:

```python
client = MongoClient("mongodb://localhost:27017/")  # Your MongoDB URL
db = client["test"]                                 # Your MongoDB database name
nodeSchemaCollection = db["nodeSchema"]             # Your Node Schema collection name
requestParamsCollection = db["requestParams"]       # Your Request Params collection name
responseStatusCollection = db["responseStatus"]     # Your Response Status collection name
```

### 2. Start Backend

```bash
cd ./backend/
uvicorn main:app --reload
```

### 3. Start Frontend

```bash
npm run dev
```

## Verdandi is still under developing...
