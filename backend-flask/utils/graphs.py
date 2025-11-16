import pandas as pd
import matplotlib.pyplot as plt
import pickle
from sklearn.metrics import mean_squared_error
import numpy as np
from sklearn.model_selection import train_test_split


with open('model/london_data_normalized.pkl', 'rb') as f:
    model = pickle.load(f)

data = pd.read_csv('dataset/processed/city_of_london_full_normalized.csv')
data.columns = data.columns.str.strip()

x = data[['hour', 'weather', 'event', 'weekday']]
y = data['traffic_score']

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

y_pred = model.predict(x_test)

mse = mean_squared_error(y_test, y_pred)
print(f"Mean Squared Error: {mse:.4f}")
plt.figure(figsize=(8, 6))
errors = np.abs(y_test - y_pred)
plt.scatter(y_test, y_pred, c=errors, cmap='coolwarm', alpha=0.6)
plt.colorbar(label='Absolute error')
plt.xlabel("Real values (y_test)")
plt.ylabel("Predicted values (y_pred)")
plt.title("Prediction vs Real Values")
plt.grid(True)
plt.tight_layout()
plt.show()


