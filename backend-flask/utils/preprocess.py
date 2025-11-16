import pandas as pd
import numpy as np
import random

df = pd.read_csv("dataset/raw_data/dft_traffic_counts_raw_counts.csv", low_memory=False)

df['count_date'] = pd.to_datetime(df['count_date'], errors='coerce')
df['hour'] = pd.to_numeric(df['hour'], errors='coerce')
df['all_motor_vehicles'] = pd.to_numeric(df['all_motor_vehicles'], errors='coerce')


df = df[df['local_authority_name'] == 'City of London']

df = df.dropna(subset=['count_date', 'hour', 'all_motor_vehicles'])

result = df.groupby([df['count_date'].dt.date, 'hour'])['all_motor_vehicles']\
           .sum()\
           .reset_index(name='vehicle_count')

result['weekday'] = pd.to_datetime(result['count_date']).dt.weekday

min_val = result['vehicle_count'].min()
max_val = result['vehicle_count'].max()

result['traffic_score'] = result['vehicle_count'].apply(
    lambda v: 5 * (v - min_val) / (max_val - min_val)
)

random.seed(42)


threshold_high = result['vehicle_count'].quantile(0.85)
threshold_low = result['vehicle_count'].quantile(0.30)

def assign_weather(vc):
    if vc >= threshold_high:
        return 0
    elif vc <= threshold_low:
        return random.choices([1, 2], weights=[0.5, 0.5])[0]
    else:
        return random.choices([0, 1], weights=[0.4, 0.6])[0]


def assign_event(vc):
    if vc >= threshold_high:
        return 1 if random.random() < 0.7 else 0
    elif vc <= threshold_low:
        return 0
    else:
        return 1 if random.random() < 0.1 else 0

result['weather'] = result['vehicle_count'].apply(assign_weather)
result['event'] = result['vehicle_count'].apply(assign_event)

result.to_csv("dataset/processed/city_of_london_full_normalized.csv", index=False)

print("Success.")
print(result.head())
