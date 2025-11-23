import os
import numpy as np
import pandas as pd
import joblib
import tensorflow as tf
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from datetime import datetime
from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uuid

# ==========================================
# 1. DATABASE CONFIGURATION
# ==========================================
load_dotenv()

# Global DB Connection
conn = None

def get_db_connection():
    """
    Establishes a connection to the PostgreSQL database.
    Using autocommit=True so changes verify immediately without manual commits.
    """
    try:
        connection = psycopg2.connect(
            user=os.getenv("user"),
            password=os.getenv("password"),
            host=os.getenv("host"),
            port=os.getenv("port"),
            dbname=os.getenv("dbname")
        )
        connection.autocommit = True 
        print("✅ Connected to PostgreSQL")
        return connection
    except Exception as e:
        print(f"❌ Database Connection Failed: {e}")
        return None

# ==========================================
# 2. LOAD AI RESOURCES
# ==========================================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None
scaler = None

@app.on_event("startup")
def startup_event():
    global model, scaler, conn
    
    # Load AI
    try:
        scaler = joblib.load('chainguard_scaler.pkl')
        model = tf.keras.models.load_model('chainguard_model.h5')
        print("✅ AI Model Loaded")
    except Exception as e:
        print(f"❌ AI Load Error: {e}")

    # Connect DB
    conn = get_db_connection()

# ==========================================
# 3. DATABASE HELPER FUNCTIONS (Refactored for Psycopg2)
# ==========================================

def get_wallet_stats(address: str):
    """
    Fetch frequency stats using SQL SELECT.
    Returns (sent_count, received_count).
    """
    if not conn: return 0, 0
    
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT total_tx_sent, total_tx_received FROM wallet_stats WHERE address = %s", 
                (address,)
            )
            row = cur.fetchone()
            if row:
                return row[0], row[1]
            return 0, 0
    except Exception as e:
        print(f"⚠️ DB Read Error: {e}")
        return 0, 0

def update_db_background(txn_data, risk_score, is_fraud):
    """
    Background Task: Uses Atomic SQL Upserts to update counts and log txn.
    """
    if not conn: return

    sender = txn_data.from_address
    receiver = txn_data.to_address
    current_time = datetime.now()
    
    # GENERATE A FAKE HASH (To satisfy the DB's Primary Key requirement)
    # We add 'pre_' so you know it was a pre-flight check, not a real tx
    fake_hash = f"pre_{uuid.uuid4().hex}" 

    try:
        with conn.cursor() as cur:
            # 1. UPSERT SENDER
            sql_sender = """
                INSERT INTO wallet_stats (address, total_tx_sent, total_tx_received, last_active)
                VALUES (%s, 1, 0, %s)
                ON CONFLICT (address) 
                DO UPDATE SET 
                    total_tx_sent = wallet_stats.total_tx_sent + 1,
                    last_active = %s;
            """
            cur.execute(sql_sender, (sender, current_time, current_time))

            # 2. UPSERT RECEIVER
            sql_receiver = """
                INSERT INTO wallet_stats (address, total_tx_sent, total_tx_received, last_active)
                VALUES (%s, 0, 1, %s)
                ON CONFLICT (address) 
                DO UPDATE SET 
                    total_tx_received = wallet_stats.total_tx_received + 1,
                    last_active = %s;
            """
            cur.execute(sql_receiver, (receiver, current_time, current_time))

            # 3. LOG TRANSACTION (Now includes 'hash')
            sql_log = """
                INSERT INTO transactions 
                (hash, from_address, to_address, value_wei, risk_score, is_flagged_fraud, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cur.execute(sql_log, (
                fake_hash,   # <--- PASS THE FAKE HASH HERE
                sender, 
                receiver, 
                str(txn_data.value), 
                risk_score, 
                is_fraud, 
                current_time
            ))
            
            print(f"📝 DB Updated for {sender} -> {receiver}")

    except Exception as e:
        print(f"❌ DB Write Error: {e}")

# ==========================================
# 4. INPUT SCHEMA & PREPROCESSING
# ==========================================
class TransactionInput(BaseModel):
    from_address: str
    to_address: str
    value: str
    gas: int
    gas_price: str
    input_data: str
    nonce: int
    timestamp: int

TOP_METHODS = ['0x', '0xa9059cbb', '0x095ea7b3', '0x23b872dd', '0xf7654176']
NUMERICAL_COLS = ['value_eth', 'gas', 'gas_price_gwei', 'nonce', 'data_bytes', 'hour', 'gas_usage_ratio', 'txn_fee', 'from_freq', 'to_freq']

def preprocess(data: TransactionInput, from_freq: int, to_freq: int):
    row = {}
    
    # Numeric Conversions
    try: row['value_eth'] = float(data.value) / 10**18
    except: row['value_eth'] = 0.0
    
    row['gas'] = float(data.gas)
    
    try: row['gas_price_gwei'] = float(data.gas_price) / 10**9
    except: row['gas_price_gwei'] = 0.0
        
    row['nonce'] = float(data.nonce)
    row['data_bytes'] = float(len(data.input_data))
    dt = datetime.fromtimestamp(data.timestamp)
    row['hour'] = float(dt.hour)
    
    # Feature Engineering
    row['gas_usage_ratio'] = 1.0 
    row['txn_fee'] = row['gas'] * row['gas_price_gwei']
    
    # --- REAL DB DATA INJECTED HERE ---
    row['from_freq'] = float(from_freq)
    row['to_freq'] = float(to_freq)

    # Log Scaling
    for col in ['value_eth', 'gas', 'gas_price_gwei', 'nonce', 'data_bytes', 'txn_fee']:
        row[col] = np.log1p(row[col])

    # Prepare Vectors
    num_vector = [row[col] for col in NUMERICAL_COLS]
    scaled_nums = scaler.transform(np.array([num_vector]))
    
    # One-Hot Encoding
    method_id = data.input_data[:10]
    cleaned_method = method_id if method_id in TOP_METHODS else 'Other'
    cat_dict = {}
    for cat in TOP_METHODS + ['Other']:
        cat_dict[f"method_{cat}"] = 1.0 if cat == cleaned_method else 0.0
        
    sorted_cats = [cat_dict[k] for k in sorted(cat_dict.keys())]
    
    return np.hstack([scaled_nums, np.array([sorted_cats])])

# ==========================================
# 5. GET WALLET INFO ENDPOINT
# ==========================================
@app.get("/wallet/{address}")
async def get_wallet_info(address: str):
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection not available")

    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM wallet_stats WHERE address = %s", (address,))
            wallet_data = cur.fetchone()
            if wallet_data:
                # Fetch recent transactions for the address
                cur.execute("""
                    SELECT * FROM transactions 
                    WHERE from_address = %s OR to_address = %s
                    ORDER BY created_at DESC
                    LIMIT 10
                """, (address, address))
                transactions = cur.fetchall()
                wallet_data['transactions'] = transactions
                print(f"✅ Found data for {address}")
                return wallet_data
            else:
                print(f"⚠️ No data found for {address}")
                raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        print(f"❌ DB Read Error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ==========================================
# 6. PREDICT ENDPOINT
# ==========================================
@app.post("/predict")
async def predict_fraud(txn: TransactionInput, background_tasks: BackgroundTasks):
    try:
        # 1. Fetch Real History from Postgres
        sender_sent_count, _ = get_wallet_stats(txn.from_address)
        _, receiver_recv_count = get_wallet_stats(txn.to_address)
        
        # 2. Preprocess with Real Data
        input_vector = preprocess(txn, sender_sent_count, receiver_recv_count)
        
        # 3. Predict
        prediction = model.predict(input_vector)
        probability = float(prediction[0][0])
        risk_score = int(probability * 100)
        is_fraud = risk_score > 50
        print('risk_score: ', risk_score)
        # 4. Schedule DB Update (Runs AFTER response is sent)
        background_tasks.add_task(update_db_background, txn, risk_score, is_fraud)

        # 5. Return Result
        return {
            "is_fraud": is_fraud,
            "risk_score": risk_score,
            "alert": "CRITICAL" if is_fraud else "SAFE",
            "sender_history": sender_sent_count
        }
        
    except Exception as e:
        return {"error": str(e)}