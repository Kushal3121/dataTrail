import os
import hashlib
import pandas as pd
import json
from datetime import datetime
import pytz
from sklearn.preprocessing import MinMaxScaler


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

def log_transformation(step: str, df: pd.DataFrame, file_name: str = None):
    hash_value = compute_sha256(df)
    log = load_provenance_log()

    previous_hash = log[-1]['hash'] if log else None

    central = pytz.timezone("America/Chicago")
    timestamp = datetime.now(central).isoformat()

    log_entry = {
        "timestamp": timestamp,
        "step": step,
        "hash": hash_value,
        "previous_hash": previous_hash
    }

    if file_name:
        log_entry["file_name"] = file_name

    log.append(log_entry)
    save_provenance_log(log)
    return log_entry


def clean_data(file_path: str) -> pd.DataFrame:
    df = pd.read_csv(file_path)
    df = df.dropna()  # Example cleaning step
    return df

def normalize_data(df):
    df_copy = df.copy()

    columns_to_normalize = ['Quantity']  # Only normalize what's logical
    scaler = MinMaxScaler()

    for col in columns_to_normalize:
        if col in df_copy.columns:
            df_copy[col] = scaler.fit_transform(df_copy[[col]])

    return df_copy

def aggregate_data(df):
    if 'Country' not in df.columns:
        raise ValueError("Column 'Country' not found for aggregation")

    # Aggregate raw (or normalized selectively) data
    aggregation = df.groupby('Country').agg({
        'Quantity': 'sum',
        'Unit Price': 'mean',
        'Discount (%)': 'mean',
        'Total Sales': 'sum',
        'Profit': 'sum',
        'Shipping Cost': 'mean'
    }).reset_index()

    return aggregation