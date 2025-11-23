import pandas as pd

df = pd.read_csv('upload_transactions.csv')
a = len(df)
df = df.drop_duplicates(subset=['hash'])
b = len(df)
print(b-a)
df.to_csv('upload_transactions (1).csv', index=False)
