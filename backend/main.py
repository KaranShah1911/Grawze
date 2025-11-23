import numpy as np
import pandas as pd
import joblib
import tensorflow as tf
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

# Initialize App
app = FastAPI()

# CORS (Allows Next.js to connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Variables
model = None
scaler = None

# ==========================================
# 1. LOAD RESOURCES ON STARTUP
# ==========================================
@app.on_event("startup")
def load_resources():
    global model, scaler
    try:
        # 1. Load Scaler
        scaler = joblib.load('chainguard_scaler.pkl')
        print("✅ Scaler loaded.")

        # 2. Load Keras Model (.h5)
        model = tf.keras.models.load_model('chainguard_model.h5')
        print("✅ Keras Model loaded successfully.")
        
    except Exception as e:
        print(f"❌ Error loading resources: {e}")
        print("Ensure 'chainguard_model.h5' and 'chainguard_scaler.pkl' are in this folder.")

# ==========================================
# 2. INPUT DATA SCHEMA
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

# ==========================================
# 3. PREPROCESSING LOGIC
# ==========================================
# These must match the top 5 from your training dataset.
# Based on common Ethereum patterns, these are likely:
TOP_METHODS = [
    '0x',         # Simple Transfer
    '0xa9059cbb', # ERC20 Transfer
    '0x095ea7b3', # Approve
    '0x23b872dd', # TransferFrom
    '0xf7654176'  # Withdraw
]

# Define the exact order of numerical columns from training
NUMERICAL_COLS = [
    'value_eth', 'gas', 'gas_price_gwei', 'nonce', 'data_bytes', 
    'hour', 'gas_usage_ratio', 'txn_fee', 
    'from_freq', 'to_freq' 
]

def preprocess(data: TransactionInput):
    row = {}

    # --- A. Numeric Conversions ---
    try:
        row['value_eth'] = float(data.value) / 10**18
    except:
        row['value_eth'] = 0.0
    
    row['gas'] = float(data.gas)
    try:
        row['gas_price_gwei'] = float(data.gas_price) / 10**9
    except:
        row['gas_price_gwei'] = 0.0
        
    row['nonce'] = float(data.nonce)
    row['data_bytes'] = float(len(data.input_data))
    
    dt = datetime.fromtimestamp(data.timestamp)
    row['hour'] = float(dt.hour)
    
    # Feature Engineering
    row['gas_usage_ratio'] = 1.0 # Assumption for pending tx
    row['txn_fee'] = row['gas'] * row['gas_price_gwei']
    
    # Mock Frequencies (In prod, fetch from DB)
    row['from_freq'] = 100.0
    row['to_freq'] = 100.0

    # --- B. Log Scaling (Match Training) ---
    cols_to_log = ['value_eth', 'gas', 'gas_price_gwei', 'nonce', 'data_bytes', 'txn_fee']
    for col in cols_to_log:
        row[col] = np.log1p(row[col])

    # --- C. Prepare Numerical Vector ---
    num_vector = [row[col] for col in NUMERICAL_COLS]
    num_array = np.array([num_vector]) # Shape (1, 10)
    
    # --- D. Scale Numerical Vector ---
    # We only scale the numerical part, just like in training:
    # X[numerical_features] = scaler.fit_transform(...)
    scaled_nums = scaler.transform(num_array)
    
    # --- E. Categorical (One-Hot) ---
    method_id = data.input_data[:10]
    cleaned_method = method_id if method_id in TOP_METHODS else 'Other'
    
    # We need to create the One-Hot vector in alphabetical order of columns
    # Columns: method_0x, method_0x09..., method_0x23..., method_0xa9..., method_0xf7..., method_Other
    # To be safe, we build a dictionary and sort it.
    cat_dict = {}
    all_categories = TOP_METHODS + ['Other']
    
    for cat in all_categories:
        col_name = f"method_{cat}"
        cat_dict[col_name] = 1.0 if cat == cleaned_method else 0.0
        
    # Sort keys to match pd.get_dummies default behavior
    sorted_cat_keys = sorted(cat_dict.keys())
    cat_vector = [cat_dict[k] for k in sorted_cat_keys]
    cat_array = np.array([cat_vector])

    # --- F. Combine ---
    # Final Input = [Scaled Numericals] + [One-Hot Categoricals]
    final_input = np.hstack([scaled_nums, cat_array])
    
    return final_input

# ==========================================
# 4. API ENDPOINT
# ==========================================
@app.post("/predict")
async def predict_fraud(txn: TransactionInput):
    try:
        # 1. Preprocess
        input_vector = preprocess(txn)
        
        # 2. Predict (Keras)
        prediction = model.predict(input_vector)
        probability = float(prediction[0][0]) # Extract scalar
        
        # 3. Logic
        risk_score = int(probability * 100)
        is_fraud = risk_score > 50  # Threshold
        
        # Console Logging for Demo
        print("\n" + "="*30)
        print(f"📢 TRANSACTION ANALYZED")
        print(f"💰 Value: {txn.value} Wei")
        print(f"⛽ Gas Price: {txn.gas_price} Wei")
        print(f"📊 Risk Score: {risk_score}/100")
        
        if is_fraud:
            print(f"❌ VERDICT: FRAUD DETECTED!")
        else:
            print(f"✅ VERDICT: Safe")
        print("="*30 + "\n")

        return {
            "is_fraud": is_fraud,
            "risk_score": risk_score,
            "alert": "CRITICAL: High Risk" if is_fraud else "Low Risk"
        }
        
    except Exception as e:
        print(f"Prediction Error: {e}")
        return {"error": str(e)}