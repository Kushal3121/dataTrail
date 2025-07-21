import os
import hashlib
import pandas as pd
import json
from datetime import datetime

PROVENANCE_LOG = "provenance/log.json"

def compute_sha256(df: pd.DataFrame) -> str:
    csv_bytes = df.to_csv(index=False).encode('utf-8')
    return hashlib.sha256(csv_bytes).hexdigest()

def load_provenance_log():
    if not os.path.exists(PROVENANCE_LOG):
        return []
    with open(PROVENANCE_LOG, 'r') as f:
        return json.load(f)

def save_provenance_log(log):
    os.makedirs(os.path.dirname(PROVENANCE_LOG), exist_ok=True)
    with open(PROVENANCE_LOG, 'w') as f:
        json.dump(log, f, indent=2)

def log_transformation(step: str, df: pd.DataFrame):
    hash_value = compute_sha256(df)
    log = load_provenance_log()

    previous_hash = log[-1]['hash'] if log else None
    log_entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "step": step,
        "hash": hash_value,
        "previous_hash": previous_hash
    }
    log.append(log_entry)
    save_provenance_log(log)
    return log_entry

def clean_data(file_path: str) -> pd.DataFrame:
    df = pd.read_csv(file_path)
    df = df.dropna()  # Example cleaning step
    return df

def normalize_data(df: pd.DataFrame) -> pd.DataFrame:
    numeric_cols = df.select_dtypes(include='number').columns
    df_norm = df.copy()
    for col in numeric_cols:
        min_val = df[col].min()
        max_val = df[col].max()
        if min_val != max_val:
            df_norm[col] = (df[col] - min_val) / (max_val - min_val)
    return df_norm

def aggregate_data(df: pd.DataFrame, group_by: str = "Country") -> pd.DataFrame:
    if group_by not in df.columns:
        raise ValueError(f"Column '{group_by}' not found in DataFrame.")
    
    numeric_cols = df.select_dtypes(include='number').columns
    df_agg = df.groupby(group_by)[numeric_cols].mean().reset_index()
    return df_agg