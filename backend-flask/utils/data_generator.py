import pandas as pd
import numpy as np

np.random.seed(42)

n_samples = 500

hours = np.random.randint(0, 24, n_samples)
temperatures = np.random.randint(0, 36, n_samples)
events = np.random.choice([0, 1, 2], n_samples)

congestion = []
for h, t, e in zip(hours, temperatures, events):
    base = 2
    if 7 <= h <= 9 or 16 <= h <= 18:
        base+=1
    if t > 30:
        base +=1
    if e == 1:
        base+=1
    if e == 2:
        base+=2
    congestion.append(min(base, 5))

df = pd.DataFrame({
    'hour': hours,
    'temperature': temperatures,
    'event': events,
    'congestion': congestion
})

df.to_csv('dataset/simulated_traffic.csv', index=False)
print(df.head())