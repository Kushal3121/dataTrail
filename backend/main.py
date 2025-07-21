from fastapi import FastAPI, File, UploadFile, HTTPException, Header
from fastapi.responses import JSONResponse
import os
import pandas as pd
from provenance_tracker import clean_data, log_transformation, load_provenance_log, compute_sha256
from utils.roles import authorize_action  # ✅ role check

app = FastAPI()

RAW_DIR = "data/raw"
PROCESSED_DIR = "data/processed"
os.makedirs(RAW_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    role: str = Header(..., convert_underscores=False)  # 🛡️ require role
):
    authorize_action(role, "upload")
    
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    file_path = os.path.join(RAW_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    return {"message": f"File '{file.filename}' uploaded successfully."}

@app.post("/transform")
async def transform_file(
    filename: str,
    role: str = Header(..., convert_underscores=False)
):
    authorize_action(role, "transform")

    file_path = os.path.join(RAW_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found.")
    df_clean = clean_data(file_path)
    log_entry = log_transformation("Cleaning", df_clean)
    processed_path = os.path.join(PROCESSED_DIR, filename)
    df_clean.to_csv(processed_path, index=False)
    return {"message": "Transformation complete.", "log_entry": log_entry}

@app.get("/verify")
async def verify_provenance(
    role: str = Header(..., convert_underscores=False)
):
    authorize_action(role, "verify")

    log = load_provenance_log()
    for i in range(1, len(log)):
        if log[i]["previous_hash"] != log[i - 1]["hash"]:
            return JSONResponse(status_code=400, content={
                "status": "Tampering detected",
                "step": log[i]["step"],
                "expected_hash": log[i - 1]["hash"],
                "found": log[i]["previous_hash"]
            })
    return {"status": "Provenance chain is valid"}

@app.get("/log")
async def get_provenance_log(
    role: str = Header(..., convert_underscores=False)
):
    authorize_action(role, "view")

    try:
        log = load_provenance_log()
        return {"provenance_log": log}
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="No provenance log found.")