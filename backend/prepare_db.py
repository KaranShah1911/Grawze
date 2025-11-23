import pandas as pd
import numpy as np

# 1. LOAD DATA
try:
    df = pd.read_csv("Dataset.csv")
    print(f"✅ Loaded {len(df)} rows.")
except FileNotFoundError:
    print("❌ Error: Dataset.csv not found.")
    exit()

# 2. DATA CLEANING
# Fix Timestamp (Strip 'UTC' and '+00:00' to standard ISO format)
df['block_timestamp'] = df['block_timestamp'].astype(str).str.replace(' UTC', '', regex=False)
df['block_timestamp'] = df['block_timestamp'].str.replace('+00:00', '', regex=False)
df['block_timestamp'] = pd.to_datetime(df['block_timestamp'])

# Fix Value (Ensure it is a string representation of the integer, no scientific notation)
# Postgres 'numeric' or 'text' field needs clean number strings.
def clean_wei_string(x):
    try:
        # Convert float (1.5E+18) -> Int -> String
        return str(int(float(x)))
    except:
        return "0"

df['value_wei_str'] = df['value'].apply(clean_wei_string)

# Calculate Fraud Flag (If either sender or receiver was marked as scam in dataset)
df['is_flagged_fraud'] = (df['from_scam'] == 1) | (df['to_scam'] == 1)

# ==========================================
# 3. CREATE 'TRANSACTIONS' TABLE
# ==========================================
print("Processing Transactions Table...")

transactions_export = pd.DataFrame()
transactions_export['hash'] = df['hash']
transactions_export['from_address'] = df['from_address']
transactions_export['to_address'] = df['to_address']
transactions_export['value_wei'] = df['value_wei_str']
transactions_export['created_at'] = df['block_timestamp']
transactions_export['is_flagged_fraud'] = df['is_flagged_fraud']

# 'risk_score': Since these are historical, we don't have a live AI score. 
# We will set them to -1 (indicating "Not Scored") or 0.
transactions_export['risk_score'] = 0 

# Save to CSV
transactions_export.to_csv('upload_transactions.csv', index=False)
print(f"✅ Created 'upload_transactions.csv' with {len(transactions_export)} rows.")


# ==========================================
# 4. CREATE 'WALLET_STATS' TABLE
# ==========================================
print("Processing Wallet Stats Table...")

# Logic: We need to group by address to find total activity and scam status

# A. Analyze Senders
sender_stats = df.groupby('from_address').agg({
    'hash': 'count',                  # Count transactions sent
    'block_timestamp': 'max',         # Last active time
    'from_scam': 'max'                # If they were ever marked as scam
}).rename(columns={'hash': 'total_tx_sent', 'from_scam': 'is_scam_sender'})

# B. Analyze Receivers
receiver_stats = df.groupby('to_address').agg({
    'hash': 'count',                  # Count transactions received
    'block_timestamp': 'max',         # Last active time
    'to_scam': 'max'                  # If they were ever marked as scam
}).rename(columns={'hash': 'total_tx_received', 'to_scam': 'is_scam_receiver'})

# C. Merge (Outer Join) - Because some addresses only send, some only receive
wallet_df = pd.merge(sender_stats, receiver_stats, left_index=True, right_index=True, how='outer')

# D. Clean up the Merged Data
# Fill NaNs (e.g., if someone never sent, total_tx_sent is NaN -> 0)
wallet_df['total_tx_sent'] = wallet_df['total_tx_sent'].fillna(0).astype(int)
wallet_df['total_tx_received'] = wallet_df['total_tx_received'].fillna(0).astype(int)

# Combine Scam Flags
# A wallet is a "Known Scam" if it was flagged as a scammer when sending OR receiving
wallet_df['is_known_scam'] = (wallet_df['is_scam_sender'] == 1) | (wallet_df['is_scam_receiver'] == 1)
wallet_df['is_known_scam'] = wallet_df['is_known_scam'].fillna(False).astype(bool)

# Combine Timestamps (Take the latest of the two)
wallet_df['last_active'] = wallet_df[['block_timestamp_x', 'block_timestamp_y']].max(axis=1)

# E. Final Formatting
wallet_export = pd.DataFrame()
wallet_export['address'] = wallet_df.index
wallet_export['total_tx_sent'] = wallet_df['total_tx_sent'].values
wallet_export['total_tx_received'] = wallet_df['total_tx_received'].values
wallet_export['is_known_scam'] = wallet_df['is_known_scam'].values
wallet_export['last_active'] = wallet_export['last_active'] = wallet_df['last_active'].values

# Save to CSV
wallet_export.to_csv('upload_wallet_stats.csv', index=False)
print(f"✅ Created 'upload_wallet_stats.csv' with {len(wallet_export)} unique wallets.")