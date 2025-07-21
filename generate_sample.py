import pandas as pd
import os

os.makedirs("data/raw", exist_ok=True)

df = pd.DataFrame({
    "Name": ["Alice", "Bob", "Charlie", "David", "Eve"],
    "Age": [25, 30, None, 22, 29],
    "Country": ["USA", "India", "UK", "Germany", None]
})

file_path = "data/raw/sample.csv"
df.to_csv(file_path, index=False)
print(f"Sample CSV created at: {file_path}")
