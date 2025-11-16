import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import pickle

data = pd.read_csv('dataset/processed/city_of_london_full_normalized.csv')

df = pd.DataFrame(data)

df.columns = df.columns.str.strip()

x = df[['hour', 'weather', 'event', 'weekday']]
y = df['traffic_score']

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(random_state=42)
model.fit(x_train, y_train)

y_pred = model.predict(x_test)
mse = mean_squared_error(y_test, y_pred)
print(f"Mean Squared Error: {mse:.4f}")

with open('model/london_data_normalized.pkl', 'wb') as f:
    pickle.dump(model, f)

print("Succes antrenare")
