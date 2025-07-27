from fastapi import FastAPI, File, UploadFile, HTTPException, Header
from fastapi.responses import JSONResponse
import os
import pandas as pd
from provenance_tracker import clean_data, log_transformation, load_provenance_log, compute_sha256, normalize_data, aggregate_data
from utils.roles import authorize_action
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    df = pd.read_csv(file_path)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    log_transformation("Upload", df)
    return {"message": f"File '{file.filename}' uploaded successfully."}

@app.get("/raw-files")
async def list_raw_files(
    role: str = Header(..., convert_underscores=False)
):
    authorize_action(role, "view")

    try:
        files = [f for f in os.listdir(RAW_DIR) if f.endswith('.csv')]
        return {"files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
    log_transformation("Verification", pd.DataFrame()) 
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

@app.post("/normalize")
async def normalize_file(
    filename: str,
    role: str = Header(..., convert_underscores=False)
):
    authorize_action(role, "transform")

    file_path = os.path.join(PROCESSED_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Processed file not found. Run /transform first.")

    df = pd.read_csv(file_path)
    df_norm = normalize_data(df)
    log_entry = log_transformation("Normalization", df_norm)

    norm_path = os.path.join(PROCESSED_DIR, f"normalized_{filename}")
    df_norm.to_csv(norm_path, index=False)

    return {"message": "Normalization complete.", "log_entry": log_entry}

@app.get("/normalized-files")
async def list_normalized_files(
    role: str = Header(..., convert_underscores=False)
):
    authorize_action(role, "view")
    try:
        files = [f for f in os.listdir(PROCESSED_DIR) if f.startswith("normalized_")]
        return {"files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/aggregate")
async def aggregate_file(
    filename: str,
    role: str = Header(..., convert_underscores=False)
):
    authorize_action(role, "transform")

    norm_path = os.path.join(PROCESSED_DIR, filename)
    if not os.path.exists(norm_path):
        raise HTTPException(status_code=404, detail="Normalized file not found. Run /normalize first.")

    try:
        df = pd.read_csv(norm_path)
        df_agg = aggregate_data(df)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    log_entry = log_transformation("Aggregation", df_agg)

    agg_path = os.path.join(PROCESSED_DIR, f"aggregated_{filename}")
    df_agg.to_csv(agg_path, index=False)

    return {"message": "Aggregation complete.", "log_entry": log_entry}

@app.get("/preview")
def preview_file(
    filename: str,
    role: str = Header(..., convert_underscores=False),
    source: str = "raw"
):
    base_dir = "data/processed" if source == "processed" else "data/raw"
    path = os.path.join("data/raw", filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        df = pd.read_csv(path)
        df = df.replace({pd.NA: None, pd.NaT: None, float('nan'): None, float('inf'): None, float('-inf'): None})
        df = df.where(pd.notnull(df), None)

        return {
            "columns": df.columns.tolist(),
            "rows": df.values.tolist()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

